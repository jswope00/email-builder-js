import type { TemplateListItem, TemplateResponse } from '../types/template';
/**
 * Get all templates (without full configuration)
 */
export declare function getAllTemplates(): Promise<TemplateListItem[]>;
/**
 * Get template by slug (with full configuration)
 */
export declare function getTemplateBySlug(slug: string): Promise<TemplateResponse | null>;
/**
 * Get template by ID (with full configuration)
 */
export declare function getTemplateById(id: string): Promise<TemplateResponse | null>;
/**
 * Create a new template
 */
export declare function createTemplate(name: string, slug: string, configuration: any, description?: string | null): Promise<TemplateResponse>;
/**
 * Update a template
 */
export declare function updateTemplate(slug: string, updates: {
    name?: string;
    slug?: string;
    description?: string | null;
    configuration?: any;
    is_active?: boolean;
}): Promise<TemplateResponse | null>;
/**
 * Delete a template (soft delete by setting is_active = false)
 */
export declare function deleteTemplate(slug: string): Promise<boolean>;
/**
 * Check if slug exists
 */
export declare function slugExists(slug: string, excludeId?: string): Promise<boolean>;
//# sourceMappingURL=queries.d.ts.map