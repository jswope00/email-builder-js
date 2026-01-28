import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

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
    url: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    numberOfItems: z.number().min(1).max(10).optional().nullable(),
  }).optional().nullable(),
});

export type DailyDownloadXmlProps = z.infer<typeof DailyDownloadXmlPropsSchema>;

export const DailyDownloadXmlPropsDefaults = {
  url: '',
  title: '',
  numberOfItems: 3,
} as const;

type DownloadItem = {
  title: string;
  image: string;
  viewNode: string;
};

// Extract XML parsing logic so it can be used both synchronously (SSR) and asynchronously (client)
function parseDailyDownloadXml(xmlText: string, numberOfItems: number): DownloadItem[] {
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
      return {
        title: item.title || '',
        image: item.thumbnail__target_id || '',
        viewNode: item.view_node || '',
      };
    });

    return mappedItems.slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse daily download XML:', err);
    return [];
  }
}

export function DailyDownloadXml({ style, props }: DailyDownloadXmlProps) {
  const url = props?.url ?? DailyDownloadXmlPropsDefaults.url;
  const title = props?.title ?? DailyDownloadXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? DailyDownloadXmlPropsDefaults.numberOfItems;

  // Try to get pre-fetched XML data from context (for SSR)
  // The renderToStaticMarkup function fetches XML data server-side and makes it available globally
  let preFetchedXmlText: string | null = null;
  try {
    if (url && typeof window === 'undefined') {
      // In SSR, check if context data is available via the global
      const contextData = (global as any).__XML_DATA_CONTEXT__;
      if (contextData && contextData[url]) {
        preFetchedXmlText = contextData[url];
      }
    }
  } catch {
    // Context not available, will use useEffect fallback
  }
  
  // Parse pre-fetched data synchronously if available
  const preFetchedItems = preFetchedXmlText ? parseDailyDownloadXml(preFetchedXmlText, numberOfItems) : null;

  const [items, setItems] = useState<DownloadItem[]>(preFetchedItems || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip fetching if we already have pre-fetched data
    if (preFetchedItems) {
      return;
    }
    if (!url) {
      setItems([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const text = await response.text();
        
        const parsedItems = parseDailyDownloadXml(text, numberOfItems);
        setItems(parsedItems);
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
  const wrapperStyle = {
    padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
    fontFamily: 'sans-serif',
  };

  if (!url) {
     return <div style={{ ...wrapperStyle, border: '1px dashed #ccc', textAlign: 'center', padding: '20px' }}>Configure Daily Download XML URL</div>;
  }
  
  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading downloads...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No downloads found.</div>;

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
                <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 }} />
              )}
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' }}>{item.title}</h3>
            </a>
          ) : (
            <>
              {item.image && (
                <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 }} />
              )}
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', lineHeight: '1.4' }}>{item.title}</h3>
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
