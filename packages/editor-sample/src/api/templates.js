var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
/**
 * Fetch all templates (without full configuration)
 */
export function fetchTemplates() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/templates`);
        if (!response.ok) {
            throw new Error(`Failed to fetch templates: ${response.statusText}`);
        }
        return response.json();
    });
}
/**
 * Fetch a single template by slug (with full configuration)
 */
export function fetchTemplate(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/templates/${slug}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`Template "${slug}" not found`);
            }
            throw new Error(`Failed to fetch template: ${response.statusText}`);
        }
        return response.json();
    });
}
/**
 * Create a new template
 */
export function createTemplate(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/templates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = yield response.json().catch(() => ({ error: response.statusText }));
            throw new Error(error.error || `Failed to create template: ${response.statusText}`);
        }
        return response.json();
    });
}
/**
 * Update an existing template
 */
export function updateTemplate(slug, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/templates/${slug}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = yield response.json().catch(() => ({ error: response.statusText }));
            throw new Error(error.error || `Failed to update template: ${response.statusText}`);
        }
        return response.json();
    });
}
/**
 * Delete a template (soft delete)
 */
export function deleteTemplate(slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${API_URL}/templates/${slug}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete template: ${response.statusText}`);
        }
    });
}
//# sourceMappingURL=templates.js.map