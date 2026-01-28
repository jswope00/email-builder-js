import EMPTY_EMAIL_MESSAGE from './sample/empty-email-message';
import { fetchTemplate } from '../api/templates';
import type { TEditorConfiguration } from '../documents/editor/core';

/**
 * Synchronous configuration loader (for backward compatibility)
 * For API templates, use getConfigurationAsync instead
 */
export default function getConfiguration(template: string): TEditorConfiguration {
  if (template.startsWith('#template/')) {
    // API templates require async loading - return empty for now
    // The actual loading will be handled by getConfigurationAsync
    return EMPTY_EMAIL_MESSAGE;
  }

  if (template.startsWith('#code/')) {
    const encodedString = template.replace('#code/', '');
    const configurationString = decodeURIComponent(atob(encodedString));
    try {
      return JSON.parse(configurationString);
    } catch {
      console.error(`Couldn't load configuration from hash.`);
    }
  }

  return EMPTY_EMAIL_MESSAGE;
}

/**
 * Async configuration loader (for API templates)
 */
export async function getConfigurationAsync(template: string): Promise<TEditorConfiguration> {
  if (template.startsWith('#template/')) {
    const slug = template.replace('#template/', '');
    try {
      const response = await fetchTemplate(slug);
      return response.configuration;
    } catch (error) {
      console.error(`Failed to load template "${slug}":`, error);
      return EMPTY_EMAIL_MESSAGE;
    }
  }

  // For non-API templates, return synchronously
  return getConfiguration(template);
}
