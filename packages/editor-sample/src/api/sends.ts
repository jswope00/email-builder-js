const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export type ScheduleKind = 'live' | 'test';
export type ScheduleType = 'one_off' | 'recurring';

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
  schedules: SendScheduleDTO[];
}

export type SchedulePayload =
  | {
      scheduleKind: ScheduleKind;
      scheduleType: 'one_off';
      isActive: boolean;
      timezone: string;
      oneOffAt: string;
    }
  | {
      scheduleKind: ScheduleKind;
      scheduleType: 'recurring';
      isActive: boolean;
      timezone: string;
      recurringWeekdays: number[];
      recurringTimeLocal: string;
    };

export interface SendPayload {
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
  schedules: SchedulePayload[];
}

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => ({ error: res.statusText }));
  return body.error || res.statusText;
}

export async function fetchSends(includeInactive = false): Promise<EmailSendListItem[]> {
  const q = includeInactive ? '?includeInactive=true' : '';
  const response = await fetch(`${API_URL}/sends${q}`, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function createSend(data: SendPayload): Promise<EmailSendListItem> {
  const response = await fetch(`${API_URL}/sends`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function updateSend(id: string, data: SendPayload): Promise<EmailSendListItem> {
  const response = await fetch(`${API_URL}/sends/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

/** Permanently deletes the send and its schedules (cascade). */
export async function deleteSend(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/sends/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
}

export async function patchSendActive(id: string, isActive: boolean): Promise<EmailSendListItem> {
  const response = await fetch(`${API_URL}/sends/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function patchScheduleActive(
  sendId: string,
  scheduleId: string,
  isActive: boolean
): Promise<EmailSendListItem> {
  const response = await fetch(`${API_URL}/sends/${sendId}/schedules/${scheduleId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

/** Permanently deletes a single schedule row. */
export async function deleteSchedule(sendId: string, scheduleId: string): Promise<EmailSendListItem> {
  const response = await fetch(`${API_URL}/sends/${sendId}/schedules/${scheduleId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}

export async function executeSend(
  id: string,
  mode: 'live' | 'test'
): Promise<{ id: string; title: string; subject: string; status: string; web_id: string }> {
  const response = await fetch(`${API_URL}/sends/${id}/execute`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json();
}
