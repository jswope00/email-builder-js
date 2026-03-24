import { AppError } from '../utils/errors';

export async function mailchimpGetRequest(endpoint: string) {
  const { baseUrl, auth } = getMailchimpConfig();
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new AppError(
      response.status,
      errorData.detail || errorData.title || `Mailchimp API error: ${response.statusText}`,
      'MAILCHIMP_API_ERROR'
    );
  }

  return response.json();
}

export function getMailchimpConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey) {
    throw new AppError(500, 'Mailchimp API key is not configured', 'MAILCHIMP_CONFIG_ERROR');
  }

  if (!serverPrefix) {
    throw new AppError(500, 'Mailchimp server prefix is not configured', 'MAILCHIMP_CONFIG_ERROR');
  }

  const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;
  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');

  return { baseUrl, auth };
}

export async function mailchimpPostRequest(endpoint: string, body: unknown) {
  const { baseUrl, auth } = getMailchimpConfig();
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    const errorMessage =
      errorData.detail || errorData.title || errorData.message || `Mailchimp API error: ${response.statusText}`;
    console.error(`Mailchimp API Error (${response.status}):`, { endpoint, error: errorData, requestBody: body });
    throw new AppError(response.status, errorMessage, 'MAILCHIMP_API_ERROR');
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }

  const text = await response.text();
  if (!text || text.trim() === '') {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function mailchimpPutRequest(endpoint: string, body: unknown) {
  const { baseUrl, auth } = getMailchimpConfig();
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    const errorMessage =
      errorData.detail || errorData.title || errorData.message || `Mailchimp API error: ${response.statusText}`;
    console.error(`Mailchimp API Error (${response.status}):`, { endpoint, error: errorData, requestBody: body });
    throw new AppError(response.status, errorMessage, 'MAILCHIMP_API_ERROR');
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return null;
  }

  const text = await response.text();
  if (!text || text.trim() === '') {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export interface CreateAndSendCampaignParams {
  title: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  listId: string;
  segmentId?: number;
  htmlContent: string;
}

export async function createAndSendCampaign(params: CreateAndSendCampaignParams) {
  const { title, subject, fromName, fromEmail, replyTo, listId, segmentId, htmlContent } = params;

  const campaignData = {
    type: 'regular',
    recipients: {
      list_id: listId,
      ...(segmentId != null ? { segment_opts: { saved_segment_id: segmentId } } : {}),
    },
    settings: {
      subject_line: subject,
      title,
      from_name: fromName,
      from_email: fromEmail,
      reply_to: replyTo,
      to_name: '*|FNAME|*',
    },
  };

  const campaign = await mailchimpPostRequest('/campaigns', campaignData);
  if (!campaign?.id) {
    throw new AppError(500, 'Mailchimp did not return a campaign id', 'MAILCHIMP_API_ERROR');
  }

  await mailchimpPutRequest(`/campaigns/${campaign.id}/content`, {
    html: htmlContent,
  });

  await mailchimpPostRequest(`/campaigns/${campaign.id}/actions/send`, {});

  return {
    id: campaign.id,
    title: campaign.settings?.title || title,
    subject: campaign.settings?.subject_line || subject,
    status: 'sent',
    web_id: campaign.web_id,
  };
}
