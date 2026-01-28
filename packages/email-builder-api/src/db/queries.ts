import { pool } from './connection';
import type { EmailTemplateRow, TemplateListItem, TemplateResponse } from '../types/template';

/**
 * Get all templates (without full configuration)
 */
export async function getAllTemplates(): Promise<TemplateListItem[]> {
  const result = await pool.query<EmailTemplateRow>(
    `SELECT 
      id, name, slug, description, created_at, updated_at, created_by, is_active
    FROM email_templates
    WHERE is_active = true
    ORDER BY created_at DESC`
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    created_by: row.created_by,
    is_active: row.is_active,
  }));
}

/**
 * Get template by slug (with full configuration)
 */
export async function getTemplateBySlug(slug: string): Promise<TemplateResponse | null> {
  const result = await pool.query<EmailTemplateRow>(
    `SELECT * FROM email_templates WHERE slug = $1 AND is_active = true`,
    [slug]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    configuration: row.configuration as any,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    created_by: row.created_by,
    is_active: row.is_active,
  };
}

/**
 * Get template by ID (with full configuration)
 */
export async function getTemplateById(id: string): Promise<TemplateResponse | null> {
  const result = await pool.query<EmailTemplateRow>(
    `SELECT * FROM email_templates WHERE id = $1 AND is_active = true`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    configuration: row.configuration as any,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    created_by: row.created_by,
    is_active: row.is_active,
  };
}

/**
 * Create a new template
 */
export async function createTemplate(
  name: string,
  slug: string,
  configuration: any,
  description?: string | null
): Promise<TemplateResponse> {
  const result = await pool.query<EmailTemplateRow>(
    `INSERT INTO email_templates (name, slug, description, configuration)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, slug, description || null, JSON.stringify(configuration)]
  );

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    configuration: row.configuration as any,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    created_by: row.created_by,
    is_active: row.is_active,
  };
}

/**
 * Update a template
 */
export async function updateTemplate(
  slug: string,
  updates: {
    name?: string;
    slug?: string;
    description?: string | null;
    configuration?: any;
    is_active?: boolean;
  }
): Promise<TemplateResponse | null> {
  const updatesList: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  if (updates.name !== undefined) {
    updatesList.push(`name = $${paramCount++}`);
    values.push(updates.name);
  }

  if (updates.slug !== undefined) {
    updatesList.push(`slug = $${paramCount++}`);
    values.push(updates.slug);
  }

  if (updates.description !== undefined) {
    updatesList.push(`description = $${paramCount++}`);
    values.push(updates.description);
  }

  if (updates.configuration !== undefined) {
    updatesList.push(`configuration = $${paramCount++}`);
    values.push(JSON.stringify(updates.configuration));
  }

  if (updates.is_active !== undefined) {
    updatesList.push(`is_active = $${paramCount++}`);
    values.push(updates.is_active);
  }

  if (updatesList.length === 0) {
    // No updates, just return the existing template
    return getTemplateBySlug(slug);
  }

  values.push(slug);
  const result = await pool.query<EmailTemplateRow>(
    `UPDATE email_templates 
     SET ${updatesList.join(', ')}
     WHERE slug = $${paramCount} AND is_active = true
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    configuration: row.configuration as any,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    created_by: row.created_by,
    is_active: row.is_active,
  };
}

/**
 * Delete a template (soft delete by setting is_active = false)
 */
export async function deleteTemplate(slug: string): Promise<boolean> {
  const result = await pool.query(
    `UPDATE email_templates 
     SET is_active = false 
     WHERE slug = $1 AND is_active = true`,
    [slug]
  );

  return result.rowCount !== null && result.rowCount > 0;
}

/**
 * Check if slug exists
 */
export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  let query = `SELECT 1 FROM email_templates WHERE slug = $1`;
  const params: any[] = [slug];

  if (excludeId) {
    query += ` AND id != $2`;
    params.push(excludeId);
  }

  const result = await pool.query(query, params);
  return result.rows.length > 0;
}
