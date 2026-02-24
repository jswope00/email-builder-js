import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError, NotFoundError } from '../utils/errors';
import { validateParams, validateBody } from '../middleware/validation';

const router = Router();

// Params validation schemas
const AudienceIdParamsSchema = z.object({
  id: z.string().min(1),
});

/**
 * Get Mailchimp API base URL and authentication
 */
function getMailchimpConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey) {
    throw new AppError(500, 'Mailchimp API key is not configured', 'MAILCHIMP_CONFIG_ERROR');
  }

  if (!serverPrefix) {
    throw new AppError(500, 'Mailchimp server prefix is not configured', 'MAILCHIMP_CONFIG_ERROR');
  }

  const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0`;
  
  // Basic Auth: username can be anything, password is the API key
  const auth = Buffer.from(`anystring:${apiKey}`).toString('base64');

  return { baseUrl, auth };
}

/**
 * Make authenticated GET request to Mailchimp API
 */
async function mailchimpRequest(endpoint: string) {
  const { baseUrl, auth } = getMailchimpConfig();
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${auth}`,
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

/**
 * Make authenticated POST request to Mailchimp API
 */
async function mailchimpPostRequest(endpoint: string, body: any) {
  const { baseUrl, auth } = getMailchimpConfig();
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    const errorMessage = errorData.detail || errorData.title || errorData.message || `Mailchimp API error: ${response.statusText}`;
    console.error(`Mailchimp API Error (${response.status}):`, {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      error: errorData,
      requestBody: body,
    });
    throw new AppError(
      response.status,
      errorMessage,
      'MAILCHIMP_API_ERROR'
    );
  }

  // Handle empty responses (e.g., 204 No Content)
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
  } catch (e) {
    // If parsing fails, return null (empty response is valid for some endpoints)
    return null;
  }
}

/**
 * Make authenticated PUT request to Mailchimp API
 */
async function mailchimpPutRequest(endpoint: string, body: any) {
  const { baseUrl, auth } = getMailchimpConfig();
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    const errorMessage = errorData.detail || errorData.title || errorData.message || `Mailchimp API error: ${response.statusText}`;
    console.error(`Mailchimp API Error (${response.status}):`, {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      error: errorData,
      requestBody: body,
    });
    throw new AppError(
      response.status,
      errorMessage,
      'MAILCHIMP_API_ERROR'
    );
  }

  // Handle empty responses (e.g., 204 No Content)
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
  } catch (e) {
    // If parsing fails, return null (empty response is valid for some endpoints)
    return null;
  }
}

/**
 * GET /api/mailchimp/audiences
 * Fetch all audiences (lists) - handles pagination
 */
router.get('/audiences', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = 1000; // Maximum allowed by Mailchimp API
    let offset = 0;
    let allLists: any[] = [];
    let hasMore = true;

    // Fetch all audiences by paginating through results
    while (hasMore) {
      const data = await mailchimpRequest(`/lists?count=${count}&offset=${offset}`);
      const lists = data.lists || [];
      allLists = allLists.concat(lists);
      
      // Check if there are more results
      const totalItems = data.total_items || 0;
      offset += lists.length;
      hasMore = offset < totalItems && lists.length > 0;
    }

    // Return simplified audience data
    const audiences = allLists.map((list: any) => ({
      id: list.id,
      name: list.name,
      member_count: list.stats.member_count,
      created_at: list.date_created,
      updated_at: list.date_updated,
    }));
    res.json(audiences);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/mailchimp/audiences/:id/segments
 * Fetch segments for a specific audience (handles pagination)
 */
router.get(
  '/audiences/:id/segments',
  validateParams(AudienceIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const count = 1000; // Maximum allowed by Mailchimp API
      let offset = 0;
      let allSegments: any[] = [];
      let hasMore = true;

      // Fetch all segments by paginating through results
      while (hasMore) {
        const data = await mailchimpRequest(`/lists/${id}/segments?count=${count}&offset=${offset}`);
        const segments = data.segments || [];
        allSegments = allSegments.concat(segments);
        
        // Check if there are more results
        const totalItems = data.total_items || 0;
        offset += segments.length;
        hasMore = offset < totalItems && segments.length > 0;
      }

      // Return simplified segment data
      const simplifiedSegments = allSegments.map((segment: any) => ({
        id: segment.id,
        name: segment.name,
        member_count: segment.member_count,
        type: segment.type,
        created_at: segment.created_at,
        updated_at: segment.updated_at,
      }));
      
      res.json(simplifiedSegments);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/mailchimp/audiences/:id/campaigns
 * Fetch recent campaigns for a specific audience
 */
router.get(
  '/audiences/:id/campaigns',
  validateParams(AudienceIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const count = req.query.count ? parseInt(req.query.count as string, 10) : 10;
      const data = await mailchimpRequest(
        `/campaigns?list_id=${id}&count=${count}&sort_field=send_time&sort_dir=DESC`
      );
      // Return simplified campaign data
      const campaigns = data.campaigns.map((campaign: any) => ({
        id: campaign.id,
        name: campaign.settings?.title || campaign.settings?.subject_line || 'Untitled Campaign',
        subject: campaign.settings?.subject_line || '',
        status: campaign.status,
        send_time: campaign.send_time,
        created_at: campaign.create_time,
        recipients: campaign.recipients,
      }));
      res.json(campaigns);
    } catch (error) {
      next(error);
    }
  }
);

// Request body validation schema for creating campaigns
const CreateCampaignSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  fromName: z.string().min(1),
  fromEmail: z.string().email(),
  replyTo: z.string().email(),
  listId: z.string().min(1),
  segmentId: z.number().optional(),
  htmlContent: z.string().min(1),
});

/**
 * POST /api/mailchimp/campaigns
 * Create and send a campaign
 */
router.post(
  '/campaigns',
  validateBody(CreateCampaignSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, subject, fromName, fromEmail, replyTo, listId, segmentId, htmlContent } = req.body;

      // Step 1: Create the campaign
      const campaignData = {
        type: 'regular',
        recipients: {
          list_id: listId,
          ...(segmentId && { segment_opts: { saved_segment_id: segmentId } }),
        },
        settings: {
          subject_line: subject,
          title: title,
          from_name: fromName,
          from_email: fromEmail,
          reply_to: replyTo,
          to_name: '*|FNAME|*',
        },
      };

      const campaign = await mailchimpPostRequest('/campaigns', campaignData);

      // Step 2: Set the HTML content (uses PUT, not POST)
      await mailchimpPutRequest(`/campaigns/${campaign.id}/content`, {
        html: htmlContent,
      });

      // Step 3: Send the campaign (may return empty response)
      await mailchimpPostRequest(`/campaigns/${campaign.id}/actions/send`, {});

      res.status(201).json({
        id: campaign.id,
        title: campaign.settings?.title || title,
        subject: campaign.settings?.subject_line || subject,
        status: 'sent',
        web_id: campaign.web_id,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
