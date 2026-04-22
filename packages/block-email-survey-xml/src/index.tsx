import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { buildTopicFilteredFeedUrl } from '@usewaypoint/rheumnow-xml-topic';

/** Fixed feed URL for this block (not editable in the inspector). */
export const EMAIL_SURVEY_XML_FEED_URL = 'https://rheumnow.com/admin/promoted-survey-xml';

export const EmailSurveyXmlPropsSchema = z.object({
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

export type EmailSurveyXmlProps = z.infer<typeof EmailSurveyXmlPropsSchema>;

export const EmailSurveyXmlPropsDefaults = {
  title: '',
  numberOfItems: 3,
} as const;

/** Sponsored surveys use this for the XML item title (field_is_sponsored_purple). */
const SPONSORED_TITLE_COLOR = '#6B2D91';
const DEFAULT_TITLE_COLOR = '#333333';

const POLL_OPTION_BORDER = '#e2e8f0';
const POLL_TEXT = '#334155';

type EmailSurveyItem = {
  title: string;
  primaryQuestion: string;
  choices: string[];
  viewNode: string;
  isSponsoredPurple: boolean;
};

function parseXmlTruthyBool(raw: unknown): boolean {
  if (raw === true || raw === 1) return true;
  if (typeof raw === 'string') {
    const s = raw.trim().toLowerCase();
    return s === '1' || s === 'true' || s === 'on' || s === 'yes';
  }
  return false;
}

function xmlTextContent(raw: unknown): string {
  if (raw == null) return '';
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) {
    // Duplicate XML tags become an array; use the first non-empty segment (same semantics as a single node).
    for (const el of raw) {
      const s = xmlTextContent(el).trim();
      if (s) return s;
    }
    return '';
  }
  if (typeof raw === 'object' && raw !== null && '#text' in (raw as object)) {
    return String((raw as { '#text': unknown })['#text']);
  }
  return String(raw);
}

function stripCdata(s: string): string {
  return s.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
}

/** Minimal HTML entity decode for survey option text (e.g. &amp; → &). */
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

function parseChoiceList(raw: unknown): string[] {
  const s = stripCdata(xmlTextContent(raw));
  if (!s) return [];
  return s
    .split('||')
    .map((part) => decodeBasicEntities(part.trim()))
    .filter(Boolean);
}

/**
 * Extracts poll choice labels from Drupal poll markup embedded in XML (e.g. `<nothing>` CDATA).
 * Looks for spans whose `class` includes `chart-percent-title` (poll result rows).
 */
export function extractPollChoicesFromPollHtml(html: string): string[] {
  const trimmed = html.trim();
  if (!trimmed) return [];
  const out: string[] = [];
  const re =
    /<[^>\s]+[^>]*\sclass\s*=\s*["'][^"']*chart-percent-title[^"']*["'][^>]*>([^<]*)<\/[^>]+>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(trimmed)) !== null) {
    const label = decodeBasicEntities(m[1].trim());
    if (label) out.push(label);
  }
  return out;
}

function resolvePrimaryQuestion(item: Record<string, unknown>): string {
  const fromNew = String(item.field_primary_question_1 ?? '').trim();
  if (fromNew) return decodeBasicEntities(fromNew);
  return String(item.field_primary_question ?? '').trim();
}

/** Pipe-delimited `choice_target_id` wins when non-empty; otherwise parses embedded poll HTML (`nothing`, etc.). */
function resolveChoices(item: Record<string, unknown>): string[] {
  const fromPipe = parseChoiceList(item.choice_target_id);
  if (fromPipe.length > 0) return fromPipe;

  const htmlSources = [item.nothing, item.field_poll_embed, item.field_embedded_poll];
  for (const raw of htmlSources) {
    const html = xmlTextContent(raw);
    const fromPoll = extractPollChoicesFromPollHtml(html);
    if (fromPoll.length > 0) return fromPoll;
  }
  return [];
}

/** Walks parsed XML and returns `<item>` nodes (same discovery logic as `parseEmailSurveyXml`). */
function collectSurveyItemNodes(parsed: unknown): any[] {
  let foundItems: any[] = [];

  const findItems = (obj: any) => {
    if (foundItems.length > 0) return;

    if (Array.isArray(obj)) {
      const first = obj[0];
      if (
        first &&
        (first.title ||
          first.field_primary_question != null ||
          first.field_primary_question_1 != null ||
          first.choice_target_id != null ||
          first.nothing != null ||
          first.view_node)
      ) {
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

  findItems(parsed);
  return foundItems;
}

/**
 * Inspect raw XML for debugging (e.g. DevTools after `fetch(url).then(r => r.text())`).
 * `parsedChoices` is the final list (pipe-delimited field and/or embedded poll HTML).
 */
export function debugEmailSurveyXml(xmlText: string): {
  firstItemKeys: string[];
  choice_target_id_raw: unknown;
  choice_target_id_coerced: string;
  choicesFromPipe: string[];
  nothing_html_preview: string;
  choicesFromPollHtml: string[];
  parsedChoices: string[];
  primaryQuestion: string;
} {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);
    const nodes = collectSurveyItemNodes(result);
    const first = (nodes[0] ?? null) as Record<string, unknown> | null;
    const raw = first?.choice_target_id;
    const pipe = parseChoiceList(raw);
    const nothingHtml = first ? xmlTextContent(first.nothing) : '';
    const fromPoll = extractPollChoicesFromPollHtml(nothingHtml);
    const resolved = first ? resolveChoices(first) : [];
    return {
      firstItemKeys: first && typeof first === 'object' ? Object.keys(first) : [],
      choice_target_id_raw: raw,
      choice_target_id_coerced: xmlTextContent(raw),
      choicesFromPipe: pipe,
      nothing_html_preview: nothingHtml.slice(0, 400),
      choicesFromPollHtml: fromPoll,
      parsedChoices: resolved,
      primaryQuestion: first ? resolvePrimaryQuestion(first) : '',
    };
  } catch (e) {
    return {
      firstItemKeys: [],
      choice_target_id_raw: undefined,
      choice_target_id_coerced: '',
      choicesFromPipe: [],
      nothing_html_preview: '',
      choicesFromPollHtml: [],
      parsedChoices: [],
      primaryQuestion: '',
    };
  }
}

/**
 * Parse email survey XML into items (same fields used in editor and SSR).
 */
export function parseEmailSurveyXml(xmlText: string, numberOfItems: number): EmailSurveyItem[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);
    const foundItems = collectSurveyItemNodes(result);

    const mapped: EmailSurveyItem[] = foundItems.map((item: any) => {
      const rec = item as Record<string, unknown>;
      return {
        title: String(item.title ?? '').trim(),
        primaryQuestion: resolvePrimaryQuestion(rec),
        choices: resolveChoices(rec),
        viewNode: String(item.view_node ?? '').trim(),
        isSponsoredPurple: parseXmlTruthyBool(item.field_is_sponsored_purple),
      };
    });

    return mapped.slice(0, numberOfItems);
  } catch (err) {
    console.error('Failed to parse email survey XML:', err);
    return [];
  }
}

