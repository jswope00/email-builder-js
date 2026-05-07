import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { buildTopicFilteredFeedUrl } from '@usewaypoint/rheumnow-xml-topic';

/** Fixed feed URL for this block (not editable in the inspector). */
export const VIDEO_XML_FEED_URL = 'https://rheumnow.com/admin/videos-xml';

export const VideoXmlPropsSchema = z.object({
  style: z.object({
    padding: z.object({
      top: z.number(),
      bottom: z.number(),
      right: z.number(),
      left: z.number(),
    }).optional().nullable(),
  }).optional().nullable(),
  props: z.object({
    title: z.string().optional().nullable(),
    numberOfItems: z.number().min(1).max(10).optional().nullable(),
    topicTid: z.number().int().positive().optional().nullable(),
    dashboardTagTid: z.number().int().positive().optional().nullable(),
    createdStartDate: z.string().optional().nullable(),
    createdEndDate: z.string().optional().nullable(),
    createdRelativeDays: z.number().int().min(0).optional().nullable(),
  }).optional().nullable(),
});

export type VideoXmlProps = z.infer<typeof VideoXmlPropsSchema>;

export const VideoXmlPropsDefaults = {
  title: '',
  numberOfItems: 3,
  createdStartDate: null,
  createdEndDate: null,
  createdRelativeDays: null,
} as const;

type VideoItem = {
  title: string;
  createdDate: string;
  createdDateTime: string;
  image: string;
  caption: string;
  link: string;
};

type DateFilterOptions = {
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/gi, '\u00a0');
}

function parseCreatedField(created: unknown): { createdDate: string; createdDateTime: string } {
  if (!created) return { createdDate: '', createdDateTime: '' };
  const raw = typeof created === 'string' ? created : String(created);
  const datetimeMatch = raw.match(/datetime=["']([^"']+)["']/i);
  const dateTextMatch = raw.match(/>([^<]+)<\/time>/);
  return {
    createdDate: dateTextMatch && dateTextMatch[1] ? dateTextMatch[1] : raw,
    createdDateTime: datetimeMatch && datetimeMatch[1] ? datetimeMatch[1] : '',
  };
}

function parseDateStart(value: string): number | null {
  const parsed = new Date(`${value}T00:00:00`).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateEnd(value: string): number | null {
  const parsed = new Date(`${value}T23:59:59.999`).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function filterItemsByCreatedDate(
  items: VideoItem[],
  { createdStartDate, createdEndDate, createdRelativeDays }: DateFilterOptions
): VideoItem[] {
  const hasStart = typeof createdStartDate === 'string' && createdStartDate.trim() !== '';
  const hasEnd = typeof createdEndDate === 'string' && createdEndDate.trim() !== '';
  const hasRelative = typeof createdRelativeDays === 'number' && Number.isFinite(createdRelativeDays);
  if (!hasStart && !hasEnd && !hasRelative) return items;

  const startTs = hasStart ? parseDateStart(createdStartDate!) : null;
  const endTs = hasEnd ? parseDateEnd(createdEndDate!) : null;
  const now = new Date();
  const relativeStartTs = hasRelative
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - createdRelativeDays! * DAY_IN_MS
    : null;

  return items.filter((item) => {
    const itemTs = new Date(item.createdDateTime).getTime();
    if (!Number.isFinite(itemTs)) return false;
    if (startTs !== null && itemTs < startTs) return false;
    if (endTs !== null && itemTs > endTs) return false;
    if (relativeStartTs !== null && itemTs < relativeStartTs) return false;
    return true;
  });
}


// Extract XML parsing logic so it can be used both synchronously (SSR) and asynchronously (client)
function parseVideoXml(
  xmlText: string,
  numberOfItems: number,
  dateFilters: DateFilterOptions = {}
): VideoItem[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_"
    });
    const result = parser.parse(xmlText);
    
    let foundItems: any[] = [];
    
    const findItems = (obj: any) => {
      if (foundItems.length > 0) return;
      
      if (Array.isArray(obj)) {
        const first = obj[0];
        if (first && (first.title || first.field_media_image)) {
          foundItems = obj;
          return;
        }
        for (const item of obj) {
          findItems(item);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        if (obj.item && Array.isArray(obj.item)) {
          foundItems = obj.item;
          return;
        }
        if (obj.item && typeof obj.item === 'object') {
          foundItems = [obj.item];
          return;
        }
        for (const key in obj) {
          findItems(obj[key]);
        }
      }
    };

    findItems(result);

    const mappedItems = foundItems.map((item: any) => {
      const { createdDate, createdDateTime } = parseCreatedField(item.created);
      return {
        title: item.title || '',
        createdDate,
        createdDateTime,
        image: item.field_media_image || '',
        caption: item.field_captions || '',
        link: item.field_media_video_embed_field || '',
      };
    });

    const filteredItems = filterItemsByCreatedDate(mappedItems, dateFilters);
    return filteredItems.slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse video XML:', err);
    return [];
  }
}

