import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { buildTopicFilteredFeedUrl } from '@usewaypoint/rheumnow-xml-topic';

/** Fixed feed URL for this block (not editable in the inspector). */
export const BLOG_XML_FEED_URL = 'https://rheumnow.com/admin/blogs_xml';

export const BlogXmlPropsSchema = z.object({
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

export type BlogXmlProps = z.infer<typeof BlogXmlPropsSchema>;

export const BlogXmlPropsDefaults = {
  title: '',
  numberOfItems: 3,
  createdStartDate: null,
  createdEndDate: null,
  createdRelativeDays: null,
} as const;

type BlogItem = {
  title: string;
  author: string;
  createdDate: string;
  createdDateTime: string;
  image: string;
  body: string;
  type: string;
  isVideoType: boolean;
  viewNode: string;
  showAuthor: boolean;
  articleType: string;
};

type DateFilterOptions = {
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
};

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

function parseXmlTruthyBool(raw: unknown): boolean {
  if (raw === true || raw === 1) return true;
  if (typeof raw === 'string') {
    const s = raw.trim().toLowerCase();
    return s === '1' || s === 'true' || s === 'on' || s === 'yes';
  }
  return false;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const parseCreatedField = (created: unknown): { createdDate: string; createdDateTime: string } => {
  if (!created) return { createdDate: '', createdDateTime: '' };
  const raw = typeof created === 'string' ? created : String(created);
  const datetimeMatch = raw.match(/datetime=["']([^"']+)["']/i);
  const dateTextMatch = raw.match(/>([^<]+)<\/time>/);
  return {
    createdDate: dateTextMatch && dateTextMatch[1] ? dateTextMatch[1] : raw,
    createdDateTime: datetimeMatch && datetimeMatch[1] ? datetimeMatch[1] : '',
  };
};

function parseDateStart(value: string): number | null {
  const parsed = new Date(`${value}T00:00:00`).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateEnd(value: string): number | null {
  const parsed = new Date(`${value}T23:59:59.999`).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function filterItemsByCreatedDate(
  items: BlogItem[],
  { createdStartDate, createdEndDate, createdRelativeDays }: DateFilterOptions
): BlogItem[] {
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

// Helper function to get branding image URL based on article type
const getBrandingImageUrl = (articleType: string): string | null => {
  if (articleType === 'Advanced Practice Rheum') {
    return 'https://rheumnow.com/sites/default/files/advanced_practice_rheum_logo.jpg';
  }
  if (articleType === 'RheumThought') {
    return 'http://localhost:9001/sites/default/files/2023-02/Rheumthoughts%20final.png';
  }
  return null;
};

// Helper function to parse XML and extract blog items
function parseBlogXml(
  xmlText: string,
  numberOfItems: number,
  dateFilters: DateFilterOptions = {}
): BlogItem[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);

    let foundItems: any[] = [];

    const findItems = (obj: any) => {
      if (foundItems.length > 0) return;

      if (Array.isArray(obj)) {
        const first = obj[0];
        if (first && (first.title || first.field_media_image || first.nid || first.view_node)) {
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

    const mappedItems: BlogItem[] = foundItems.map((item: any) => {
      const { createdDate, createdDateTime } = parseCreatedField(item.created);
      const image = item.field_media_image || item.field_media_image || '';
      const showAuthor = item.field_show_author == 1 || item.field_show_author === '1';

      const typeStr = String(item.type ?? '').trim();
      const fromXml = parseXmlTruthyBool(
        item.is_video_type ?? item.isVideoType ?? item.field_is_video_type
      );
      const isVideoType = fromXml || typeStr.toLowerCase() === 'video';

      return {
        title: item.title || '',
        author: item.field_author_attribution || '',
        createdDate,
        createdDateTime,
        image: image,
        body: item.body || '',
        type: typeStr,
        isVideoType,
        viewNode: item.view_node || '',
        showAuthor: showAuthor,
        articleType: item.field_article_type || '',
      };
    });

    const filteredItems = filterItemsByCreatedDate(mappedItems, dateFilters);
    return filteredItems.slice(0, numberOfItems);
  } catch (err) {
    console.error('Error parsing blog XML:', err);
    return [];
  }
}

export function BlogXml({
  style,
  props,
  showEmptyStateMessage = false,
}: BlogXmlProps & { showEmptyStateMessage?: boolean }) {
  const url = buildTopicFilteredFeedUrl(BLOG_XML_FEED_URL, props?.topicTid, props?.dashboardTagTid);
  const title = props?.title ?? BlogXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? BlogXmlPropsDefaults.numberOfItems;
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
    ? parseBlogXml(preFetchedXmlText, numberOfItems, dateFilters)
    : null;

  const [items, setItems] = useState<BlogItem[]>(preFetchedItems || []);
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
        
        const parsedItems = parseBlogXml(text, numberOfItems, dateFilters);
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

  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading blog posts...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) {
    return showEmptyStateMessage
      ? <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No blog posts found.</div>
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
      {items.map((item, index) => {
        const brandingImageUrl = getBrandingImageUrl(item.articleType);

        return (
          <div key={index} style={{ marginBottom: 24, paddingBottom: 16, borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none' }}>
            {item.viewNode ? (
              <a href={item.viewNode} target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' }}>{decodeHtmlEntities(item.title)}</h3>
              </a>
            ) : (
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4' }}>{decodeHtmlEntities(item.title)}</h3>
            )}
            
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              {item.showAuthor && item.author && (
                <>
                  <span style={{ fontWeight: 'bold' }}>{item.author}</span>{item.createdDate && (
                    <><span style={{ margin: '0 8px' }}>•</span><span>{item.createdDate}</span></>
                  )}
                </>
              )}
              {!item.showAuthor && item.createdDate && (
                <span>{item.createdDate}</span>
              )}
            </div>

            {brandingImageUrl && (
              <div style={{ marginBottom: 12 }}>
                <img 
                  src={brandingImageUrl} 
                  alt={item.articleType}
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    display: 'block' 
                  }} 
                />
              </div>
            )}

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

            {item.body && (
              <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#666' }}>
                {decodeHtmlEntities(item.body.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>?/gm, ''))}
              </div>
            )}

            {item.viewNode && (
              <div style={{ marginTop: 12 }}>
                <a
                  href={item.viewNode}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1585fe',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    padding: '10px 20px',
                    borderRadius: 4,
                  }}
                >
                  {item.isVideoType ? 'Watch Video' : 'Read Article'}
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

