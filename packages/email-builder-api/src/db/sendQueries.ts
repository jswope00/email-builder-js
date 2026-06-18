import { pool } from './connection';
import { computeInitialNextRunAt } from '../utils/scheduleNextRun';
import type {
  CreateSendInput,
  EmailSendListItem,
  SendReorderDirection,
  SendScheduleDTO,
  SendScheduleRow,
} from '../types/send';

export interface ScheduleInsertRow {
  scheduleKind: 'live' | 'test';
  scheduleType: 'one_off' | 'recurring';
  isActive: boolean;
  timezone: string;
  oneOffAt: string | null;
  recurringWeekdays: number[] | null;
  recurringTimeLocal: string | null;
  nextRunAt: Date | null;
}

function mapScheduleRow(row: SendScheduleRow): SendScheduleDTO {
  return {
    id: row.id,
    scheduleKind: row.schedule_kind,
    scheduleType: row.schedule_type,
    isActive: row.is_active,
    timezone: row.timezone,
    oneOffAt: row.one_off_at ? row.one_off_at.toISOString() : null,
    recurringWeekdays: row.recurring_weekdays,
    recurringTimeLocal: row.recurring_time_local,
    nextRunAt: row.next_run_at ? row.next_run_at.toISOString() : null,
    lastRunAt: row.last_run_at ? row.last_run_at.toISOString() : null,
  };
}

function mapSendRow(row: {
  id: string;
  name: string;
  template_id: string;
  template_name: string;
  template_slug: string;
  subject: string;
  list_id: string;
  segment_id: number | null;
  from_name: string;
  from_email: string;
  reply_to: string;
  test_subject: string | null;
  test_list_id: string | null;
  test_segment_id: number | null;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  sort_order: number;
}, schedules: SendScheduleDTO[]): EmailSendListItem {
  return {
    id: row.id,
    name: row.name,
    templateId: row.template_id,
    templateName: row.template_name,
    templateSlug: row.template_slug,
    subject: row.subject,
    listId: row.list_id,
    segmentId: row.segment_id,
    fromName: row.from_name,
    fromEmail: row.from_email,
    replyTo: row.reply_to,
    testSubject: row.test_subject,
    testListId: row.test_list_id,
    testSegmentId: row.test_segment_id,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    isActive: row.is_active,
    sortOrder: row.sort_order,
    schedules,
  };
}

export async function listSends(includeInactive = false): Promise<EmailSendListItem[]> {
  const sendActiveClause = includeInactive ? '' : 'AND s.is_active = true';
  const sendResult = await pool.query(
    `SELECT s.*, t.name AS template_name, t.slug AS template_slug
     FROM email_sends s
     JOIN email_templates t ON t.id = s.template_id
     WHERE t.is_active = true ${sendActiveClause}
     ORDER BY s.sort_order ASC, s.created_at ASC`
  );

  if (sendResult.rows.length === 0) return [];

  const sendIds = sendResult.rows.map((r: { id: string }) => r.id);
  const schedResult = await pool.query<SendScheduleRow>(
    `SELECT * FROM email_send_schedules WHERE send_id = ANY($1::uuid[]) ORDER BY created_at ASC`,
    [sendIds]
  );

  const bySend = new Map<string, SendScheduleDTO[]>();
  for (const row of schedResult.rows) {
    const list = bySend.get(row.send_id) ?? [];
    list.push(mapScheduleRow(row));
    bySend.set(row.send_id, list);
  }

  return sendResult.rows.map((row: any) => mapSendRow(row, bySend.get(row.id) ?? []));
}

export async function getSendById(id: string): Promise<EmailSendListItem | null> {
  const sendResult = await pool.query(
    `SELECT s.*, t.name AS template_name, t.slug AS template_slug
     FROM email_sends s
     JOIN email_templates t ON t.id = s.template_id
     WHERE s.id = $1`,
    [id]
  );
  if (sendResult.rows.length === 0) return null;
  const row = sendResult.rows[0];

  const schedResult = await pool.query<SendScheduleRow>(
    `SELECT * FROM email_send_schedules WHERE send_id = $1 ORDER BY created_at ASC`,
    [id]
  );

  return mapSendRow(row, schedResult.rows.map(mapScheduleRow));
}

