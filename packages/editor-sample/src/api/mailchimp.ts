const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Audience {
  id: string;
  name: string;
  member_count: number;
  created_at: string;
  updated_at: string;
}

export interface Segment {
  id: number;
  name: string;
  member_count: number;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: string;
  send_time: string | null;
  created_at: string;
  recipients: {
    list_id: string;
    list_name: string;
    segment_text: string;
    recipient_count: number;
  };
}

/**
 * Fetch all audiences (lists)
 */
export async function fetchAudiences(): Promise<Audience[]> {
  const response = await fetch(`${API_URL}/mailchimp/audiences`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to fetch audiences: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch segments for a specific audience
 */
export async function fetchSegments(audienceId: string): Promise<Segment[]> {
  const response = await fetch(`${API_URL}/mailchimp/audiences/${audienceId}/segments`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Audience "${audienceId}" not found`);
    }
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to fetch segments: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch recent campaigns for a specific audience
 */
export async function fetchCampaigns(audienceId: string, count: number = 10): Promise<Campaign[]> {
  const response = await fetch(`${API_URL}/mailchimp/audiences/${audienceId}/campaigns?count=${count}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Audience "${audienceId}" not found`);
    }
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to fetch campaigns: ${response.statusText}`);
  }
  
  return response.json();
}

export interface SendCampaignRequest {
  title: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  listId: string;
  segmentId?: number;
  htmlContent: string;
}

export interface SendCampaignResponse {
  id: string;
  title: string;
  subject: string;
  status: string;
  web_id: string;
}

/**
 * Create and send a campaign to Mailchimp
 */
export async function sendCampaign(data: SendCampaignRequest): Promise<SendCampaignResponse> {
  const response = await fetch(`${API_URL}/mailchimp/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to send campaign: ${response.statusText}`);
  }
  
  return response.json();
}
