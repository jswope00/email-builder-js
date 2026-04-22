import React, { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { buildTopicFilteredFeedUrl } from '@usewaypoint/rheumnow-xml-topic';

/** Fixed feed URL for this block (not editable in the inspector). */
export const ADVERTISEMENT_72890_XML_FEED_URL = 'https://rheumnow.com/admin/email_ad_728_90_xml';

export const Advertisement72890XmlPropsSchema = z.object({
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
    restrictToNoTopicAdvertisements: z.boolean().optional().nullable(),
  }).optional().nullable(),
});

export type Advertisement72890XmlProps = z.infer<typeof Advertisement72890XmlPropsSchema>;

export const Advertisement72890XmlPropsDefaults = {
  title: '',
  numberOfItems: 3,
} as const;

type AdvertisementItem = {
  image: string;
  altText: string;
  destinationUrl: string;
  trackingCode: string;
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

function getFieldTopicsValue(item: Record<string, unknown>): unknown {
  const raw = item.field_topics;
  if (raw && typeof raw === 'object' && '#text' in (raw as object)) {
    return (raw as { '#text'?: string })['#text'];
  }
  return raw;
}

function isFieldTopicsEmpty(item: Record<string, unknown>): boolean {
  const v = getFieldTopicsValue(item);
  if (v == null) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  return false;
}

type ParseAdvertisementXmlOptions = {
  restrictToNoTopicAdvertisements?: boolean;
};

// Extract XML parsing logic so it can be used both synchronously (SSR) and asynchronously (client)
function parseAdvertisementXml(
  xmlText: string,
  numberOfItems: number,
  options?: ParseAdvertisementXmlOptions
): AdvertisementItem[] {
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
        if (first && (first.field_ad_image || first.title)) {
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

    let itemNodes = foundItems;
    if (options?.restrictToNoTopicAdvertisements) {
      itemNodes = foundItems.filter((item: any) => isFieldTopicsEmpty(item as Record<string, unknown>));
    }

    const mappedItems: AdvertisementItem[] = itemNodes.map((item: any) => {
      // Extract alt text, stripping CDATA and HTML if present
      let altText = item.field_ad_image_1 || '';
      altText = decodeHtmlEntities(altText.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>?/gm, '').trim());
      
      // Extract destination URL, stripping CDATA
      let destinationUrl = item.field_destination_url || '';
      destinationUrl = decodeHtmlEntities(destinationUrl.replace(/<!\[CDATA\[|\]\]>/g, '').trim());
      
      // Extract tracking code as-is (may contain HTML)
      let trackingCode = item.field_tracking_code || '';
      trackingCode = trackingCode.replace(/<!\[CDATA\[|\]\]>/g, '').trim();

      return {
        image: item.field_ad_image || '',
        altText: altText,
        destinationUrl: destinationUrl,
        trackingCode: trackingCode,
      };
    });

    return mappedItems.slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse advertisement XML:', err);
    return [];
  }
}

export function Advertisement72890Xml({
  style,
  props,
  showEmptyStateMessage = false,
}: Advertisement72890XmlProps & { showEmptyStateMessage?: boolean }) {
  const url = buildTopicFilteredFeedUrl(ADVERTISEMENT_72890_XML_FEED_URL, props?.topicTid, props?.dashboardTagTid);
  const title = props?.title ?? Advertisement72890XmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? Advertisement72890XmlPropsDefaults.numberOfItems;
  const restrictToNoTopicAdvertisements = props?.restrictToNoTopicAdvertisements === true;
  const parseOptions = useMemo(
    () => ({ restrictToNoTopicAdvertisements }),
    [restrictToNoTopicAdvertisements]
  );

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

  const [rawXml, setRawXml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const xmlSource = preFetchedXmlText ?? rawXml;
  const items = useMemo(() => {
    if (!xmlSource) return [];
    return parseAdvertisementXml(xmlSource, numberOfItems, parseOptions);
  }, [xmlSource, numberOfItems, parseOptions]);

  useEffect(() => {
    if (preFetchedXmlText) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setRawXml(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const text = await response.text();
        setRawXml(text);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, preFetchedXmlText]);

  const padding = style?.padding;
  const wrapperStyle = {
    padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
    fontFamily: 'sans-serif',
  };

  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading advertisements...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) {
    return showEmptyStateMessage
      ? <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No advertisements found.</div>
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
        <div key={index} style={{ marginBottom: 6, textAlign: 'center' }}>
          {item.destinationUrl ? (
            <a href={item.destinationUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <img 
                src={item.image} 
                alt={item.altText} 
                style={{ 
                  maxWidth: '728px', 
                  width: '100%', 
                  height: 'auto', 
                  display: 'block',
                  margin: '0 auto'
                }} 
              />
            </a>
          ) : (
            <img 
              src={item.image} 
              alt={item.altText} 
              style={{ 
                maxWidth: '728px', 
                width: '100%', 
                height: 'auto', 
                display: 'block',
                margin: '0 auto'
              }} 
            />
          )}
          
          {item.trackingCode && (
            <div className="tracking-code" style={{ display: 'none', height: '1px', backgroundColor: '#000' }} dangerouslySetInnerHTML={{ __html: item.trackingCode }} />
          )}
          
          <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
            Advertisement
          </div>
        </div>
      ))}
    </div>
  );
}