async function insertSchedules(client: import('pg').PoolClient, sendId: string, schedules: ScheduleInsertRow[]) {
  for (const sch of schedules) {
    await client.query(
      `INSERT INTO email_send_schedules (
        send_id, schedule_kind, schedule_type, is_active, timezone,
        one_off_at, recurring_weekdays, recurring_time_local, next_run_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        sendId,
        sch.scheduleKind,
        sch.scheduleType,
        sch.isActive,
        sch.timezone,
        sch.oneOffAt != null ? new Date(sch.oneOffAt) : null,
        sch.recurringWeekdays,
        sch.recurringTimeLocal,
        sch.nextRunAt,
      ]
    );
  }
}

export async function createSend(
  input: CreateSendInput,
  scheduleRows: ScheduleInsertRow[]
): Promise<EmailSendListItem> {
  const client = await pool.connect();
  let sendId: string;
  try {
    await client.query('BEGIN');
    const nextSort = await client.query<{ next: number }>(
      `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM email_sends`
    );
    const sortOrder = nextSort.rows[0]?.next ?? 0;
    const ins = await client.query(
      `INSERT INTO email_sends (
        name, template_id, subject, list_id, segment_id,
        from_name, from_email, reply_to,
        test_subject, test_list_id, test_segment_id, sort_order
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING id`,
      [
        input.name.trim() || 'Untitled send',
        input.templateId,
        input.subject,
        input.listId,
        input.segmentId ?? null,
        input.fromName,
        input.fromEmail,
        input.replyTo,
        input.testSubject ?? null,
        input.testListId ?? null,
        input.testSegmentId ?? null,
        sortOrder,
      ]
    );
    sendId = ins.rows[0].id as string;
    if (scheduleRows.length) {
      await insertSchedules(client, sendId, scheduleRows);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }

  const created = await getSendById(sendId);
  if (!created) throw new Error('Failed to load created send');
  return created;
}

export async function updateSend(
  id: string,
  input: CreateSendInput,
  scheduleRows: ScheduleInsertRow[]
): Promise<EmailSendListItem | null> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const upd = await client.query(
      `UPDATE email_sends SET
        name = $2,
        template_id = $3,
        subject = $4,
        list_id = $5,
        segment_id = $6,
        from_name = $7,
        from_email = $8,
        reply_to = $9,
        test_subject = $10,
        test_list_id = $11,
        test_segment_id = $12
      WHERE id = $1
      RETURNING id`,
      [
        id,
        input.name.trim() || 'Untitled send',
        input.templateId,
        input.subject,
        input.listId,
        input.segmentId ?? null,
        input.fromName,
        input.fromEmail,
        input.replyTo,
        input.testSubject ?? null,
        input.testListId ?? null,
        input.testSegmentId ?? null,
      ]
    );
    if (upd.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }
    await client.query(`DELETE FROM email_send_schedules WHERE send_id = $1`, [id]);
    if (scheduleRows.length) {
      await insertSchedules(client, id, scheduleRows);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return getSendById(id);
}

export async function softDeleteSend(id: string): Promise<boolean> {
  const r = await pool.query(`UPDATE email_sends SET is_active = false WHERE id = $1 AND is_active = true`, [id]);
  return r.rowCount !== null && r.rowCount > 0;
}

/** Permanently removes the send row; schedules cascade-delete. */
export async function hardDeleteSend(id: string): Promise<boolean> {
  const r = await pool.query(`DELETE FROM email_sends WHERE id = $1`, [id]);
  return r.rowCount !== null && r.rowCount > 0;
}

export async function setSendActive(id: string, isActive: boolean): Promise<boolean> {
  const r = await pool.query(`UPDATE email_sends SET is_active = $2, updated_at = NOW() WHERE id = $1`, [
    id,
    isActive,
  ]);
  return r.rowCount !== null && r.rowCount > 0;
}

type OrderedSendRow = { id: string; is_active: boolean };

async function fetchAllOrderedSendRows(): Promise<OrderedSendRow[]> {
  const result = await pool.query<OrderedSendRow>(
    `SELECT s.id, s.is_active
     FROM email_sends s
     JOIN email_templates t ON t.id = s.template_id
     WHERE t.is_active = true
     ORDER BY s.sort_order ASC, s.created_at ASC`
  );
  return result.rows;
}

function mergeVisibleReorder(
  fullRows: OrderedSendRow[],
  includeInactive: boolean,
  sendId: string,
  direction: SendReorderDirection
): string[] | null {
  const fullIds = fullRows.map((r) => r.id);
  if (!fullIds.includes(sendId)) return null;

  const visibleIds = includeInactive
    ? fullIds
    : fullRows.filter((r) => r.is_active).map((r) => r.id);

  const visibleIdx = visibleIds.indexOf(sendId);
  if (visibleIdx === -1) return null;

  let targetVisibleIdx = visibleIdx;
  switch (direction) {
    case 'up':
      targetVisibleIdx = Math.max(0, visibleIdx - 1);
      break;
    case 'down':
      targetVisibleIdx = Math.min(visibleIds.length - 1, visibleIdx + 1);
      break;
    case 'top':
      targetVisibleIdx = 0;
      break;
    case 'bottom':
      targetVisibleIdx = visibleIds.length - 1;
      break;
  }

  if (targetVisibleIdx === visibleIdx) return fullIds;

  const reorderedVisible = [...visibleIds];
  const [moved] = reorderedVisible.splice(visibleIdx, 1);
  reorderedVisible.splice(targetVisibleIdx, 0, moved);

  const newFullIds: string[] = [];
  let visibleQueue = [...reorderedVisible];
  for (const row of fullRows) {
    if (includeInactive || row.is_active) {
      const nextId = visibleQueue.shift();
      if (nextId) newFullIds.push(nextId);
    } else {
      newFullIds.push(row.id);
    }
  }

  return newFullIds;
}

export async function reorderSend(
  id: string,
  direction: SendReorderDirection,
  includeInactive = false
): Promise<boolean> {
  const fullRows = await fetchAllOrderedSendRows();
  const newOrder = mergeVisibleReorder(fullRows, includeInactive, id, direction);
  if (!newOrder) return false;

  const oldOrder = fullRows.map((r) => r.id);
  if (newOrder.length !== oldOrder.length || newOrder.every((id, i) => id === oldOrder[i])) {
    return fullRows.some((r) => r.id === id);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < newOrder.length; i++) {
      await client.query(`UPDATE email_sends SET sort_order = $2 WHERE id = $1`, [newOrder[i], i]);
    }
    await client.query('COMMIT');
    return true;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function setScheduleActive(
  sendId: string,
  scheduleId: string,
  isActive: boolean
): Promise<EmailSendListItem | null> {
  const sch = await pool.query<SendScheduleRow>(
    `SELECT * FROM email_send_schedules WHERE id = $1 AND send_id = $2`,
    [scheduleId, sendId]
  );
  if (sch.rows.length === 0) return null;
  const row = sch.rows[0];
  const nextRunAt = computeInitialNextRunAt({
    scheduleType: row.schedule_type,
    timezone: row.timezone,
    oneOffAt: row.one_off_at ? row.one_off_at.toISOString() : null,
    recurringWeekdays: row.recurring_weekdays,
    recurringTimeLocal: row.recurring_time_local,
    isActive,
  });
  await pool.query(
    `UPDATE email_send_schedules SET is_active = $2, next_run_at = $3, updated_at = NOW() WHERE id = $1`,
    [scheduleId, isActive, nextRunAt]
  );
  return getSendById(sendId);
}

export async function deleteScheduleRow(sendId: string, scheduleId: string): Promise<EmailSendListItem | null> {
  const r = await pool.query(
    `DELETE FROM email_send_schedules WHERE id = $1 AND send_id = $2 RETURNING id`,
    [scheduleId, sendId]
  );
  if (r.rows.length === 0) return null;
  return getSendById(sendId);
}

export interface DueScheduleBundle {
  schedule: SendScheduleRow;
  /** The next_run_at value cleared when this schedule was claimed. */
  claimedRunAt: Date;
  send: {
    id: string;
    name: string;
    template_id: string;
    subject: string;
    list_id: string;
    segment_id: number | null;
    from_name: string;
    from_email: string;
    reply_to: string;
    test_subject: string | null;
    test_list_id: string | null;
    test_segment_id: number | null;
  };
}

function mapDueScheduleRow(row: Record<string, unknown>): DueScheduleBundle {
  const claimedRunAt = row.sch_next_run_at as Date;
  return {
    claimedRunAt,
    schedule: {
      id: row.sch_id as string,
      send_id: row.sch_send_id as string,
      schedule_kind: row.sch_schedule_kind as SendScheduleRow['schedule_kind'],
      schedule_type: row.sch_schedule_type as SendScheduleRow['schedule_type'],
      is_active: row.sch_is_active as boolean,
      timezone: row.sch_timezone as string,
      one_off_at: row.sch_one_off_at as Date | null,
      recurring_weekdays: row.sch_recurring_weekdays as number[] | null,
      recurring_time_local: row.sch_recurring_time_local as string | null,
      next_run_at: null,
      last_run_at: row.sch_last_run_at as Date | null,
      created_at: row.sch_created_at as Date,
      updated_at: row.sch_updated_at as Date,
    },
    send: {
      id: row.send_id as string,
      name: row.send_name as string,
      template_id: row.send_template_id as string,
      subject: row.send_subject as string,
      list_id: row.send_list_id as string,
      segment_id: row.send_segment_id as number | null,
      from_name: row.send_from_name as string,
      from_email: row.send_from_email as string,
      reply_to: row.send_reply_to as string,
      test_subject: row.send_test_subject as string | null,
      test_list_id: row.send_test_list_id as string | null,
      test_segment_id: row.send_test_segment_id as number | null,
    },
  };
}

const DUE_SCHEDULE_SELECT = `
  SELECT
    sch.id AS sch_id,
    sch.send_id AS sch_send_id,
    sch.schedule_kind AS sch_schedule_kind,
    sch.schedule_type AS sch_schedule_type,
    sch.is_active AS sch_is_active,
    sch.timezone AS sch_timezone,
    sch.one_off_at AS sch_one_off_at,
    sch.recurring_weekdays AS sch_recurring_weekdays,
    sch.recurring_time_local AS sch_recurring_time_local,
    sch.next_run_at AS sch_next_run_at,
    sch.last_run_at AS sch_last_run_at,
    sch.created_at AS sch_created_at,
    sch.updated_at AS sch_updated_at,
    s.id AS send_id,
    s.name AS send_name,
    s.template_id AS send_template_id,
    s.subject AS send_subject,
    s.list_id AS send_list_id,
    s.segment_id AS send_segment_id,
    s.from_name AS send_from_name,
    s.from_email AS send_from_email,
    s.reply_to AS send_reply_to,
    s.test_subject AS send_test_subject,
    s.test_list_id AS send_test_list_id,
    s.test_segment_id AS send_test_segment_id
  FROM email_send_schedules sch
  JOIN email_sends s ON s.id = sch.send_id
  WHERE sch.is_active = true
    AND sch.next_run_at IS NOT NULL
    AND sch.next_run_at <= $1
    AND s.is_active = true`;

/**
 * Atomically claims due schedules by clearing next_run_at so other workers/ticks
 * cannot pick them up while the send is in progress.
 */
export async function claimDueSchedules(before: Date): Promise<DueScheduleBundle[]> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const due = await client.query(`${DUE_SCHEDULE_SELECT} FOR UPDATE OF sch SKIP LOCKED`, [before]);
    if (due.rows.length === 0) {
      await client.query('COMMIT');
      return [];
    }

    const ids = due.rows.map((row: { sch_id: string }) => row.sch_id);
    await client.query(
      `UPDATE email_send_schedules SET next_run_at = NULL, updated_at = NOW() WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    await client.query('COMMIT');
    return due.rows.map((row) => mapDueScheduleRow(row));
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/** Restores a claimed schedule so it can be retried after a transient failure. */
export async function restoreScheduleClaim(scheduleId: string, nextRunAt: Date): Promise<void> {
  await pool.query(
    `UPDATE email_send_schedules SET next_run_at = $2, updated_at = NOW() WHERE id = $1`,
    [scheduleId, nextRunAt]
  );
}

export async function updateScheduleRunState(
  scheduleId: string,
  patch: {
    nextRunAt: Date | null;
    lastRunAt: Date | null;
    isActive?: boolean;
  }
) {
  await pool.query(
    `UPDATE email_send_schedules SET
      next_run_at = $2,
      last_run_at = $3,
      is_active = COALESCE($4, is_active)
    WHERE id = $1`,
    [scheduleId, patch.nextRunAt, patch.lastRunAt, patch.isActive ?? null]
  );
}
