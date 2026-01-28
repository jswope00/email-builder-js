import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  getAllTemplates,
  getTemplateBySlug,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  slugExists,
} from '../db/queries';
import { NotFoundError, ConflictError } from '../utils/errors';
import { validateBody, validateParams } from '../middleware/validation';
import { CreateTemplateSchema, UpdateTemplateSchema } from '../types/template';

const router = Router();

// Params validation schemas
const SlugParamsSchema = z.object({
  slug: z.string().min(1),
});

/**
 * GET /api/templates
 * List all templates (without full configuration)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const templates = await getAllTemplates();
    res.json(templates);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/templates/:slug
 * Get a single template by slug (with full configuration)
 */
router.get(
  '/:slug',
  validateParams(SlugParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const template = await getTemplateBySlug(slug);

      if (!template) {
        throw new NotFoundError('Template', `slug "${slug}"`);
      }

      res.json(template);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/templates
 * Create a new template
 */
router.post(
  '/',
  validateBody(CreateTemplateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, slug, description, configuration } = req.body;

      // Check if slug already exists
      if (await slugExists(slug)) {
        throw new ConflictError(`Template with slug "${slug}" already exists`);
      }

      const template = await createTemplate(name, slug, configuration, description);
      res.status(201).json(template);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/templates/:slug
 * Update an existing template
 */
router.put(
  '/:slug',
  validateParams(SlugParamsSchema),
  validateBody(UpdateTemplateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const updates = req.body;

      // Check if template exists
      const existing = await getTemplateBySlug(slug);
      if (!existing) {
        throw new NotFoundError('Template', `slug "${slug}"`);
      }

      // If slug is being updated, check if new slug exists
      if (updates.slug && updates.slug !== slug) {
        if (await slugExists(updates.slug, existing.id)) {
          throw new ConflictError(`Template with slug "${updates.slug}" already exists`);
        }
      }

      const template = await updateTemplate(slug, updates);
      if (!template) {
        throw new NotFoundError('Template', `slug "${slug}"`);
      }

      res.json(template);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/templates/:slug
 * Delete a template (soft delete)
 */
router.delete(
  '/:slug',
  validateParams(SlugParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const deleted = await deleteTemplate(slug);

      if (!deleted) {
        throw new NotFoundError('Template', `slug "${slug}"`);
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
