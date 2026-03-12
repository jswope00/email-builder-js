import { XMLParser } from 'fast-xml-parser';

/**
 * Parses XML string and returns field names from the first item found.
 */
export function parseXmlToFieldNames(xmlText: string): string[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);
    let firstItem: Record<string, unknown> | null = null;

    const findFirstItem = (obj: unknown): void => {
      if (firstItem) return;
      if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        firstItem = obj[0] as Record<string, unknown>;
        return;
      }
      if (typeof obj === 'object' && obj !== null) {
        const o = obj as Record<string, unknown>;
        if (Array.isArray(o.item) && o.item.length > 0) {
          firstItem = o.item[0] as Record<string, unknown>;
          return;
        }
        if (o.item && typeof o.item === 'object' && o.item !== null) {
          firstItem = o.item as Record<string, unknown>;
          return;
        }
        for (const key in o) {
          findFirstItem(o[key]);
          if (firstItem) return;
        }
      }
    };

    findFirstItem(result);
    if (!firstItem) return [];

    const keys: string[] = [];
    for (const k of Object.keys(firstItem)) {
      if (k.startsWith('@_')) continue;
      const v = firstItem[k];
      if (typeof v === 'string' || typeof v === 'number' || v === null) keys.push(k);
    }
    return keys;
  } catch {
    return [];
  }
}

/** Heuristic: object looks like a feed item (has common XML feed fields). */
function looksLikeItem(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    'title' in o ||
    'view_node' in o ||
    'body' in o ||
    'field_media_image' in o ||
    'nid' in o ||
    'field_author_attribution' in o
  );
}

/**
 * Parses XML string and returns all items as array of objects.
 */
export function parseXmlToItems(xmlText: string): Record<string, unknown>[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);
    let items: Record<string, unknown>[] = [];

    const findItems = (obj: unknown): void => {
      if (items.length > 0) return;
      if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
        if (looksLikeItem(obj[0])) {
          items = obj as Record<string, unknown>[];
          return;
        }
        for (const entry of obj) {
          findItems(entry);
          if (items.length > 0) return;
        }
        return;
      }
      if (typeof obj === 'object' && obj !== null) {
        const o = obj as Record<string, unknown>;
        if (Array.isArray(o.item) && o.item.length > 0) {
          items = o.item as Record<string, unknown>[];
          return;
        }
        if (o.item && typeof o.item === 'object' && o.item !== null && !Array.isArray(o.item)) {
          items = [o.item as Record<string, unknown>];
          return;
        }
        for (const key in o) {
          findItems(o[key]);
          if (items.length > 0) return;
        }
      }
    };

    findItems(result);
    return items;
  } catch {
    return [];
  }
}
