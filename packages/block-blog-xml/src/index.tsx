import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

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
    url: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    numberOfItems: z.number().min(1).max(10).optional().nullable(),
  }).optional().nullable(),
});

export type BlogXmlProps = z.infer<typeof BlogXmlPropsSchema>;

export const BlogXmlPropsDefaults = {
  url: '',
  title: '',
  numberOfItems: 3,
} as const;

type BlogItem = {
  title: string;
  author: string;
  createdDate: string;
  image: string;
  body: string;
  viewNode: string;
  showAuthor: boolean;
  articleType: string;
};

// Helper function to extract date from created field
const extractDate = (created: string): string => {
  if (!created) return '';
  const match = created.match(/>([^<]+)<\/time>/);
  if (match && match[1]) {
    return match[1];
  }
  return created;
};

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
function parseBlogXml(xmlText: string, numberOfItems: number): BlogItem[] {
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
        if (first && (first.title || first.thumbnail__target_id || first.nid || first.view_node)) {
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
      const createdDate = extractDate(item.created || '');
      const image = item.field_media_image || item.thumbnail__target_id || '';
      const showAuthor = item.field_show_author == 1 || item.field_show_author === '1';

      return {
        title: item.title || '',
        author: item.field_author_attribution || '',
        createdDate: createdDate,
        image: image,
        body: item.body || '',
        viewNode: item.view_node || '',
        showAuthor: showAuthor,
        articleType: item.field_article_type || '',
      };
    });

    return mappedItems.slice(0, numberOfItems);
  } catch (err) {
    console.error('Error parsing blog XML:', err);
    return [];
  }
}

export function BlogXml({ style, props }: BlogXmlProps) {
  const url = props?.url ?? BlogXmlPropsDefaults.url;
  const title = props?.title ?? BlogXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? BlogXmlPropsDefaults.numberOfItems;

  // Try to get pre-fetched XML data from context (for SSR)
  // The context should be provided by email-builder's XmlDataProvider
  // We'll use a workaround to access it without importing the package
  let preFetchedXmlText: string | null = null;
  try {
    // Try to access the context via React's context system
    // Since we can't import the context directly, we'll use a symbol-based lookup
    if (url && typeof window === 'undefined') {
      // In SSR, check if context data is available via a global
      // The renderToStaticMarkup function will set this up
      const contextData = (global as any).__XML_DATA_CONTEXT__;
      if (contextData && contextData[url]) {
        preFetchedXmlText = contextData[url];
      }
    }
  } catch {
    // Context not available, will use useEffect fallback
  }
  
  // Parse pre-fetched data synchronously if available
  const preFetchedItems = preFetchedXmlText ? parseBlogXml(preFetchedXmlText, numberOfItems) : null;

  const [items, setItems] = useState<BlogItem[]>(preFetchedItems || []);
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
        
        const parsedItems = parseBlogXml(text, numberOfItems);
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
     return <div style={{ ...wrapperStyle, border: '1px dashed #ccc', textAlign: 'center', padding: '20px' }}>Configure Blog XML URL</div>;
  }
  
  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading blog posts...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No blog posts found.</div>;

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
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' }}>{item.title}</h3>
              </a>
            ) : (
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4' }}>{item.title}</h3>
            )}
            
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
              {item.showAuthor && item.author && (
                <span style={{ fontWeight: 'bold' }}>{item.author}</span>
              )}
              {item.showAuthor && item.author && item.createdDate && (
                <span style={{ margin: '0 8px' }}>•</span>
              )}
              {item.createdDate && (
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
                  <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 }} />
                )}
              </a>
            ) : (
              <>
                {item.image && (
                  <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 }} />
                )}
              </>
            )}

            {item.body && (
              <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#666' }}>
                {item.body.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>?/gm, '')}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

