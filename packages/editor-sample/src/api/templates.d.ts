import type { TEditorConfiguration } from '../documents/editor/core';
export interface TemplateListItem {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}
export interface TemplateResponse extends TemplateListItem {
    configuration: TEditorConfiguration;
}
export interface CreateTemplateRequest {
    name: string;
    slug: string;
    description?: string | null;
    configuration: TEditorConfiguration;
}
export interface UpdateTemplateRequest {
    name?: string;
    slug?: string;
    description?: string | null;
    configuration?: TEditorConfiguration;
    is_active?: boolean;
}
/**
 * Fetch all templates (without full configuration)
 */
export declare function fetchTemplates(): Promise<TemplateListItem[]>;
/**
 * Fetch a single template by slug (with full configuration)
 */
export declare function fetchTemplate(slug: string): Promise<TemplateResponse>;
/**
 * Create a new template
 */
export declare function createTemplate(data: CreateTemplateRequest): Promise<TemplateResponse>;
/**
 * Update an existing template
 */
export declare function updateTemplate(slug: string, data: UpdateTemplateRequest): Promise<TemplateResponse>;
/**
 * Delete a template (soft delete)
 */
export declare function deleteTemplate(slug: string): Promise<void>;
//# sourceMappingURL=templates.d.ts.map