export function VideoXml({
  style,
  props,
  showEmptyStateMessage = false,
}: VideoXmlProps & { showEmptyStateMessage?: boolean }) {
  const url = buildTopicFilteredFeedUrl(VIDEO_XML_FEED_URL, props?.topicTid, props?.dashboardTagTid);
  const title = props?.title ?? VideoXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? VideoXmlPropsDefaults.numberOfItems;
  const dateFilters: DateFilterOptions = {
    createdStartDate: props?.createdStartDate,
    createdEndDate: props?.createdEndDate,
    createdRelativeDays: props?.createdRelativeDays,
  };

  // Try to get pre-fetched XML data from context
  // The renderToStaticMarkup function fetches XML data and makes it available globally
  // Supports both Node.js (global) and browser (window) environments
  let preFetchedXmlText: string | null = null;
  try {
    if (url) {
      // Check global (Node.js) first, then window (browser)
      const contextData = (typeof global !== 'undefined' ? (global as any).__XML_DATA_CONTEXT__ : undefined) ||
                         (typeof window !== 'undefined' ? (window as any).__XML_DATA_CONTEXT__ : undefined);
      if (contextData && contextData[url]) {
        preFetchedXmlText = contextData[url];
      }
    }
  } catch {
    // Context not available, will use useEffect fallback
  }
  
  // Parse pre-fetched data synchronously if available
  const preFetchedItems = preFetchedXmlText
    ? parseVideoXml(preFetchedXmlText, numberOfItems, dateFilters)
    : null;

  const [items, setItems] = useState<VideoItem[]>(preFetchedItems || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetching if we already have pre-fetched data
    if (preFetchedItems) {
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setItems([]);
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const text = await response.text();
        
        const parsedItems = parseVideoXml(text, numberOfItems, dateFilters);
        setItems(parsedItems);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, numberOfItems, preFetchedItems, dateFilters.createdStartDate, dateFilters.createdEndDate, dateFilters.createdRelativeDays]);

  const padding = style?.padding;
  const wrapperStyle = {
    padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
    fontFamily: 'sans-serif',
  };

  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading videos...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) {
    return showEmptyStateMessage
      ? <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No videos found.</div>
      : null;
  }

  return (
    <div style={wrapperStyle}>
      {title && (
        <h2
          style={{
            fontSize: '18px',
            marginBottom: '12px',
            color: '#333',
            textTransform: 'uppercase',
            borderLeft: '4px solid #1585fe',
            paddingLeft: '10px',
            lineHeight: '1.2',
            margin: '0 0 16px 0',
          }}
        >
          {title}
        </h2>
      )}
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: 24, borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none', paddingBottom: 16 }}>
            {item.link ? (
                <a href={item.link} target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                     {item.image && (
                        <div style={{ marginBottom: 12 }}>
                            <img src={item.image} alt={decodeHtmlEntities(item.title)} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                        </div>
                    )}
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' }}>
                      <span style={{ marginRight: '6px', color: '#1585fe' }}>▶</span>
                      {decodeHtmlEntities(item.title)}
                    </h3>
                </a>
            ) : (
                <>
                    {item.image && (
                        <div style={{ marginBottom: 12 }}>
                            <img src={item.image} alt={decodeHtmlEntities(item.title)} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                        </div>
                    )}
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' }}>
                      <span style={{ marginRight: '6px', color: '#1585fe' }}>▶</span>
                      {decodeHtmlEntities(item.title)}
                    </h3>
                </>
            )}
            
            {item.caption && (
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#666' }}>{item.caption}</p>
            )}
        </div>
      ))}
    </div>
  );
}

