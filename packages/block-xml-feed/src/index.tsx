import React from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

// Re-export block type options (single source of truth for the list)
export { BLOCK_TYPE_OPTIONS, type XmlBlockTypeValue } from './blockTypes';

/** Field type options for the mapping table (second column). */
export const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'link', label: 'Link' },
  { value: 'image', label: 'Image' },
  { value: 'number', label: 'Number' },
  { value: 'html', label: 'HTML' },
  { value: 'doNotShow', label: 'Do not show' },
] as const;

export type FieldTypeValue = (typeof FIELD_TYPE_OPTIONS)[number]['value'];

export const UniversalXmlFeedPropsSchema = z.object({
  style: z
    .object({
      padding: z
        .object({
          top: z.number(),
          bottom: z.number(),
          right: z.number(),
          left: z.number(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  props: z
    .object({
      blockType: z.string().optional().nullable(),
      url: z.string().optional().nullable(),
      fieldMapping: z.record(z.string(), z.string()).optional().nullable(),
      previewItems: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type UniversalXmlFeedProps = z.infer<typeof UniversalXmlFeedPropsSchema>;

export const UniversalXmlFeedPropsDefaults = {
  blockType: 'PromotedSurveyXml',
  url: '',
  fieldMapping: {} as Record<string, string>,
  previewItems: null as Record<string, unknown>[] | null,
} as const;

/**
 * Parses XML string and returns all items as array of objects (same structure as discovered by parseXmlToFieldNames).
 * Used when user clicks "Parse & show" to display the feed in the block.
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
        items = obj as Record<string, unknown>[];
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

/**
 * Parses XML string and returns field names from the first item found in a repeating structure (e.g. item[], rss.channel.item).
 * Used by the config panel when user clicks "Load" to discover columns for the mapping table.
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

    const obj = firstItem as Record<string, unknown>;
    const keys: string[] = [];
    for (const k of Object.keys(obj)) {
      if (k.startsWith('@_')) continue;
      const v = obj[k];
      if (typeof v === 'string' || typeof v === 'number' || v === null) {
        keys.push(k);
      }
    }
    return keys.sort();
  } catch {
    return [];
  }
}

function stringValue(val: unknown): string {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  return String(val);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function UniversalXmlFeed({ style, props: propsData }: UniversalXmlFeedProps) {
  const url = propsData?.url ?? UniversalXmlFeedPropsDefaults.url;
  const blockType = propsData?.blockType ?? UniversalXmlFeedPropsDefaults.blockType;
  const fieldMapping = propsData?.fieldMapping ?? UniversalXmlFeedPropsDefaults.fieldMapping;
  const previewItems = propsData?.previewItems ?? UniversalXmlFeedPropsDefaults.previewItems ?? [];

  const padding = style?.padding;
  const wrapperStyle: React.CSSProperties = {
    padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
    fontFamily: 'sans-serif',
  };

  if (!url) {
    return (
      <div
        style={{
          ...wrapperStyle,
          border: '1px dashed #ccc',
          textAlign: 'center',
          padding: '20px',
          color: '#666',
        }}
      >
        Configure XML feed: choose block type, enter URL, and click Load in the right panel.
      </div>
    );
  }

  if (previewItems.length > 0) {
    return (
      <div style={wrapperStyle}>
        <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>
          XML feed ({blockType}) — {previewItems.length} item(s)
        </div>
        {previewItems.map((item, index) => (
          <div
            key={index}
            style={{
              marginBottom: 16,
              borderBottom: index < previewItems.length - 1 ? '1px solid #eee' : 'none',
              paddingBottom: 16,
            }}
          >
            {Object.keys(fieldMapping).length === 0
              ? Object.entries(item).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 4 }}>
                    {escapeHtml(stringValue(v))}
                  </div>
                ))
              : Object.entries(fieldMapping)
                  .filter(([, fieldType]) => fieldType !== 'doNotShow')
                  .map(([fieldName, fieldType]) => {
                    const raw = item[fieldName];
                    const val = stringValue(raw);
                    if (fieldType === 'doNotShow' || !val) return null;
                    if (fieldType === 'link') {
                      return (
                        <div key={fieldName} style={{ marginBottom: 4 }}>
                          <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: '#1585fe' }}>
                            {escapeHtml(val)}
                          </a>
                        </div>
                      );
                    }
                    if (fieldType === 'image') {
                      return (
                        <div key={fieldName} style={{ marginBottom: 4 }}>
                          <img src={val} alt="" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                        </div>
                      );
                    }
                    if (fieldType === 'html') {
                      return (
                        <div
                          key={fieldName}
                          style={{ marginBottom: 4 }}
                          dangerouslySetInnerHTML={{ __html: val }}
                        />
                      );
                    }
                    return (
                      <div key={fieldName} style={{ marginBottom: 4 }}>
                        {escapeHtml(val)}
                      </div>
                    );
                  })}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ ...wrapperStyle, border: '1px solid #eee', borderRadius: 4, padding: 12 }}>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        XML feed ({blockType})
      </div>
      <div style={{ fontSize: 14, color: '#333' }}>{url}</div>
      <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
        Click &quot;Parse &amp; show&quot; in the right panel to display the feed.
      </div>
    </div>
  );
}
