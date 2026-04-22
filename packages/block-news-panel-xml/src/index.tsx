import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { buildTopicFilteredFeedUrl } from '@usewaypoint/rheumnow-xml-topic';

/** Fixed feed URL for this block (not editable in the inspector). */
export const NEWS_PANEL_XML_FEED_URL = 'https://rheumnow.com/admin/daily_news_xml';

export const NewsPanelXmlPropsSchema = z.object({
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
    /** When not `all`, only include that content type (up to `numberOfItems`). */
    itemTypeFilter: z.enum(['all', 'Article', 'Tweet']).optional().nullable(),
    /** Omit article/tweet thumbnails to save vertical space. */
    hideImages: z.boolean().optional().nullable(),
  }).optional().nullable(),
});

export type NewsPanelXmlProps = z.infer<typeof NewsPanelXmlPropsSchema>;

export const NewsPanelXmlPropsDefaults = {
  title: '',
  numberOfItems: 3,
  createdStartDate: null,
  createdEndDate: null,
  createdRelativeDays: null,
  itemTypeFilter: 'all' as const,
  hideImages: false,
} as const;

export type NewsPanelItemTypeFilter = 'all' | 'Article' | 'Tweet';

type LinkItem = {
  href: string;
  text: string;
};

type ArticleItem = {
  type: 'Article';
  title: string;
  author: string;
  createdDate: string;
  createdDateTime: string;
  image: string;
  body: string;
  viewNode: string;
  showAuthor: boolean;
  isVideoType: boolean;
};

type TweetItem = {
  type: 'Tweet';
  image: string;
  tweetContent: string;
  links: LinkItem[];
  authorName: string;
  createdDate: string;
  createdDateTime: string;
  tweetId: string;
};

type NewsPanelItem = ArticleItem | TweetItem;
type DateFilterOptions = {
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
};
const DAY_IN_MS = 24 * 60 * 60 * 1000;

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
  items: NewsPanelItem[],
  { createdStartDate, createdEndDate, createdRelativeDays }: DateFilterOptions
): NewsPanelItem[] {
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

// Helper function to extract author from field_full_name (may contain HTML)
const extractAuthor = (fullName: string): string => {
  if (!fullName) return '';
  const text = fullName.replace(/<[^>]*>?/gm, '');
  return decodeHtmlEntities(text.trim());
};

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#039;/gi, "'")
    .replace(/&nbsp;/gi, '\u00a0');
}

/** CDATA / mixed XML nodes sometimes parse as string or { '#text': string }. */
const xmlFieldToString = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null && '#text' in value) {
    return String((value as { '#text': unknown })['#text']);
  }
  return '';
};

function parseXmlTruthyBool(raw: unknown): boolean {
  if (raw === true || raw === 1) return true;
  if (typeof raw === 'string') {
    const s = raw.trim().toLowerCase();
    return s === '1' || s === 'true' || s === 'on' || s === 'yes';
  }
  return false;
}

// Helper function to parse field_links HTML and extract link items
const parseLinks = (linksHtml: string): LinkItem[] => {
  if (!linksHtml) return [];
  
  const links: LinkItem[] = [];
  // Match <a href="..." target="...">text</a> patterns
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  
  while ((match = linkRegex.exec(linksHtml)) !== null) {
    links.push({
      href: match[1],
      text: match[2].replace(/<[^>]*>?/gm, '').trim(),
    });
  }
  
  return links;
};

// Extract XML parsing logic so it can be used both synchronously (SSR) and asynchronously (client)
function parseNewsPanelXml(
  xmlText: string,
  numberOfItems: number,
  itemTypeFilter: NewsPanelItemTypeFilter = 'all',
  dateFilters: DateFilterOptions = {}
): NewsPanelItem[] {
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
        if (first && (first.title || first.field_media_image || first.nid || first.type)) {
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

    const mappedItems: NewsPanelItem[] = foundItems.map((item: any) => {
      const itemType = item.type || '';
      const { createdDate, createdDateTime } = parseCreatedField(item.created_1 || item.created);

      if (itemType.toLowerCase() === 'article') {
        const author = extractAuthor(item.field_full_name || '');
        const showAuthor = item.field_show_author == 1 || item.field_show_author === '1';
        const typeStr = String(item.type ?? '').trim();
        const fromXml = parseXmlTruthyBool(
          item.is_video_type ?? item.isVideoType ?? item.field_is_video_type
        );
        const isVideoType = fromXml || typeStr.toLowerCase() === 'video';

        return {
          type: 'Article' as const,
          title: decodeHtmlEntities(xmlFieldToString(item.title)),
          author: author,
          createdDate,
          createdDateTime,
          image: item.field_media_image || '',
          body: item.body || '',
          viewNode: item.view_node || '',
          showAuthor: showAuthor,
          isVideoType,
        };
      } else {
        const image = item.field_tweet_external_image || item.field_social_author_image1 || '';
        const links = parseLinks(xmlFieldToString(item.field_links));

        return {
          type: 'Tweet' as const,
          image: image,
          tweetContent: item.field_tweet_content || '',
          links: links,
          authorName: decodeHtmlEntities(xmlFieldToString(item.field_social_author_name)),
          createdDate,
          createdDateTime,
          tweetId: item.field_tweet_id || '',
        };
      }
    });

    const typeFiltered =
      itemTypeFilter === 'all'
        ? mappedItems
        : mappedItems.filter((i) => i.type === itemTypeFilter);
    const dateFiltered = filterItemsByCreatedDate(typeFiltered, dateFilters);

    return dateFiltered.slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse news panel XML:', err);
    return [];
  }
}

