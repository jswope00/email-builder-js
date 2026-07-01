import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { buildTopicFilteredFeedUrl, decodeHtmlEntities } from '@usewaypoint/rheumnow-xml-topic';

/** Fixed feed URL for this block (not editable in the inspector). */
export const GEMS_XML_FEED_URL = 'https://rheumnow.com/admin/gems-xml';

export const GemsXmlPropsSchema = z.object({
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
      title: z.string().optional().nullable(),
      numberOfItems: z.number().min(1).max(10).optional().nullable(),
      topicTid: z.number().int().positive().optional().nullable(),
      dashboardTagTid: z.number().int().positive().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type GemsXmlProps = z.infer<typeof GemsXmlPropsSchema>;

export const GemsXmlPropsDefaults = {
  title: 'Gems',
  numberOfItems: 1,
} as const;

const BRAND_BLUE = '#1585fe';
const TEXT_PRIMARY = '#333333';
const GEM_CARD_BG = '#0a3d62';
const GEM_CARD_TEXT = '#ffffff';
/** White quote icon for gem cards (hosted on rheumnow.com). */
export const GEMS_QUOTE_ICON_URL = 'https://rheumnow.com/sites/default/files/2026-07/white-quote.png';

const SANS = 'Arial, Helvetica, sans-serif';

type GemsItem = {
  quote: string;
  attribution: string;
};

function xmlTextContent(raw: unknown): string {
  if (raw == null) return '';
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) {
    for (const el of raw) {
      const s = xmlTextContent(el).trim();
      if (s) return s;
    }
    return '';
  }
  if (typeof raw === 'object' && raw !== null) {
    const rec = raw as Record<string, unknown>;
    if ('#text' in rec) return String(rec['#text'] ?? '');
    if ('__cdata' in rec) return String(rec.__cdata ?? '');
  }
  return String(raw);
}

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
}

function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanBodyText(raw: unknown): string {
  const text = stripCdata(xmlTextContent(raw));
  if (!text) return '';
  return decodeHtmlEntities(stripTags(text));
}

/** Extracts the quoted passage and speaker from feed `body` + `field_author_attribution`. */
export function parseGemQuote(bodyRaw: unknown, authorRaw: unknown): { quote: string; attribution: string } {
  const body = cleanBodyText(bodyRaw);
  const authorFromField = cleanBodyText(authorRaw);

  let quote = body;
  const doubleQuoted = body.match(/[""]([^""]+)[""]/);
  const guillemet = body.match(/«([^»]+)»/);
  if (doubleQuoted?.[1]) {
    quote = doubleQuoted[1].trim();
  } else if (guillemet?.[1]) {
    quote = guillemet[1].trim();
  } else {
    quote = body.replace(/^PETRI-isms:\s*/i, '').replace(/\s[-–—]\s*(Dr\.\s*)?.+$/i, '').trim();
  }

  let attribution = authorFromField;
  if (!attribution) {
    const suffix = body.match(/\s[-–—]\s*((?:Dr\.\s*)?.+?)\s*$/i);
    if (suffix?.[1]) attribution = suffix[1].trim();
  }

  return { quote, attribution };
}

function collectGemItemNodes(parsed: unknown): any[] {
  let foundItems: any[] = [];

  const findItems = (obj: any) => {
    if (foundItems.length > 0) return;

    if (Array.isArray(obj)) {
      const first = obj[0];
      if (first && (first.body != null || first.field_author_attribution != null)) {
        foundItems = obj;
        return;
      }
      for (const item of obj) findItems(item);
    } else if (typeof obj === 'object' && obj !== null) {
      if (obj.item && Array.isArray(obj.item)) {
        foundItems = obj.item;
        return;
      }
      if (obj.item && typeof obj.item === 'object') {
        foundItems = [obj.item];
        return;
      }
      for (const key in obj) findItems(obj[key]);
    }
  };

  findItems(parsed);
  return foundItems;
}

export function parseGemsXml(xmlText: string, numberOfItems: number): GemsItem[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);
    const foundItems = collectGemItemNodes(result);

    const mapped: GemsItem[] = foundItems
      .map((item: any) => parseGemQuote(item.body, item.field_author_attribution))
      .filter((item) => item.quote.length > 0);

    return mapped.slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse gems XML:', err);
    return [];
  }
}

export function buildGemsFeedUrl(topicTid?: number | null, dashboardTagTid?: number | null): string {
  return buildTopicFilteredFeedUrl(GEMS_XML_FEED_URL, topicTid, dashboardTagTid);
}

