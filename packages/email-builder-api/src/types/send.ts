export type ScheduleKind = 'live' | 'test';
export type ScheduleType = 'one_off' | 'recurring';

export interface SendScheduleRow {
  id: string;
  send_id: string;
  schedule_kind: ScheduleKind;
  schedule_type: ScheduleType;
  is_active: boolean;
  timezone: string;
  one_off_at: Date | null;
  recurring_weekdays: number[] | null;
  recurring_time_local: string | null;
  next_run_at: Date | null;
  last_run_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface SendScheduleDTO {
  id: string;
  scheduleKind: ScheduleKind;
  scheduleType: ScheduleType;
  isActive: boolean;
  timezone: string;
  oneOffAt: string | null;
  recurringWeekdays: number[] | null;
  recurringTimeLocal: string | null;
  nextRunAt: string | null;
  lastRunAt: string | null;
}

export interface EmailSendListItem {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  templateSlug: string;
  subject: string;
  listId: string;
  segmentId: number | null;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  testSubject: string | null;
  testListId: string | null;
  testSegmentId: number | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  sortOrder: number;
  schedules: SendScheduleDTO[];
}

export type SendReorderDirection = 'up' | 'down' | 'top' | 'bottom';

export interface CreateSendInput {
  name: string;
  templateId: string;
  subject: string;
  listId: string;
  segmentId?: number | null;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  testSubject?: string | null;
  testListId?: string | null;
  testSegmentId?: number | null;
}

export type SendExecutionTrigger = 'manual' | 'scheduled';
export type SendExecutionStatus = 'started' | 'sent' | 'failed' | 'skipped';

export interface SendExecutionDTO {
  id: string;
  sendId: string;
  sendName: string;
  scheduleId: string | null;
  triggerType: SendExecutionTrigger;
  mode: ScheduleKind;
  intendedRunAt: string | null;
  status: SendExecutionStatus;
  mailchimpCampaignId: string | null;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
