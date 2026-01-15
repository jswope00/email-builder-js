import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

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
    url: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    numberOfItems: z.number().min(1).max(10).optional().nullable(),
  }).optional().nullable(),
});

export type Advertisement72890XmlProps = z.infer<typeof Advertisement72890XmlPropsSchema>;

export const Advertisement72890XmlPropsDefaults = {
  url: '',
  title: '',
  numberOfItems: 3,
} as const;

type AdvertisementItem = {
  image: string;
  altText: string;
  destinationUrl: string;
  trackingCode: string;
};

export function Advertisement72890Xml({ style, props }: Advertisement72890XmlProps) {
  const url = props?.url ?? Advertisement72890XmlPropsDefaults.url;
  const title = props?.title ?? Advertisement72890XmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? Advertisement72890XmlPropsDefaults.numberOfItems;

  const [items, setItems] = useState<AdvertisementItem[]>([]);
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

        const mappedItems: AdvertisementItem[] = foundItems.map((item: any) => {
            // Extract alt text, stripping CDATA and HTML if present
            let altText = item.field_ad_image_1 || '';
            altText = altText.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>?/gm, '').trim();
            
            // Extract destination URL, stripping CDATA
            let destinationUrl = item.field_destination_url || '';
            destinationUrl = destinationUrl.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
            
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
     return <div style={{ ...wrapperStyle, border: '1px dashed #ccc', textAlign: 'center', padding: '20px' }}>Configure Advertisement 728x90 XML URL</div>;
  }
  
  if (loading) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading advertisements...</div>;
  if (error) return <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>Error: {error}</div>;
  if (items.length === 0) return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No advertisements found.</div>;

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

