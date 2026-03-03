var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from './connection';
/**
 * Get all templates (without full configuration)
 */
export function getAllTemplates() {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query(`SELECT 
      id, name, slug, description, created_at, updated_at, created_by, is_active
    FROM email_templates
    WHERE is_active = true
    ORDER BY created_at DESC`);
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
    });
}
/**
 * Get template by slug (with full configuration)
 */
export function getTemplateBySlug(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query(`SELECT * FROM email_templates WHERE slug = $1 AND is_active = true`, [slug]);
        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description,
            configuration: row.configuration,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString(),
            created_by: row.created_by,
            is_active: row.is_active,
        };
    });
}
/**
 * Get template by ID (with full configuration)
 */
export function getTemplateById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query(`SELECT * FROM email_templates WHERE id = $1 AND is_active = true`, [id]);
        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description,
            configuration: row.configuration,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString(),
            created_by: row.created_by,
            is_active: row.is_active,
        };
    });
}
/**
 * Create a new template
 */
export function createTemplate(name, slug, configuration, description) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query(`INSERT INTO email_templates (name, slug, description, configuration)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, [name, slug, description || null, JSON.stringify(configuration)]);
        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description,
            configuration: row.configuration,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString(),
            created_by: row.created_by,
            is_active: row.is_active,
        };
    });
}
/**
 * Update a template
 */
export function updateTemplate(slug, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatesList = [];
        const values = [];
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
        const result = yield pool.query(`UPDATE email_templates 
     SET ${updatesList.join(', ')}
     WHERE slug = $${paramCount} AND is_active = true
     RETURNING *`, values);
        if (result.rows.length === 0) {
            return null;
        }
        const row = result.rows[0];
        return {
            id: row.id,
            name: row.name,
            slug: row.slug,
            description: row.description,
            configuration: row.configuration,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString(),
            created_by: row.created_by,
            is_active: row.is_active,
        };
    });
}
/**
 * Delete a template (soft delete by setting is_active = false)
 */
export function deleteTemplate(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield pool.query(`UPDATE email_templates 
     SET is_active = false 
     WHERE slug = $1 AND is_active = true`, [slug]);
        return result.rowCount !== null && result.rowCount > 0;
    });
}
/**
 * Check if slug exists
 */
export function slugExists(slug, excludeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = `SELECT 1 FROM email_templates WHERE slug = $1`;
        const params = [slug];
        if (excludeId) {
            query += ` AND id != $2`;
            params.push(excludeId);
        }
        const result = yield pool.query(query, params);
        return result.rows.length > 0;
    });
}
//# sourceMappingURL=queries.js.map