import type { TEditorConfiguration } from '../documents/editor/core';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface TemplateListItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  folder_id: string | null;
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
  folder_id?: string | null;
}

/**
 * Fetch all templates (without full configuration)
 */
export async function fetchTemplates(): Promise<TemplateListItem[]> {
  const response = await fetch(`${API_URL}/templates`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch templates: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single template by slug (with full configuration)
 */
export async function fetchTemplate(slug: string): Promise<TemplateResponse> {
  const response = await fetch(`${API_URL}/templates/${slug}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Template "${slug}" not found`);
    }
    throw new Error(`Failed to fetch template: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a new template
 */
export async function createTemplate(data: CreateTemplateRequest): Promise<TemplateResponse> {
  const response = await fetch(`${API_URL}/templates`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to create template: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing template
 */
export async function updateTemplate(
  slug: string,
  data: UpdateTemplateRequest
): Promise<TemplateResponse> {
  const response = await fetch(`${API_URL}/templates/${slug}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to update template: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a template (soft delete)
 */
export async function deleteTemplate(slug: string): Promise<void> {
  const response = await fetch(`${API_URL}/templates/${slug}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete template: ${response.statusText}`);
  }
}

/**
 * Move a template into a folder, or to root when folderId is null
 */
export async function moveTemplate(
  slug: string,
  folderId: string | null
): Promise<TemplateResponse> {
  return updateTemplate(slug, { folder_id: folderId });
}
