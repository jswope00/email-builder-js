import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

export const FeaturedStoryXmlPropsSchema = z.object({
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

export type FeaturedStoryXmlProps = z.infer<typeof FeaturedStoryXmlPropsSchema>;

export const FeaturedStoryXmlPropsDefaults = {
  url: '',
  title: '',
  numberOfItems: 3,
} as const;

type FeaturedStoryItem = {
  title: string;
  createdDate: string;
  authorAttribution: string;
  image: string;
  body: string;
  type: string;
  showAuthor: boolean;
  viewNode: string;
};

// Play icon component (reused from block-video-xml)
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

export function FeaturedStoryXml({ style, props }: FeaturedStoryXmlProps) {
  const url = props?.url ?? FeaturedStoryXmlPropsDefaults.url;
  const title = props?.title ?? FeaturedStoryXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? FeaturedStoryXmlPropsDefaults.numberOfItems;

  const [items, setItems] = useState<FeaturedStoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix : "@_"
        });
        const result = parser.parse(text);
        
        let foundItems: any[] = [];
        
        const findItems = (obj: any) => {
             if (foundItems.length > 0) return;
             
             if (Array.isArray(obj)) {
                 const first = obj[0];
                 if (first && (first.title || first.field_media_image || first.nid)) {
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
            // Extract created date: <created><![CDATA[ <time ...>Dec 17, 2025</time> ]]></created>
            let createdDate = '';
            if (item.created) {
                const match = item.created.match(/>([^<]+)<\/time>/);
                if (match && match[1]) {
                    createdDate = match[1];
                } else {
                    createdDate = item.created; // Fallback
                }
            }
            
            // Extract author attribution
            let authorAttribution = '';
            if (item.field_author_attribution) {
                const text = item.field_author_attribution.replace(/<[^>]*>?/gm, '');
                authorAttribution = text.trim();
            }

            return {
                title: item.title || '',
                createdDate: createdDate,
                authorAttribution: authorAttribution,
                image: item.field_media_image || '',
                body: item.body || '',
                type: item.type || '',
                showAuthor: item.field_show_author == 1 || item.field_show_author === '1',
                viewNode: item.view_node || '',
            };
        });

        setItems(mappedItems.slice(0, numberOfItems));
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, numberOfItems]);

  const padding = style?.padding;
  const wrapperStyle = {
    padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
    fontFamily: 'sans-serif',
  };

  if (!url) {
     return <div style={{ ...wrapperStyle, border: '1px dashed #ccc', textAlign: 'center', padding: '20px' }}>Configure Featured Story XML URL</div>;
  }
  
  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading stories...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No stories found.</div>;

  const isVideoType = (type: string) => {
    return type && type.toLowerCase() === 'video';
  };

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
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' }}>{item.title}</h3>
                </a>
            ) : (
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4' }}>{item.title}</h3>
            )}
            
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                {item.showAuthor && item.authorAttribution && (
                    <span style={{ fontWeight: 'bold' }}>{item.authorAttribution}</span>
                )}
                {item.showAuthor && item.authorAttribution && item.createdDate && (
                    <span style={{ margin: '0 8px' }}>•</span>
                )}
                {item.createdDate && (
                    <span>{item.createdDate}</span>
                )}
            </div>

            {item.viewNode ? (
                <a href={item.viewNode} target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    {item.image && (
                        <div style={{ position: 'relative', marginBottom: 12 }}>
                            <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                            {isVideoType(item.type) && <PlayIcon />}
                        </div>
                    )}
                </a>
            ) : (
                <>
                    {item.image && (
                        <div style={{ position: 'relative', marginBottom: 12 }}>
                            <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 }} />
                            {isVideoType(item.type) && <PlayIcon />}
                        </div>
                    )}
                </>
            )}

            {item.body && (
                <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#666' }}>
                    {item.body.replace(/<!\[CDATA\[|\]\]>/g, '')}
                </div>
            )}
        </div>
      ))}
    </div>
  );
}

