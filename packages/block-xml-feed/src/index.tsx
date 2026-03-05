import React from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

// Re-export block type options; title helper is defined here so it works with compiled blockTypes.js
export { BLOCK_TYPE_OPTIONS, type XmlBlockTypeValue } from './blockTypes';

/** Default block header title by block type (used when blockTypes.js has no blockTitle). */
const BLOCK_TITLE_BY_TYPE: Record<string, string> = {
  VideoXml: 'Video XML',
  VideoPosterBlock: 'Poster Hall',
  Gems: 'Gems',
  TherapeuticUpdateXml: 'Therapeutic Updates',
  FeaturedStoryXml: 'Featured Story',
  NewsPanelXml: 'News Panel',
  BlogXml: 'Blogs',
  Advertisement72890Xml: 'Advertisement 728x90',
  Advertisement300250Xml: 'Advertisement 300x250',
  ConferenceAdvertisement300250Xml: 'Conference Advertisement',
  DailyDownloadXml: 'Daily Download',
  PromotedSurveyXml: 'RheumNow Survey',
};

/** Default block header title for a given block type. */
export function getBlockTitleByType(blockType: string | null | undefined): string {
  if (!blockType) return '';
  return BLOCK_TITLE_BY_TYPE[blockType] ?? '';
}

/** Field type options for the mapping table (second column). */
export const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'title', label: 'Title' },
  { value: 'contentLink', label: 'Content link' },
  { value: 'imageWithContentLink', label: 'Image with content link' },
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
      title: z.string().optional().nullable(),
      url: z.string().optional().nullable(),
      numberOfItems: z.number().min(0).optional().nullable(),
      fieldOrder: z.array(z.string()).optional().nullable(),
      fieldMapping: z.record(z.string(), z.string()).optional().nullable(),
      previewItems: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type UniversalXmlFeedProps = z.infer<typeof UniversalXmlFeedPropsSchema>;

