import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { buildTopicFilteredFeedUrl } from '@usewaypoint/rheumnow-xml-topic';

/** Fixed feed URL for this block (not editable in the inspector). */
export const DAILY_DOWNLOAD_XML_FEED_URL = 'https://rheumnow.com/admin/daily_download_xml';

export const DailyDownloadXmlPropsSchema = z.object({
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

export type DailyDownloadXmlProps = z.infer<typeof DailyDownloadXmlPropsSchema>;

export const DailyDownloadXmlPropsDefaults = {
  title: '',
  numberOfItems: 3,
  createdStartDate: null,
  createdEndDate: null,
  createdRelativeDays: null,
} as const;

type DownloadItem = {
  title: string;
  createdDate: string;
  createdDateTime: string;
  image: string;
  viewNode: string;
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
  items: DownloadItem[],
  { createdStartDate, createdEndDate, createdRelativeDays }: DateFilterOptions
): DownloadItem[] {
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
function parseDailyDownloadXml(
  xmlText: string,
  numberOfItems: number,
  dateFilters: DateFilterOptions = {}
): DownloadItem[] {
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
        if (first && (first.title || first.thumbnail__target_id || first.view_node || first.nid)) {
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

    const mappedItems: DownloadItem[] = foundItems.map((item: any) => {
      const { createdDate, createdDateTime } = parseCreatedField(item.created);
      return {
        title: item.title || '',
        createdDate,
        createdDateTime,
        image: item.thumbnail__target_id || '',
        viewNode: item.view_node || '',
      };
    });

    const filteredItems = filterItemsByCreatedDate(mappedItems, dateFilters);
    return filteredItems.slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse daily download XML:', err);
    return [];
  }
}

export function DailyDownloadXml({
  style,
  props,
  showEmptyStateMessage = false,
}: DailyDownloadXmlProps & { showEmptyStateMessage?: boolean }) {
  const url = buildTopicFilteredFeedUrl(DAILY_DOWNLOAD_XML_FEED_URL, props?.topicTid, props?.dashboardTagTid);
  const title = props?.title ?? DailyDownloadXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? DailyDownloadXmlPropsDefaults.numberOfItems;
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
    ? parseDailyDownloadXml(preFetchedXmlText, numberOfItems, dateFilters)
    : null;

  const [items, setItems] = useState<DownloadItem[]>(preFetchedItems || []);
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
        
        const parsedItems = parseDailyDownloadXml(text, numberOfItems, dateFilters);
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

  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading downloads...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) {
    return showEmptyStateMessage
      ? <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No downloads found.</div>
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
        <div key={index} style={{ marginBottom: 24, paddingBottom: 16, borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none' }}>
          {item.viewNode ? (
            <a href={item.viewNode} target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              {item.image && (
                <img src={item.image} alt={decodeHtmlEntities(item.title)} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 }} />
              )}
            </a>
          ) : (
            <>
              {item.image && (
                <img src={item.image} alt={decodeHtmlEntities(item.title)} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 }} />
              )}
            </>
          )}
          
          {item.viewNode && (
            <a 
              href={item.viewNode} 
              target="_blank" 
              style={{ 
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#1585fe',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Download
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
