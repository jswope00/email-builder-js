import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

export const TherapeuticUpdateXmlPropsSchema = z.object({
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

export type TherapeuticUpdateXmlProps = z.infer<typeof TherapeuticUpdateXmlPropsSchema>;

export const TherapeuticUpdateXmlPropsDefaults = {
  url: '',
  title: '',
  numberOfItems: 3,
} as const;

type UpdateItem = {
  title: string;
  createdDate: string;
  authorAttribution: string;
  image: string;
  body: string;
  isSponsored: boolean;
  showAuthor: boolean;
};

export function TherapeuticUpdateXml({ style, props }: TherapeuticUpdateXmlProps) {
  const url = props?.url ?? TherapeuticUpdateXmlPropsDefaults.url;
  const title = props?.title ?? TherapeuticUpdateXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? TherapeuticUpdateXmlPropsDefaults.numberOfItems;

  const [items, setItems] = useState<UpdateItem[]>([]);
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
            // We need to parse this string to get the text inside <time>...</time> or just use a regex
            let createdDate = '';
            if (item.created) {
                const match = item.created.match(/>([^<]+)<\/time>/);
                if (match && match[1]) {
                    createdDate = match[1];
                } else {
                    createdDate = item.created; // Fallback
                }
            }
            
            // Extract author attribution: <field_author_attribution><![CDATA[ <span ...>Sponsored by ...</span> ]]></field_author_attribution>
            let authorAttribution = '';
            if (item.field_author_attribution) {
                // remove HTML tags if present, or keep them if we render html
                // For simplicity, let's strip HTML tags for now or keep text
                const text = item.field_author_attribution.replace(/<[^>]*>?/gm, '');
                authorAttribution = text.trim();
            }

            return {
                title: item.title || '',
                createdDate: createdDate,
                authorAttribution: authorAttribution,
                image: item.field_media_image || '',
                body: item.body || '',
                isSponsored: item.field_rxu_is_sponsored === 'On',
                showAuthor: item.field_show_author == 1 || item.field_show_author === '1',
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
     return <div style={{ ...wrapperStyle, border: '1px dashed #ccc', textAlign: 'center', padding: '20px' }}>Configure Therapeutic Update XML URL</div>;
  }
  
  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading updates...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No updates found.</div>;

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
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4' }}>{item.title}</h3>
            
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                {item.showAuthor && item.authorAttribution && (
                    <div>
                        <span style={{ color: item.isSponsored ? '#800080' : 'inherit', fontWeight: item.isSponsored ? 'bold' : 'normal' }}>
                            {item.authorAttribution}
                        </span>
                    </div>
                )}
                <div>
                    <span>{item.createdDate}</span>
                </div>
            </div>

            {item.image && (
                <img src={item.image} alt={item.title} style={{ width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 }} />
            )}

            {item.body && (
                <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#666' }}>
                    {/* Render body, stripping CDATA wrapper if raw text or handle HTML safely if needed */}
                    {item.body.replace(/<!\[CDATA\[|\]\]>/g, '')}
                </div>
            )}
        </div>
      ))}
    </div>
  );
}

