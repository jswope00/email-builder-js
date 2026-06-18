import {
  claimDueSchedules,
  restoreScheduleClaim,
  updateScheduleRunState,
} from '../db/sendQueries';
import { SendAbortError } from '../services/executeSend';
import { runSendWithExecutionLog } from '../services/sendExecution';
import { SendScheduleRow } from '../types/send';
import { nextRunAfterRecurringFire } from '../utils/scheduleNextRun';

async function markScheduleRunComplete(schedule: SendScheduleRow, firedAt: Date): Promise<void> {
  if (schedule.schedule_type === 'one_off') {
    await updateScheduleRunState(schedule.id, {
      nextRunAt: null,
      lastRunAt: firedAt,
      isActive: false,
    });
    return;
  }

  const next =
    schedule.recurring_weekdays &&
    schedule.recurring_time_local &&
    schedule.timezone
      ? nextRunAfterRecurringFire({
          timezone: schedule.timezone,
          weekdays: schedule.recurring_weekdays,
          timeLocal: schedule.recurring_time_local,
          firedAt,
        })
      : null;

  await updateScheduleRunState(schedule.id, {
    nextRunAt: next,
    lastRunAt: firedAt,
  });
}

export async function runScheduledSendTick(): Promise<void> {
  const now = new Date();
  const due = await claimDueSchedules(now);

  if (process.env.SCHEDULER_DEBUG === 'true' || process.env.SCHEDULER_DEBUG === '1') {
    console.log('[scheduler] tick', { dueCount: due.length, at: now.toISOString() });
  }

  for (const { schedule, send, claimedRunAt } of due) {
    const mode = schedule.schedule_kind === 'test' ? 'test' : 'live';
    const sendRow = {
      id: send.id,
      name: send.name,
      template_id: send.template_id,
      subject: send.subject,
      list_id: send.list_id,
      segment_id: send.segment_id,
      from_name: send.from_name,
      from_email: send.from_email,
      reply_to: send.reply_to,
      test_subject: send.test_subject,
      test_list_id: send.test_list_id,
      test_segment_id: send.test_segment_id,
    };

    try {
      const run = await runSendWithExecutionLog(sendRow, mode, {
        triggerType: 'scheduled',
        scheduleId: schedule.id,
        intendedRunAt: claimedRunAt,
      });

      if (run.outcome === 'skipped') {
        if (run.reason === 'already_sent' || run.reason === 'already_skipped') {
          await markScheduleRunComplete(schedule, new Date());
          console.warn(
            `[scheduler] Schedule ${schedule.id} already handled (${run.reason}); marked complete`
          );
        } else {
          await restoreScheduleClaim(schedule.id, claimedRunAt);
          console.warn(
            `[scheduler] Skipped duplicate in-flight schedule ${schedule.id}: ${run.reason}`
          );
        }
        continue;
      }

      await markScheduleRunComplete(schedule, new Date());
      console.log(`[scheduler] Sent schedule ${schedule.id} (${schedule.schedule_kind}) for send ${send.id}`);
    } catch (err) {
      if (err instanceof SendAbortError) {
        await markScheduleRunComplete(schedule, new Date());
        console.warn(`[scheduler] Skipped schedule ${schedule.id}: ${err.message}`);
        continue;
      }
      console.error(`[scheduler] Failed schedule ${schedule.id}:`, err);
      try {
        await restoreScheduleClaim(schedule.id, claimedRunAt);
      } catch (restoreErr) {
        console.error(`[scheduler] Failed to restore schedule ${schedule.id} for retry:`, restoreErr);
      }
    }
  }
}

export function startSendScheduler(): NodeJS.Timeout | null {
  const enabled = process.env.SCHEDULER_ENABLED === 'true' || process.env.SCHEDULER_ENABLED === '1';
  if (!enabled) {
    console.log('[scheduler] Disabled (set SCHEDULER_ENABLED=true to enable)');
    return null;
  }

  const intervalMs = parseInt(process.env.SCHEDULER_INTERVAL_MS || '60000', 10);
  console.log(`[scheduler] Running every ${intervalMs}ms`);

  let tickInProgress = false;

  const tick = () => {
    if (tickInProgress) {
      if (process.env.SCHEDULER_DEBUG === 'true' || process.env.SCHEDULER_DEBUG === '1') {
        console.log('[scheduler] skipping tick, previous still running');
      }
      return;
    }

    tickInProgress = true;
    runScheduledSendTick()
      .catch((e) => console.error('[scheduler] tick error', e))
      .finally(() => {
        tickInProgress = false;
      });
  };

  tick();
  return setInterval(tick, intervalMs);
}
