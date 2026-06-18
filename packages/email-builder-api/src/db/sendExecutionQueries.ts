import { pool } from './connection';
import type { ExecuteMode } from '../services/executeSend';
import type { SendExecutionDTO, SendExecutionStatus, SendExecutionTrigger } from '../types/send';

export type { SendExecutionTrigger, SendExecutionStatus };

export interface SendExecutionRow {
  id: string;
  send_id: string;
  schedule_id: string | null;
  trigger_type: SendExecutionTrigger;
  mode: ExecuteMode;
  intended_run_at: Date | null;
  status: SendExecutionStatus;
  mailchimp_campaign_id: string | null;
  error_message: string | null;
  started_at: Date;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

function mapExecutionRow(row: SendExecutionRow & { send_name: string }): SendExecutionDTO {
  return {
    id: row.id,
    sendId: row.send_id,
    sendName: row.send_name,
    scheduleId: row.schedule_id,
    triggerType: row.trigger_type,
    mode: row.mode,
    intendedRunAt: row.intended_run_at ? row.intended_run_at.toISOString() : null,
    status: row.status,
    mailchimpCampaignId: row.mailchimp_campaign_id,
    errorMessage: row.error_message,
    startedAt: row.started_at.toISOString(),
    completedAt: row.completed_at ? row.completed_at.toISOString() : null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listSendExecutions(options: {
  limit?: number;
  sendId?: string;
  triggerType?: SendExecutionTrigger;
  status?: SendExecutionStatus;
}): Promise<SendExecutionDTO[]> {
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 500);
  const conditions = ['1=1'];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (options.sendId) {
    conditions.push(`e.send_id = $${paramIndex++}`);
    params.push(options.sendId);
  }
  if (options.triggerType) {
    conditions.push(`e.trigger_type = $${paramIndex++}`);
    params.push(options.triggerType);
  }
  if (options.status) {
    conditions.push(`e.status = $${paramIndex++}`);
    params.push(options.status);
  }

  params.push(limit);
  const result = await pool.query<SendExecutionRow & { send_name: string }>(
    `SELECT e.*, s.name AS send_name
     FROM email_send_executions e
     JOIN email_sends s ON s.id = e.send_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY e.started_at DESC
     LIMIT $${paramIndex}`,
    params
  );

  return result.rows.map(mapExecutionRow);
}

export type ClaimScheduledExecutionResult =
  | { action: 'proceed'; executionId: string }
  | { action: 'skip'; reason: 'already_sent' | 'already_skipped' | 'in_progress' };

/** Treat in-flight executions as stale after this window so retries can proceed. */
const STALE_STARTED_MS = 15 * 60 * 1000;

function isUniqueViolation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === '23505';
}

export async function beginManualExecution(sendId: string, mode: ExecuteMode): Promise<string> {
  const result = await pool.query<{ id: string }>(
    `INSERT INTO email_send_executions (send_id, trigger_type, mode, status)
     VALUES ($1, 'manual', $2, 'started')
     RETURNING id`,
    [sendId, mode]
  );
  return result.rows[0].id;
}

export async function claimScheduledExecution(
  sendId: string,
  scheduleId: string,
  intendedRunAt: Date,
  mode: ExecuteMode
): Promise<ClaimScheduledExecutionResult> {
  try {
    const result = await pool.query<{ id: string }>(
      `INSERT INTO email_send_executions (
        send_id, schedule_id, trigger_type, mode, intended_run_at, status
      ) VALUES ($1, $2, 'scheduled', $3, $4, 'started')
      RETURNING id`,
      [sendId, scheduleId, mode, intendedRunAt]
    );
    return { action: 'proceed', executionId: result.rows[0].id };
  } catch (err) {
    if (!isUniqueViolation(err)) throw err;
  }

  const existing = await pool.query<Pick<SendExecutionRow, 'id' | 'status' | 'started_at'>>(
    `SELECT id, status, started_at
     FROM email_send_executions
     WHERE schedule_id = $1 AND intended_run_at = $2`,
    [scheduleId, intendedRunAt]
  );
  const row = existing.rows[0];
  if (!row) {
    return { action: 'skip', reason: 'in_progress' };
  }

  if (row.status === 'sent') {
    return { action: 'skip', reason: 'already_sent' };
  }
  if (row.status === 'skipped') {
    return { action: 'skip', reason: 'already_skipped' };
  }
  if (row.status === 'started') {
    const ageMs = Date.now() - row.started_at.getTime();
    if (ageMs < STALE_STARTED_MS) {
      return { action: 'skip', reason: 'in_progress' };
    }
  }

  await pool.query(
    `UPDATE email_send_executions SET
      status = 'started',
      started_at = NOW(),
      completed_at = NULL,
      error_message = NULL,
      mailchimp_campaign_id = NULL,
      updated_at = NOW()
     WHERE id = $1`,
    [row.id]
  );
  return { action: 'proceed', executionId: row.id };
}

export async function completeSendExecution(
  executionId: string,
  patch: {
    status: Exclude<SendExecutionStatus, 'started'>;
    mailchimpCampaignId?: string | null;
    errorMessage?: string | null;
  }
): Promise<void> {
  await pool.query(
    `UPDATE email_send_executions SET
      status = $2,
      mailchimp_campaign_id = COALESCE($3, mailchimp_campaign_id),
      error_message = $4,
      completed_at = NOW(),
      updated_at = NOW()
     WHERE id = $1`,
    [executionId, patch.status, patch.mailchimpCampaignId ?? null, patch.errorMessage ?? null]
  );
}
