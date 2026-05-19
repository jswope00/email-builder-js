import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { buildTopicFilteredFeedUrl } from '@usewaypoint/rheumnow-xml-topic';

/** Fixed feed URL for this block (not editable in the inspector). */
export const RHEUMIQ_QUIZ_XML_FEED_URL = 'https://rheumnow.com/admin/rheumiq-quiz-xml';

export const RheumIqQuizXmlPropsSchema = z.object({
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
      showQuizTitle: z.boolean().optional().nullable(),
      showQuestions: z.boolean().optional().nullable(),
      showSponsoredText: z.boolean().optional().nullable(),
      showQuizLink: z.boolean().optional().nullable(),
      quizLinkText: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type RheumIqQuizXmlProps = z.infer<typeof RheumIqQuizXmlPropsSchema>;

export const RheumIqQuizXmlPropsDefaults = {
  title: '',
  numberOfItems: 1,
  showQuizTitle: true,
  showQuestions: true,
  showSponsoredText: true,
  showQuizLink: true,
  quizLinkText: 'Take the Quiz',
} as const;

type RheumIqQuizItem = {
  label: string;
  questions: string[];
  sponsoredText: string;
  quizLink: string;
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

function decodeBasicEntities(input: string): string {
  return input
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/gi, '\u00a0');
}

function stripTags(input: string): string {
  return decodeBasicEntities(input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function parseQuestionList(raw: unknown): string[] {
  const html = stripCdata(xmlTextContent(raw));
  if (!html) return [];

  const questions: string[] = [];
  const liRegex = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
  let match: RegExpExecArray | null;
  while ((match = liRegex.exec(html)) !== null) {
    const question = stripTags(match[1]);
    if (question) questions.push(question);
  }

  if (questions.length > 0) return questions;
  const fallback = stripTags(html);
  return fallback ? [fallback] : [];
}

function collectQuizItemNodes(parsed: unknown): any[] {
  let foundItems: any[] = [];

  const findItems = (obj: any) => {
    if (foundItems.length > 0) return;

    if (Array.isArray(obj)) {
      const first = obj[0];
      if (
        first &&
        (first.label != null ||
          first.questions_target_id != null ||
          first.field_sponsored_text != null ||
          first.quiz_link != null)
      ) {
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

export function parseRheumIqQuizXml(xmlText: string, numberOfItems: number): RheumIqQuizItem[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);
    const foundItems = collectQuizItemNodes(result);

    return foundItems
      .map((item: any) => ({
        label: decodeBasicEntities(xmlTextContent(item.label).trim()),
        questions: parseQuestionList(item.questions_target_id),
        sponsoredText: stripTags(stripCdata(xmlTextContent(item.field_sponsored_text))),
        quizLink: xmlTextContent(item.quiz_link).trim(),
      }))
      .slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse RheumIQ quiz XML:', err);
    return [];
  }
}

export function getFirstRheumIqQuizWildcardValuesFromXml(xmlText: string): {
  title: string;
  link: string;
} {
  const item = parseRheumIqQuizXml(xmlText, 1)[0];
  return {
    title: item?.label ?? '',
    link: item?.quizLink ?? '',
  };
}

export function buildRheumIqQuizFeedUrl(
  topicTid?: number | null,
  dashboardTagTid?: number | null
): string {
  return buildTopicFilteredFeedUrl(RHEUMIQ_QUIZ_XML_FEED_URL, topicTid, dashboardTagTid);
}

export function RheumIqQuizXml({
  style,
  props,
  showEmptyStateMessage = false,
}: RheumIqQuizXmlProps & { showEmptyStateMessage?: boolean }) {
  const url = buildRheumIqQuizFeedUrl(props?.topicTid, props?.dashboardTagTid);
  const sectionTitle = props?.title ?? RheumIqQuizXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? RheumIqQuizXmlPropsDefaults.numberOfItems;
  const showQuizTitle = props?.showQuizTitle ?? RheumIqQuizXmlPropsDefaults.showQuizTitle;
  const showQuestions = props?.showQuestions ?? RheumIqQuizXmlPropsDefaults.showQuestions;
  const showSponsoredText =
    props?.showSponsoredText ?? RheumIqQuizXmlPropsDefaults.showSponsoredText;
  const showQuizLink = props?.showQuizLink ?? RheumIqQuizXmlPropsDefaults.showQuizLink;
  const quizLinkText = props?.quizLinkText ?? RheumIqQuizXmlPropsDefaults.quizLinkText;

  let preFetchedXmlText: string | null = null;
  try {
    const contextData =
      (typeof global !== 'undefined' ? (global as any).__XML_DATA_CONTEXT__ : undefined) ||
      (typeof window !== 'undefined' ? (window as any).__XML_DATA_CONTEXT__ : undefined);
    if (contextData && contextData[url]) {
      preFetchedXmlText = contextData[url];
    }
  } catch {
    // fall through to client fetch
  }

  const preFetchedItems = preFetchedXmlText ? parseRheumIqQuizXml(preFetchedXmlText, numberOfItems) : null;

  const [items, setItems] = useState<RheumIqQuizItem[]>(preFetchedItems || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (preFetchedItems) return;

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
        setItems(parseRheumIqQuizXml(text, numberOfItems));
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
    fontFamily: 'Arial, sans-serif',
  };

  if (loading) {
    return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading quiz...</div>;
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
      return <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No quizzes found.</div>;
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
            color: '#333333',
            textTransform: 'uppercase',
            borderLeft: '4px solid #1585fe',
            paddingLeft: '10px',
            lineHeight: '1.2',
          }}
        >
          {sectionTitle}
        </h2>
      ) : null}
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            color: '#ffffff',
          }}
        >
          {showQuizTitle && item.label ? (
            <h3
              style={{
                margin: '0 0 14px 0',
                fontSize: '19px',
                lineHeight: '1.35',
                color: '#ffffff',
              }}
            >
              {item.label}
            </h3>
          ) : null}
          {showQuestions && item.questions.length > 0 ? (
            <ul style={{ margin: '0 0 16px 0', paddingLeft: 22 }}>
              {item.questions.map((question, questionIndex) => (
                <li
                  key={questionIndex}
                  style={{
                    marginBottom: questionIndex < item.questions.length - 1 ? 8 : 0,
                    fontSize: '15px',
                    lineHeight: '1.45',
                    color: '#ffffff',
                  }}
                >
                  {question}
                </li>
              ))}
            </ul>
          ) : null}
          {showSponsoredText && item.sponsoredText ? (
            <div
              style={{
                margin: '0 0 16px 0',
                fontSize: '13px',
                lineHeight: '1.4',
                color: '#dbeafe',
              }}
            >
              {item.sponsoredText}
            </div>
          ) : null}
          {showQuizLink && item.quizLink ? (
            <a
              href={item.quizLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                backgroundColor: '#1585fe',
                borderRadius: 25,
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                padding: '10px 30px',
                textDecoration: 'none',
              }}
            >
              {quizLinkText}
            </a>
          ) : null}
        </div>
      ))}
    </div>
  );
}
