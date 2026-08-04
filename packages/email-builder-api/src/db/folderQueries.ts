import { pool } from './connection';
import type { TemplateFolder, TemplateFolderRow } from '../types/folder';

function mapFolder(row: TemplateFolderRow, templateCount = 0): TemplateFolder {
  return {
    id: row.id,
    name: row.name,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
    template_count: templateCount,
  };
}

/**
 * List all folders with active template counts
 */
export async function getAllFolders(): Promise<TemplateFolder[]> {
  const result = await pool.query<TemplateFolderRow & { template_count: string }>(
    `SELECT
       f.id,
       f.name,
       f.created_at,
       f.updated_at,
       COUNT(t.id)::text AS template_count
     FROM template_folders f
     LEFT JOIN email_templates t
       ON t.folder_id = f.id AND t.is_active = true
     GROUP BY f.id
     ORDER BY f.name ASC`
  );

  return result.rows.map((row) => mapFolder(row, Number(row.template_count)));
}

/**
 * Get a folder by ID
 */
export async function getFolderById(id: string): Promise<TemplateFolder | null> {
  const result = await pool.query<TemplateFolderRow & { template_count: string }>(
    `SELECT
       f.id,
       f.name,
       f.created_at,
       f.updated_at,
       COUNT(t.id)::text AS template_count
     FROM template_folders f
     LEFT JOIN email_templates t
       ON t.folder_id = f.id AND t.is_active = true
     WHERE f.id = $1
     GROUP BY f.id`,
    [id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];
  return mapFolder(row, Number(row.template_count));
}

/**
 * Create a folder
 */
export async function createFolder(name: string): Promise<TemplateFolder> {
  const result = await pool.query<TemplateFolderRow>(
    `INSERT INTO template_folders (name)
     VALUES ($1)
     RETURNING *`,
    [name]
  );

  return mapFolder(result.rows[0], 0);
}

/**
 * Rename a folder
 */
export async function updateFolder(id: string, name: string): Promise<TemplateFolder | null> {
  const result = await pool.query<TemplateFolderRow>(
    `UPDATE template_folders
     SET name = $1
     WHERE id = $2
     RETURNING *`,
    [name, id]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const folder = await getFolderById(id);
  return folder;
}

/**
 * Count active templates in a folder
 */
export async function countTemplatesInFolder(folderId: string): Promise<number> {
  const result = await pool.query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
     FROM email_templates
     WHERE folder_id = $1 AND is_active = true`,
    [folderId]
  );

  return Number(result.rows[0]?.count ?? 0);
}

/**
 * Delete a folder (caller must ensure it is empty)
 */
export async function deleteFolder(id: string): Promise<boolean> {
  const result = await pool.query(`DELETE FROM template_folders WHERE id = $1`, [id]);
  return result.rowCount !== null && result.rowCount > 0;
}
