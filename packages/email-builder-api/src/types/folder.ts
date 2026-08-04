import { z } from 'zod';

export interface TemplateFolderRow {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface TemplateFolder {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  template_count: number;
}

export const CreateFolderSchema = z.object({
  name: z.string().min(1).max(255).trim(),
});

export const UpdateFolderSchema = z.object({
  name: z.string().min(1).max(255).trim(),
});

export type CreateFolderRequest = z.infer<typeof CreateFolderSchema>;
export type UpdateFolderRequest = z.infer<typeof UpdateFolderSchema>;
