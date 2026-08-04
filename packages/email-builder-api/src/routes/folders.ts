import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  getAllFolders,
  getFolderById,
  createFolder,
  updateFolder,
  deleteFolder,
  countTemplatesInFolder,
} from '../db/folderQueries';
import { NotFoundError, ConflictError } from '../utils/errors';
import { validateBody, validateParams } from '../middleware/validation';
import { CreateFolderSchema, UpdateFolderSchema } from '../types/folder';

const router = Router();

const IdParamsSchema = z.object({
  id: z.string().uuid(),
});

/**
 * GET /api/folders
 * List all folders
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const folders = await getAllFolders();
    res.json(folders);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/folders
 * Create a folder
 */
router.post(
  '/',
  validateBody(CreateFolderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const folder = await createFolder(name);
      res.status(201).json(folder);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/folders/:id
 * Rename a folder
 */
router.put(
  '/:id',
  validateParams(IdParamsSchema),
  validateBody(UpdateFolderSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const existing = await getFolderById(id);
      if (!existing) {
        throw new NotFoundError('Folder', `id "${id}"`);
      }

      const folder = await updateFolder(id, name);
      if (!folder) {
        throw new NotFoundError('Folder', `id "${id}"`);
      }

      res.json(folder);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/folders/:id
 * Delete a folder (must be empty)
 */
router.delete(
  '/:id',
  validateParams(IdParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const existing = await getFolderById(id);
      if (!existing) {
        throw new NotFoundError('Folder', `id "${id}"`);
      }

      const count = await countTemplatesInFolder(id);
      if (count > 0) {
        throw new ConflictError('Folder must be empty before it can be deleted');
      }

      const deleted = await deleteFolder(id);
      if (!deleted) {
        throw new NotFoundError('Folder', `id "${id}"`);
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export default router;