export function NewsPanelXml({
  style,
  props,
  showEmptyStateMessage = false,
}: NewsPanelXmlProps & { showEmptyStateMessage?: boolean }) {
  const url = buildTopicFilteredFeedUrl(NEWS_PANEL_XML_FEED_URL, props?.topicTid, props?.dashboardTagTid);
  const title = props?.title ?? NewsPanelXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? NewsPanelXmlPropsDefaults.numberOfItems;
  const itemTypeFilter: NewsPanelItemTypeFilter =
    props?.itemTypeFilter ?? NewsPanelXmlPropsDefaults.itemTypeFilter;
  const hideImages = props?.hideImages ?? NewsPanelXmlPropsDefaults.hideImages;
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
    ? parseNewsPanelXml(preFetchedXmlText, numberOfItems, itemTypeFilter, dateFilters)
    : null;

  const [items, setItems] = useState<NewsPanelItem[]>(preFetchedItems || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preFetchedXmlText) {
      setItems(parseNewsPanelXml(preFetchedXmlText, numberOfItems, itemTypeFilter, dateFilters));
    }
  }, [preFetchedXmlText, numberOfItems, itemTypeFilter, dateFilters.createdStartDate, dateFilters.createdEndDate, dateFilters.createdRelativeDays]);

  useEffect(() => {
    // Skip fetching if we already have pre-fetched data
    if (preFetchedXmlText) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setItems([]);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const text = await response.text();
        
        const parsedItems = parseNewsPanelXml(text, numberOfItems, itemTypeFilter, dateFilters);
        setItems(parsedItems);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, numberOfItems, itemTypeFilter, preFetchedXmlText, dateFilters.createdStartDate, dateFilters.createdEndDate, dateFilters.createdRelativeDays]);

  const padding = style?.padding;
  const wrapperStyle = {
    padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
    fontFamily: 'sans-serif',
  };

  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading news...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) {
    return showEmptyStateMessage
      ? <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No news items found.</div>
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
        if (item.type === 'Article') {
          // Render Article
          return (
            <div key={index} style={{ marginBottom: 24, paddingBottom: 16, borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none' }}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    {item.image && !hideImages && (
                      <td width="160" valign="top" style={{ paddingRight: 16, paddingBottom: 0 }}>
                        {item.viewNode ? (
                          <a href={item.viewNode} target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            <img src={item.image} alt={item.title} width="160" style={{ width: '160px', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                          </a>
                        ) : (
                          <img src={item.image} alt={item.title} width="160" style={{ width: '160px', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                        )}
                      </td>
                    )}
                    <td valign="top" style={{ paddingBottom: 0 }}>
                      {item.viewNode ? (
                        <a href={item.viewNode} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' }}>{item.title}</h3>
                        </a>
                      ) : (
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4' }}>{item.title}</h3>
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
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        } else {
          // Render Tweet
          return (
            <div key={index} style={{ marginBottom: 24, paddingBottom: 16, borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none' }}>
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    {item.image && !hideImages && (
                      <td width="160" valign="top" style={{ paddingRight: 16, paddingBottom: 0 }}>
                        {item.tweetId ? (
                          <a href={item.tweetId} target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            <img src={item.image} alt="Tweet" width="160" style={{ width: '160px', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                          </a>
                        ) : (
                          <img src={item.image} alt="Tweet" width="160" style={{ width: '160px', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                        )}
                      </td>
                    )}
                    <td valign="top" style={{ paddingBottom: 0 }}>
                      {item.tweetId ? (
                        <a href={item.tweetId} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#666', marginBottom: 12 }}>
                            {decodeHtmlEntities(item.tweetContent.replace(/<!\[CDATA\[|\]\]>/g, ''))}
                          </div>
                        </a>
                      ) : (
                        <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#666', marginBottom: 12 }}>
                          {decodeHtmlEntities(item.tweetContent.replace(/<!\[CDATA\[|\]\]>/g, ''))}
                        </div>
                      )}

                      {item.links.length > 0 && (
                        <div
                          style={{
                            marginTop: 4,
                            marginBottom: 12,
                            paddingLeft: 0,
                            marginLeft: 0,
                          }}
                        >
                          {item.links.map((link, linkIndex) => (
                            <div
                              key={linkIndex}
                              style={{
                                marginBottom: linkIndex < item.links.length - 1 ? 6 : 0,
                                lineHeight: 1.45,
                              }}
                            >
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: '#1585fe',
                                  textDecoration: 'underline',
                                  fontSize: '14px',
                                  fontWeight: 500,
                                  wordBreak: 'break-word',
                                }}
                              >
                                {link.text || link.href}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      <div style={{ fontSize: '12px', color: '#666' }}>
                        <img 
                          src="https://rkrn-images.s3.us-east-1.amazonaws.com/x_logo.png" 
                          alt="Twitter/X" 
                          width="14" 
                          height="14" 
                          style={{ 
                            width: '14px', 
                            height: '14px', 
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            marginRight: '6px'
                          }} 
                        />
                        {item.authorName && (
                          <>
                            <span style={{ fontWeight: 'bold' }}>{item.authorName}</span>{item.createdDate && (
                              <><span style={{ margin: '0 8px' }}>•</span><span>{item.createdDate}</span></>
                            )}
                          </>
                        )}
                        {!item.authorName && item.createdDate && (
                          <span>{item.createdDate}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        }
      })}
    </div>
  );
}

