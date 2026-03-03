import { z } from 'zod';
export type TemplateConfiguration = Record<string, {
    type: string;
    data: {
        style?: Record<string, any>;
        props?: Record<string, any>;
        [key: string]: any;
    };
}>;
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
export declare const CreateTemplateSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    configuration: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodAny>, Record<string, any>, Record<string, any>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    configuration: Record<string, any>;
    description?: string | null | undefined;
}, {
    name: string;
    slug: string;
    configuration: Record<string, any>;
    description?: string | null | undefined;
}>;
export declare const UpdateTemplateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    configuration: z.ZodOptional<z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodAny>, Record<string, any>, Record<string, any>>>;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | null | undefined;
    slug?: string | undefined;
    configuration?: Record<string, any> | undefined;
    is_active?: boolean | undefined;
}, {
    name?: string | undefined;
    description?: string | null | undefined;
    slug?: string | undefined;
    configuration?: Record<string, any> | undefined;
    is_active?: boolean | undefined;
}>;
export type CreateTemplateRequest = z.infer<typeof CreateTemplateSchema>;
export type UpdateTemplateRequest = z.infer<typeof UpdateTemplateSchema>;
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
export interface TemplateResponse extends TemplateListItem {
    configuration: TemplateConfiguration;
}
//# sourceMappingURL=template.d.ts.map