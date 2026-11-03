import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateParams, validateBody } from '../middleware/validation';
import { createAndSendCampaign, mailchimpGetRequest } from '../services/mailchimpCampaign';

const router = Router();

const AudienceIdParamsSchema = z.object({
  id: z.string().min(1),
});

/**
 * GET /api/mailchimp/audiences
 * Fetch all audiences (lists) - handles pagination
 */
router.get('/audiences', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = 1000;
    let offset = 0;
    let allLists: any[] = [];
    let hasMore = true;

    while (hasMore) {
      const data = await mailchimpGetRequest(`/lists?count=${count}&offset=${offset}`);
      const lists = data.lists || [];
      allLists = allLists.concat(lists);

      const totalItems = data.total_items || 0;
      offset += lists.length;
      hasMore = offset < totalItems && lists.length > 0;
    }

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
 * Saved segments from GET /3.0/lists/{list_id}/segments.
 * Campaign create requires these integer ids.
 */
router.get(
  '/audiences/:id/segments',
  validateParams(AudienceIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const count = 1000;
      let offset = 0;
      let allSegments: any[] = [];
      let hasMore = true;

      while (hasMore) {
        const data = await mailchimpGetRequest(`/lists/${id}/segments?count=${count}&offset=${offset}`);
        const segments = data.segments || [];
        allSegments = allSegments.concat(segments);

        const totalItems = data.total_items || 0;
        offset += segments.length;
        hasMore = offset < totalItems && segments.length > 0;
      }

      const simplifiedSegments = allSegments.map((segment: any) => ({
        id: String(segment.id),
        name: segment.name,
        created_at: segment.created_at,
        read_only: false,
      }));

      res.json(simplifiedSegments);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/mailchimp/audiences/:id/campaigns
 */
router.get(
  '/audiences/:id/campaigns',
  validateParams(AudienceIdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const count = req.query.count ? parseInt(req.query.count as string, 10) : 10;
      const data = await mailchimpGetRequest(
        `/campaigns?list_id=${id}&count=${count}&sort_field=send_time&sort_dir=DESC`
      );
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

const CreateCampaignSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  fromName: z.string().min(1),
  fromEmail: z.string().email(),
  replyTo: z.string().email(),
  listId: z.string().min(1),
  segmentId: z
    .string()
    .regex(/^\d+$/, 'Segment id must be a numeric Mailchimp saved segment id')
    .optional(),
  htmlContent: z.string().min(1),
});

/**
 * POST /api/mailchimp/campaigns
 */
router.post(
  '/campaigns',
  validateBody(CreateCampaignSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, subject, fromName, fromEmail, replyTo, listId, segmentId, htmlContent } = req.body;
      const result = await createAndSendCampaign({
        title,
        subject,
        fromName,
        fromEmail,
        replyTo,
        listId,
        segmentId,
        htmlContent,
      });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