export const UniversalXmlFeedPropsDefaults = {
  blockType: 'PromotedSurveyXml',
  title: null as string | null,
  url: '',
  numberOfItems: 0,
  fieldOrder: null as string[] | null,
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
    return keys;
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
  const title =
    propsData?.title != null && propsData.title !== ''
      ? propsData.title
      : getBlockTitleByType(blockType);
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
    const fieldOrder = propsData?.fieldOrder ?? UniversalXmlFeedPropsDefaults.fieldOrder;
    const mapping = fieldMapping ?? {};
    const visible = (name: string) => mapping[name] && mapping[name] !== 'doNotShow';
    const orderedNames =
      fieldOrder && fieldOrder.length > 0
        ? [
            ...fieldOrder.filter((name) => visible(name)),
            ...Object.keys(mapping).filter((name) => visible(name) && !fieldOrder.includes(name)),
          ]
        : Object.keys(mapping).filter((name) => visible(name));
    const mappingEntries: [string, string][] = orderedNames.map((name) => [name, mapping[name]]);
    const contentLinkField = mappingEntries.find(([, t]) => t === 'contentLink')?.[0];
    const titleField = mappingEntries.find(([, t]) => t === 'title')?.[0];
    const showPlayIcon = blockType === 'VideoPosterBlock' || blockType === 'VideoXml';
    const playIconSpan = showPlayIcon ? (
      <span style={{ marginRight: '6px', color: '#1585fe' }}>▶</span>
    ) : null;

    const isGems = blockType === 'Gems';
    const gemsBorderColor = '#a8bed4';
    const gemsBgColor = 'rgba(168, 190, 212, 0.3)';
    const gemsTextColor = '#2c3e50';
    const gemsAccentColor = '#4a6fa5';
    const blockTitleStyle: React.CSSProperties = isGems
      ? {
          fontSize: '22px',
          marginBottom: '14px',
          color: gemsTextColor,
          textTransform: 'none',
          borderLeft: `4px solid ${gemsBorderColor}`,
          paddingLeft: '12px',
          lineHeight: 1.3,
          margin: '0 0 20px 0',
          fontStyle: 'italic',
        }
      : {
          fontSize: '18px',
          marginBottom: '12px',
          color: '#333',
          textTransform: 'uppercase',
          borderLeft: '4px solid #1585fe',
          paddingLeft: '10px',
          lineHeight: 1.2,
          margin: '0 0 16px 0',
        };
    const getItemWrapperStyle = (index: number): React.CSSProperties =>
      isGems
        ? {
            marginBottom: 28,
            padding: '18px 18px 20px 20px',
            borderLeft: `3px solid ${gemsBorderColor}`,
            backgroundColor: gemsBgColor,
            borderRadius: '0 4px 4px 0',
          }
        : {
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: index < previewItems.length - 1 ? '1px solid #eee' : 'none',
          };
    const gemsTitleFontSize = '22px';
    const gemsBodyFontSize = '18px';
    const titleStyle: React.CSSProperties = isGems
      ? { margin: '0 0 10px 0', fontSize: gemsTitleFontSize, lineHeight: 1.45, color: gemsTextColor, fontStyle: 'italic' }
      : { margin: '0 0 8px 0', fontSize: '18px', lineHeight: 1.4, color: '#333' };
    const textStyle: React.CSSProperties = isGems
      ? { marginBottom: 6, fontSize: gemsBodyFontSize, lineHeight: 1.5, color: gemsTextColor }
      : { marginBottom: 4 };
    const blockStyle: React.CSSProperties = isGems
      ? { marginBottom: 10 }
      : { marginBottom: 8 };

    return (
      <div style={wrapperStyle}>
        {title && (
          <h2 style={blockTitleStyle}>
            {title}
          </h2>
        )}
        {previewItems.map((item, index) => {
          const record = item as Record<string, unknown>;
          const linkUrl = contentLinkField ? stringValue(record[contentLinkField]) : '';
          const titleVal = titleField ? stringValue(record[titleField]) : '';

          const renderField = (fieldName: string, fieldType: string, val: string, key: string) => {
            if (fieldType === 'doNotShow' || !val) return null;
            if (fieldType === 'contentLink') return null;
            if (fieldType === 'link') {
              return (
                <div key={key} style={textStyle}>
                  <a href={val} target="_blank" rel="noopener noreferrer" style={{ color: isGems ? gemsAccentColor : '#1585fe' }}>
                    {escapeHtml(val)}
                  </a>
                </div>
              );
            }
            if (fieldType === 'title') {
              const titleNode = (
                <h3 style={titleStyle}>
                  {playIconSpan}
                  {escapeHtml(val)}
                </h3>
              );
              if (linkUrl) {
                return (
                  <div key={key} style={blockStyle}>
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      {titleNode}
                    </a>
                  </div>
                );
              }
              return (
                <div key={key} style={blockStyle}>
                  {titleNode}
                </div>
              );
            }
            if (fieldType === 'image' || fieldType === 'imageWithContentLink') {
              const img = (
                <img
                  src={val}
                  alt={titleVal || ''}
                  style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 }}
                />
              );
              if (fieldType === 'imageWithContentLink' && linkUrl) {
                return (
                  <div key={key} style={textStyle}>
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                    >
                      {img}
                    </a>
                  </div>
                );
              }
              return (
                <div key={key} style={textStyle}>
                  {img}
                </div>
              );
            }
            if (fieldType === 'html') {
              return (
                <div key={key} style={textStyle} dangerouslySetInnerHTML={{ __html: val }} />
              );
            }
            return (
              <div key={key} style={textStyle}>
                {escapeHtml(val)}
              </div>
            );
          };

          if (Object.keys(fieldMapping).length === 0) {
            return (
              <div
                key={index}
                style={{
                  marginBottom: 16,
                  borderBottom: index < previewItems.length - 1 ? '1px solid #eee' : 'none',
                  paddingBottom: 16,
                }}
              >
                {Object.entries(item).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 4 }}>
                    {escapeHtml(stringValue(v))}
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div key={index} style={getItemWrapperStyle(index)}>
              {mappingEntries.map(([fieldName, fieldType]) =>
                renderField(fieldName, fieldType, stringValue(item[fieldName]), fieldName),
              )}
            </div>
          );
        })}
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