function formatAttribution(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '';
  if (/^dr\.?\s/i.test(trimmed)) return `— ${trimmed}`;
  return `— Dr. ${trimmed}`;
}

function GemQuoteCard({ quote, attribution }: GemsItem) {
  return (
    <table
      role="presentation"
      cellPadding={0}
      cellSpacing={0}
      border={0}
      width="100%"
      style={{
        borderCollapse: 'collapse',
        marginBottom: '20px',
        fontFamily: SANS,
      }}
    >
      <tbody>
        <tr>
          <td align="center">
            <table
              role="presentation"
              cellPadding={0}
              cellSpacing={0}
              border={0}
              width="300"
              style={{
                borderCollapse: 'collapse',
                backgroundColor: GEM_CARD_BG,
                borderRadius: '8px',
                width: '300px',
                maxWidth: '100%',
                boxSizing: 'border-box',
              }}
            >
              <tbody>
                <tr>
                  <td
                    align="center"
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: GEM_CARD_TEXT,
                      fontFamily: SANS,
                    }}
                  >
                    <img
                      src={GEMS_QUOTE_ICON_URL}
                      alt=""
                      width={48}
                      height={48}
                      aria-hidden
                      style={{
                        display: 'block',
                        margin: '0 auto 16px auto',
                        border: 0,
                      }}
                    />
                    <div
                      style={{
                        clear: 'both',
                        color: GEM_CARD_TEXT,
                        fontFamily: SANS,
                        fontSize: '18px',
                        lineHeight: '1.4',
                        marginBottom: attribution ? '16px' : '0',
                      }}
                    >
                      <strong style={{ color: GEM_CARD_TEXT, fontFamily: SANS, fontSize: '18px' }}>
                        {quote}
                      </strong>
                    </div>
                    {attribution ? (
                      <>
                        <div
                          aria-hidden
                          style={{
                            width: '40px',
                            height: '1px',
                            backgroundColor: 'rgba(255, 255, 255, 0.35)',
                            margin: '0 auto 14px auto',
                          }}
                        />
                        <div
                          style={{
                            clear: 'both',
                            color: 'rgba(255, 255, 255, 0.85)',
                            fontFamily: SANS,
                            fontSize: '14px',
                            lineHeight: '1.4',
                            fontWeight: 400,
                            fontStyle: 'italic',
                          }}
                        >
                          {formatAttribution(attribution)}
                        </div>
                      </>
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function GemsXml({
  style,
  props,
  showEmptyStateMessage = false,
}: GemsXmlProps & { showEmptyStateMessage?: boolean }) {
  const url = buildGemsFeedUrl(props?.topicTid, props?.dashboardTagTid);
  const sectionTitle = props?.title ?? GemsXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? GemsXmlPropsDefaults.numberOfItems;

  let preFetchedXmlText: string | null = null;
  try {
    if (url) {
      const contextData =
        (typeof global !== 'undefined' ? (global as any).__XML_DATA_CONTEXT__ : undefined) ||
        (typeof window !== 'undefined' ? (window as any).__XML_DATA_CONTEXT__ : undefined);
      if (contextData && contextData[url]) {
        preFetchedXmlText = contextData[url];
      }
    }
  } catch {
    // fall through to client fetch
  }

  const preFetchedItems = preFetchedXmlText ? parseGemsXml(preFetchedXmlText, numberOfItems) : null;

  const [items, setItems] = useState<GemsItem[]>(preFetchedItems || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        setItems(parseGemsXml(text, numberOfItems));
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, numberOfItems, preFetchedItems]);

  const padding = style?.padding;
  const wrapperStyle: React.CSSProperties = {
    padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
    fontFamily: SANS,
  };

  if (loading) {
    return (
      <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading gems...</div>
    );
  }
  if (error) {
    return (
      <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>
        Error: {error}
      </div>
    );
  }
  if (items.length === 0) {
    if (showEmptyStateMessage) {
      return (
        <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No gems found.</div>
      );
    }
    return null;
  }

  return (
    <div style={wrapperStyle}>
      {sectionTitle ? (
        <h2
          style={{
            fontSize: '18px',
            margin: '0 0 16px 0',
            color: TEXT_PRIMARY,
            textTransform: 'uppercase',
            borderLeft: `4px solid ${BRAND_BLUE}`,
            paddingLeft: '10px',
            lineHeight: '1.2',
          }}
        >
          {sectionTitle}
        </h2>
      ) : null}
      {items.map((item, index) => (
        <GemQuoteCard key={index} quote={item.quote} attribution={item.attribution} />
      ))}
    </div>
  );
}
