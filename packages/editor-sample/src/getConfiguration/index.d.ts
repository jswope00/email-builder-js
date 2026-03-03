import type { TEditorConfiguration } from '../documents/editor/core';
/**
 * Synchronous configuration loader (for backward compatibility)
 * For API templates, use getConfigurationAsync instead
 */
export default function getConfiguration(template: string): TEditorConfiguration;
/**
 * Async configuration loader (for API templates)
 */
export declare function getConfigurationAsync(template: string): Promise<TEditorConfiguration>;
//# sourceMappingURL=index.d.ts.map