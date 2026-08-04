const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface TemplateFolder {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  template_count: number;
}

export interface CreateFolderRequest {
  name: string;
}

export interface UpdateFolderRequest {
  name: string;
}

/**
 * Fetch all folders
 */
export async function fetchFolders(): Promise<TemplateFolder[]> {
  const response = await fetch(`${API_URL}/folders`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch folders: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Create a folder
 */
export async function createFolder(data: CreateFolderRequest): Promise<TemplateFolder> {
  const response = await fetch(`${API_URL}/folders`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to create folder: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Rename a folder
 */
export async function updateFolder(id: string, data: UpdateFolderRequest): Promise<TemplateFolder> {
  const response = await fetch(`${API_URL}/folders/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to update folder: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a folder (must be empty)
 */
export async function deleteFolder(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/folders/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Failed to delete folder: ${response.statusText}`);
  }
}
