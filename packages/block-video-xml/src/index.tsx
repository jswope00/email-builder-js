import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

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
    url: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    numberOfItems: z.number().min(1).max(10).optional().nullable(),
  }).optional().nullable(),
});

export type VideoXmlProps = z.infer<typeof VideoXmlPropsSchema>;

export const VideoXmlPropsDefaults = {
  url: '',
  title: '',
  numberOfItems: 3,
} as const;

type VideoItem = {
  title: string;
  image: string;
  caption: string;
  link: string;
};

// Play icon component
const PlayIcon = () => (
  <div
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '48px',
      height: '48px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    }}
  >
    <div
      style={{
        width: 0,
        height: 0,
        borderTop: '10px solid transparent',
        borderBottom: '10px solid transparent',
        borderLeft: '16px solid white',
        marginLeft: '4px',
      }}
    />
  </div>
);

// Extract XML parsing logic so it can be used both synchronously (SSR) and asynchronously (client)
function parseVideoXml(xmlText: string, numberOfItems: number): VideoItem[] {
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
      return {
        title: item.title || '',
        image: item.field_media_image || '',
        caption: item.field_captions || '',
        link: item.field_media_video_embed_field || '',
      };
    });

    return mappedItems.slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse video XML:', err);
    return [];
  }
}

export function VideoXml({ style, props }: VideoXmlProps) {
  const url = props?.url ?? VideoXmlPropsDefaults.url;
  const title = props?.title ?? VideoXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? VideoXmlPropsDefaults.numberOfItems;

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
  const preFetchedItems = preFetchedXmlText ? parseVideoXml(preFetchedXmlText, numberOfItems) : null;

  const [items, setItems] = useState<VideoItem[]>(preFetchedItems || []);
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
        
        const parsedItems = parseVideoXml(text, numberOfItems);
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
     return <div style={{ ...wrapperStyle, border: '1px dashed #ccc', textAlign: 'center', padding: '20px' }}>Configure Video XML URL</div>;
  }
  
  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading videos...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No videos found.</div>;

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
                        <div style={{ position: 'relative', marginBottom: 12 }}>
                            <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                            <PlayIcon />
                        </div>
                    )}
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' }}>{item.title}</h3>
                </a>
            ) : (
                <>
                    {item.image && (
                        <div style={{ position: 'relative', marginBottom: 12 }}>
                            <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                            <PlayIcon />
                        </div>
                    )}
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' }}>{item.title}</h3>
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

