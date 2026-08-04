import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation';
import { generateSynthesis } from '../services/synthesis';

const router = Router();

const GenerateBodySchema = z.object({
  topicTid: z.number().int().positive().optional().nullable(),
  dashboardTagTid: z.number().int().positive().optional().nullable(),
  createdStartDate: z.string().optional().nullable(),
  createdEndDate: z.string().optional().nullable(),
  createdRelativeDays: z.number().int().min(0).optional().nullable(),
  includeVideos: z.boolean().optional().nullable(),
  includeArticles: z.boolean().optional().nullable(),
  includeTweets: z.boolean().optional().nullable(),
  includePodcasts: z.boolean().optional().nullable(),
  specialInstructions: z.string().optional().nullable(),
});

/**
 * POST /api/synthesis/generate
 * Fetch RheumNow XML feeds and synthesize a thematic HTML digest via Portkey.
 */
router.post(
  '/generate',
  validateBody(GenerateBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await generateSynthesis(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
