import { z } from 'zod';

// Template configuration type (matches TEditorConfiguration from editor-sample)
export type TemplateConfiguration = Record<string, {
  type: string;
  data: {
    style?: Record<string, any>;
    props?: Record<string, any>;
    [key: string]: any;
  };
}>;

// Database row type
export interface EmailTemplateRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  configuration: TemplateConfiguration;
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
  is_active: boolean;
}

// API request/response types
export const CreateTemplateSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional().nullable(),
  configuration: z.record(z.any()).refine(
    (config) => config.root !== undefined,
    { message: 'Configuration must have a root block' }
  ),
});

export const UpdateTemplateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().optional().nullable(),
  configuration: z.record(z.any()).refine(
    (config) => config.root !== undefined,
    { message: 'Configuration must have a root block' }
  ).optional(),
  is_active: z.boolean().optional(),
});

export type CreateTemplateRequest = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplateRequest = z.infer<typeof UpdateTemplateSchema>;

// API response type (without full configuration for list endpoints)
export interface TemplateListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_active: boolean;
}

// Full template response (includes configuration)
export interface TemplateResponse extends TemplateListItem {
  configuration: TemplateConfiguration;
}
