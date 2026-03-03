import { z } from 'zod';
// API request/response types
export const CreateTemplateSchema = z.object({
    name: z.string().min(1).max(255),
    slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    description: z.string().optional().nullable(),
    configuration: z.record(z.any()).refine((config) => config.root !== undefined, { message: 'Configuration must have a root block' }),
});
export const UpdateTemplateSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
    description: z.string().optional().nullable(),
    configuration: z.record(z.any()).refine((config) => config.root !== undefined, { message: 'Configuration must have a root block' }).optional(),
    is_active: z.boolean().optional(),
});
//# sourceMappingURL=template.js.map