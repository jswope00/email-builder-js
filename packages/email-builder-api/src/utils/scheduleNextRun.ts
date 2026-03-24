import { DateTime } from 'luxon';

import type { ScheduleType } from '../types/send';

const MS_PER_MINUTE = 60_000;

/**
 * Next UTC instant for a one-off schedule (already stored as ISO in DB).
 */
export function nextRunForOneOff(oneOffAtIso: string): Date {
  return new Date(oneOffAtIso);
}

/**
 * Luxon weekdays 1–7 (Mon–Sun). Returns the next occurrence strictly after `after` in `timezone`
 * at `timeLocal` (HH:mm). If none in the lookahead window, extends search.
 */
export function nextRunForRecurring(params: {
  timezone: string;
  weekdays: number[];
  timeLocal: string;
  after: Date;
}): Date {
  const { timezone, weekdays, timeLocal, after } = params;
  const set = new Set(weekdays.filter((d) => d >= 1 && d <= 7));
  if (set.size === 0) {
    throw new Error('At least one weekday (1–7, Mon–Sun) is required');
  }

  const [hh, mm] = timeLocal.split(':').map((x) => parseInt(x, 10));
  if (Number.isNaN(hh) || Number.isNaN(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    throw new Error('recurringTimeLocal must be HH:mm');
  }

  let cursor = DateTime.fromJSDate(after, { zone: 'utc' }).setZone(timezone);
  // Start from the beginning of the current local day to find today's slot if still upcoming
  cursor = cursor.startOf('day');

  const afterMs = after.getTime();

  for (let dayOffset = 0; dayOffset < 400; dayOffset++) {
    const day = cursor.plus({ days: dayOffset });
    const wd = day.weekday; // 1–7
    if (!set.has(wd)) continue;

    const candidate = day.set({ hour: hh, minute: mm, second: 0, millisecond: 0 });
    const utc = candidate.toUTC();
    if (utc.toMillis() > afterMs + MS_PER_MINUTE - 1) {
      return utc.toJSDate();
    }
  }

  throw new Error('Could not compute next recurring run');
}

export function computeInitialNextRunAt(input: {
  scheduleType: ScheduleType;
  timezone: string;
  oneOffAt?: string | null;
  recurringWeekdays?: number[] | null;
  recurringTimeLocal?: string | null;
  /** If false, next_run_at is null until activated */
  isActive: boolean;
}): Date | null {
  if (!input.isActive) return null;
  const now = new Date();

  if (input.scheduleType === 'one_off') {
    if (!input.oneOffAt) return null;
    const d = nextRunForOneOff(input.oneOffAt);
    return d.getTime() >= now.getTime() - MS_PER_MINUTE ? d : null;
  }

  if (!input.recurringWeekdays?.length || !input.recurringTimeLocal) return null;
  return nextRunForRecurring({
    timezone: input.timezone,
    weekdays: input.recurringWeekdays,
    timeLocal: input.recurringTimeLocal,
    after: new Date(now.getTime() - MS_PER_MINUTE),
  });
}

/**
 * After a recurring schedule fires at `firedAt`, compute the next run (strictly after firedAt).
 */
export function nextRunAfterRecurringFire(params: {
  timezone: string;
  weekdays: number[];
  timeLocal: string;
  firedAt: Date;
}): Date {
  return nextRunForRecurring({
    ...params,
    after: params.firedAt,
  });
}
