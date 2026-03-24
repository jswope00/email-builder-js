import { fetchDueSchedules, updateScheduleRunState } from '../db/sendQueries';
import { executeSendForMailchimp } from '../services/executeSend';
import { nextRunAfterRecurringFire } from '../utils/scheduleNextRun';

export async function runScheduledSendTick(): Promise<void> {
  const now = new Date();
  const due = await fetchDueSchedules(now);

  if (process.env.SCHEDULER_DEBUG === 'true' || process.env.SCHEDULER_DEBUG === '1') {
    console.log('[scheduler] tick', { dueCount: due.length, at: now.toISOString() });
  }

  for (const { schedule, send } of due) {
    try {
      const mode = schedule.schedule_kind === 'test' ? 'test' : 'live';
      await executeSendForMailchimp(
        {
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
        },
        mode
      );

      const firedAt = new Date();

      if (schedule.schedule_type === 'one_off') {
        await updateScheduleRunState(schedule.id, {
          nextRunAt: null,
          lastRunAt: firedAt,
          isActive: false,
        });
      } else {
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

      console.log(`[scheduler] Sent schedule ${schedule.id} (${schedule.schedule_kind}) for send ${send.id}`);
    } catch (err) {
      console.error(`[scheduler] Failed schedule ${schedule.id}:`, err);
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

  const tick = () => {
    runScheduledSendTick().catch((e) => console.error('[scheduler] tick error', e));
  };

  tick();
  return setInterval(tick, intervalMs);
}