export function buildEmailSurveyFeedUrl(
  topicTid?: number | null,
  dashboardTagTid?: number | null
): string {
  return buildTopicFilteredFeedUrl(EMAIL_SURVEY_XML_FEED_URL, topicTid, dashboardTagTid);
}

export function EmailSurveyXml({
  style,
  props,
  showEmptyStateMessage = false,
}: EmailSurveyXmlProps & { showEmptyStateMessage?: boolean }) {
  const url = buildEmailSurveyFeedUrl(props?.topicTid, props?.dashboardTagTid);
  const sectionTitle = props?.title ?? EmailSurveyXmlPropsDefaults.title;
  const numberOfItems = props?.numberOfItems ?? EmailSurveyXmlPropsDefaults.numberOfItems;

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

  const preFetchedItems = preFetchedXmlText ? parseEmailSurveyXml(preFetchedXmlText, numberOfItems) : null;

  const [items, setItems] = useState<EmailSurveyItem[]>(preFetchedItems || []);
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
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Status: ${response.status}`);
        }
        const text = await response.text();
        setItems(parseEmailSurveyXml(text, numberOfItems));
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

  if (loading) {
    return (
      <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>Loading surveys...</div>
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
        <div style={{ ...wrapperStyle, textAlign: 'center', padding: '20px' }}>No surveys found.</div>
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
            marginBottom: '12px',
            color: '#333',
            textTransform: 'uppercase',
            borderLeft: '4px solid #1585fe',
            paddingLeft: '10px',
            lineHeight: '1.2',
            margin: '0 0 16px 0',
          }}
        >
          {sectionTitle}
        </h2>
      ) : null}
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none',
          }}
        >
          {item.title ? (
            <h3
              style={{
                margin: '0 0 12px 0',
                fontSize: '18px',
                lineHeight: '1.4',
                color: item.isSponsoredPurple ? SPONSORED_TITLE_COLOR : DEFAULT_TITLE_COLOR,
              }}
            >
              {item.title}
            </h3>
          ) : null}
          {item.primaryQuestion ? (
            <p style={{ margin: '0 0 12px 0', fontSize: '16px', lineHeight: '1.5', color: '#444' }}>
              {item.primaryQuestion}
            </p>
          ) : null}
          {item.choices.length > 0
            ? item.choices.map((choice, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    marginBottom: i < item.choices.length - 1 ? '10px' : '16px',
                    backgroundColor: '#ffffff',
                    border: `1px solid ${POLL_OPTION_BORDER}`,
                    borderRadius: '10px',
                    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      width: '22px',
                      height: '22px',
                      minWidth: '22px',
                      borderRadius: '50%',
                      border: '2px solid #94a3b8',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: '15px',
                      lineHeight: '1.45',
                      color: POLL_TEXT,
                      fontWeight: 500,
                    }}
                  >
                    {choice}
                  </span>
                </div>
              ))
            : null}
          {item.viewNode ? (
            <div style={{ marginTop: 8 }}>
              <a
                href={item.viewNode}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#1585fe',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '10px 20px',
                  borderRadius: 4,
                }}
              >
                Vote
              </a>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
