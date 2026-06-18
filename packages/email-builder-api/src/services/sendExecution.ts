import {
  beginManualExecution,
  claimScheduledExecution,
  completeSendExecution,
} from '../db/sendExecutionQueries';
import {
  executeSendForMailchimp,
  SendAbortError,
  type ExecuteMode,
  type SendRowForExecution,
} from './executeSend';

export type SendExecutionTrigger = 'manual' | 'scheduled';

export type SendExecutionContext =
  | { triggerType: 'manual' }
  | { triggerType: 'scheduled'; scheduleId: string; intendedRunAt: Date };

export type MailchimpSendResult = Awaited<ReturnType<typeof executeSendForMailchimp>>;

export type RunSendResult =
  | { outcome: 'sent'; result: MailchimpSendResult; executionId: string }
  | { outcome: 'skipped'; reason: string; executionId?: string };

async function beginExecution(
  sendId: string,
  mode: ExecuteMode,
  context: SendExecutionContext
): Promise<{ proceed: true; executionId: string } | { proceed: false; reason: string }> {
  if (context.triggerType === 'manual') {
    const executionId = await beginManualExecution(sendId, mode);
    return { proceed: true, executionId };
  }

  const claim = await claimScheduledExecution(
    sendId,
    context.scheduleId,
    context.intendedRunAt,
    mode
  );
  if (claim.action === 'skip') {
    return { proceed: false, reason: claim.reason };
  }
  return { proceed: true, executionId: claim.executionId };
}

export async function runSendWithExecutionLog(
  send: SendRowForExecution,
  mode: ExecuteMode,
  context: SendExecutionContext
): Promise<RunSendResult> {
  const begin = await beginExecution(send.id, mode, context);
  if (!begin.proceed) {
    return { outcome: 'skipped', reason: begin.reason };
  }

  const { executionId } = begin;

  try {
    const result = await executeSendForMailchimp(send, mode);
    await completeSendExecution(executionId, {
      status: 'sent',
      mailchimpCampaignId: result.id,
    });
    return { outcome: 'sent', result, executionId };
  } catch (err) {
    if (err instanceof SendAbortError) {
      await completeSendExecution(executionId, {
        status: 'skipped',
        errorMessage: err.message,
      });
      throw err;
    }

    const errorMessage = err instanceof Error ? err.message : String(err);
    await completeSendExecution(executionId, {
      status: 'failed',
      errorMessage,
    });
    throw err;
  }
}
