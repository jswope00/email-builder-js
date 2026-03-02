import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';

export const PromotedSurveyXmlPropsSchema = z.object({
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
      url: z.string().optional().nullable(),
      numberOfItems: z.number().min(1).max(20).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type PromotedSurveyXmlProps = z.infer<typeof PromotedSurveyXmlPropsSchema>;

export const PromotedSurveyXmlPropsDefaults = {
  url: '',
  numberOfItems: 3,
} as const;

type SurveyItem = {
  title: string;
  link: string;
  description: string;
};

function parseSurveyXml(xmlText: string, numberOfItems: number): SurveyItem[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);

    let foundItems: Record<string, unknown>[] = [];

    const findItems = (obj: unknown): void => {
      if (foundItems.length > 0) return;

      if (Array.isArray(obj)) {
        const first = obj[0];
        if (first && typeof first === 'object' && (first.title || first.link || first.description)) {
          foundItems = obj as Record<string, unknown>[];
          return;
        }
        for (const item of obj) {
          findItems(item);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        const o = obj as Record<string, unknown>;
        if (o.item && Array.isArray(o.item)) {
          foundItems = o.item as Record<string, unknown>[];
          return;
        }
        if (o.item && typeof o.item === 'object') {
          foundItems = [o.item as Record<string, unknown>];
          return;
        }
        for (const key in o) {
          findItems(o[key]);
        }
      }
    };

    findItems(result);

    const mappedItems = foundItems.map((item: Record<string, unknown>) => ({
      title: String(item.title ?? item.name ?? ''),
      link: String(item.link ?? item.url ?? ''),
      description: String(item.description ?? item.body ?? ''),
    }));

    return mappedItems.slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse survey XML:', err);
    return [];
  }
}

export function PromotedSurveyXml({ style, props: propsData }: PromotedSurveyXmlProps) {
  const url = propsData?.url ?? PromotedSurveyXmlPropsDefaults.url;
  const numberOfItems = propsData?.numberOfItems ?? PromotedSurveyXmlPropsDefaults.numberOfItems;

  let preFetchedXmlText: string | null = null;
  try {
    if (url) {
      const contextData =
        (typeof global !== 'undefined' ? (global as unknown as { __XML_DATA_CONTEXT__?: Record<string, string> }).__XML_DATA_CONTEXT__ : undefined) ||
        (typeof window !== 'undefined' ? (window as unknown as { __XML_DATA_CONTEXT__?: Record<string, string> }).__XML_DATA_CONTEXT__ : undefined);
      if (contextData && contextData[url]) {
        preFetchedXmlText = contextData[url];
      }
    }
  } catch {
    // Context not available
  }

  const preFetchedItems = preFetchedXmlText ? parseSurveyXml(preFetchedXmlText, numberOfItems) : null;

  const [items, setItems] = useState<SurveyItem[]>(preFetchedItems ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preFetchedItems) return;
    if (!url) {
      setItems([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const text = await response.text();
        setItems(parseSurveyXml(text, numberOfItems));
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
    fontFamily: 'sans-serif',
  };

  if (!url) {
    return (
      <div style={{ ...wrapperStyle, border: '1px dashed #ccc', textAlign: 'center', padding: '20px' }}>
        Configure Promoted Survey XML URL
      </div>
    );
  }

  if (loading)
    return (
      <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>
        Loading survey...
      </div>
    );
  if (error)
    return (
      <div style={{ ...wrapperStyle, color: 'red', textAlign: 'center', padding: '20px' }}>
        Error: {error}
      </div>
    );
  if (items.length === 0)
    return (
      <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>
        No survey items found.
      </div>
    );

  return (
    <div style={wrapperStyle}>
      <h2
        style={{
          fontSize: '18px',
          margin: '0 0 16px 0',
          color: '#333',
          textTransform: 'uppercase',
          borderLeft: '4px solid #1585fe',
          paddingLeft: '10px',
          lineHeight: '1.2',
        }}
      >
        Promoted Survey
      </h2>
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: 16,
            borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none',
            paddingBottom: 16,
          }}
        >
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', lineHeight: '1.4', color: '#1585fe' }}>
                {item.title}
              </h3>
            </a>
          ) : (
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', lineHeight: '1.4', color: '#333' }}>
              {item.title}
            </h3>
          )}
          {item.description && (
            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#666' }}>{item.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
