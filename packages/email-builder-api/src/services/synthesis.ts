import { XMLParser } from 'fast-xml-parser';
import { z } from 'zod';
import { AppError } from '../utils/errors';
import { SYNTHESIS_SYSTEM_PROMPT } from './synthesisPrompt';

const FEED_URLS = {
  video: 'https://rheumnow.com/admin/videos-xml',
  article: 'https://rheumnow.com/admin/article-xml',
  tweet: 'https://rheumnow.com/admin/tweet-xml',
  podcast: 'https://rheumnow.com/admin/podcasts_xml',
} as const;

const PORTKEY_CHAT_URL = 'https://api.portkey.ai/v1/chat/completions';
const PORTKEY_MODEL = '@rheumnow-anthropic/claude-sonnet-5';
const PORTKEY_MAX_TOKENS = 50000;

const SynthesisDigestItemSchema = z.object({
  title: z.string(),
  url: z.string().optional().nullable(),
  contentType: z.enum(['article', 'video', 'podcast', 'tweet']).default('article'),
});

const SynthesisThemeSchema = z.object({
  heading: z.string(),
  hook: z.string().default(''),
  items: z.array(SynthesisDigestItemSchema).default([]),
  conclusions: z.string().default(''),
});

const SynthesisDigestSchema = z.object({
  themes: z.array(SynthesisThemeSchema).min(1),
});

export type SynthesisDigest = z.infer<typeof SynthesisDigestSchema>;

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type SynthesisItemType = 'video' | 'article' | 'tweet' | 'podcast';

export type SynthesisGenerateRequest = {
  topicTid?: number | null;
  dashboardTagTid?: number | null;
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
  includeVideos?: boolean | null;
  includeArticles?: boolean | null;
  includeTweets?: boolean | null;
  includePodcasts?: boolean | null;
  specialInstructions?: string | null;
};

export type SynthesisSourceItem = {
  title: string;
  contentType: SynthesisItemType;
  url: string;
  body: string;
  createdDateTime: string;
};

type DateFilterOptions = {
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
};

function buildTopicFilteredFeedUrl(
  baseFeedUrl: string,
  topicTid?: number | null,
  dashboardTagTid?: number | null
): string {
  const base = baseFeedUrl.replace(/\/+$/, '');
  const t =
    topicTid != null && Number.isFinite(topicTid) && topicTid > 0 ? Math.floor(topicTid) : null;
  const d =
    dashboardTagTid != null && Number.isFinite(dashboardTagTid) && dashboardTagTid > 0
      ? Math.floor(dashboardTagTid)
      : null;
  if (t == null && d == null) return baseFeedUrl;
  if (t != null && d != null) return `${base}/${t},${d}`;
  if (t != null) return `${base}/${t}`;
  return `${base}/${d!}`;
}

function parseCreatedField(created: unknown): string {
  if (!created) return '';
  const raw = typeof created === 'string' ? created : String(created);
  const datetimeMatch = raw.match(/datetime=["']([^"']+)["']/i);
  return datetimeMatch?.[1] ?? '';
}

function parseDateStart(value: string): number | null {
  const parsed = new Date(`${value}T00:00:00`).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateEnd(value: string): number | null {
  const parsed = new Date(`${value}T23:59:59.999`).getTime();
  return Number.isFinite(parsed) ? parsed : null;
}

function passesDateFilter(createdDateTime: string, opts: DateFilterOptions): boolean {
  const hasStart = typeof opts.createdStartDate === 'string' && opts.createdStartDate.trim() !== '';
  const hasEnd = typeof opts.createdEndDate === 'string' && opts.createdEndDate.trim() !== '';
  const hasRelative =
    typeof opts.createdRelativeDays === 'number' && Number.isFinite(opts.createdRelativeDays);

  if (!hasStart && !hasEnd && !hasRelative) return true;
  if (!createdDateTime) return false;

  const itemTs = new Date(createdDateTime).getTime();
  if (!Number.isFinite(itemTs)) return false;

  if (hasStart) {
    const startTs = parseDateStart(opts.createdStartDate!);
    if (startTs !== null && itemTs < startTs) return false;
  }
  if (hasEnd) {
    const endTs = parseDateEnd(opts.createdEndDate!);
    if (endTs !== null && itemTs > endTs) return false;
  }
  if (hasRelative) {
    const now = new Date();
    const relativeStartTs =
      new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      opts.createdRelativeDays! * DAY_IN_MS;
    if (itemTs < relativeStartTs) return false;
  }
  return true;
}

function stripHtml(raw: string): string {
  return raw
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]*>?/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeBasicEntities(input: string): string {
  return input
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&nbsp;/gi, ' ');
}

function findXmlItems(parsed: unknown): any[] {
  const found: any[] = [];

  const walk = (obj: any) => {
    if (found.length > 0) return;
    if (Array.isArray(obj)) {
      const first = obj[0];
      if (
        first &&
        (first.title || first.field_media_image || first.nid || first.type || first.view_node)
      ) {
        found.push(...obj);
        return;
      }
      for (const item of obj) walk(item);
    } else if (typeof obj === 'object' && obj !== null) {
      if (obj.item && Array.isArray(obj.item)) {
        found.push(...obj.item);
        return;
      }
      if (obj.item && typeof obj.item === 'object') {
        found.push(obj.item);
        return;
      }
      for (const key in obj) walk(obj[key]);
    }
  };

  walk(parsed);
  return found;
}

function resolveItemUrl(item: any): string {
  const viewNode = String(item.view_node ?? '').trim();
  if (viewNode) return viewNode;
  return String(item.field_podcast_audio ?? '').trim();
}

function parseFeedItems(
  xmlText: string,
  contentType: SynthesisItemType,
  dateFilters: DateFilterOptions
): SynthesisSourceItem[] {
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const result = parser.parse(xmlText);
    const rawItems = findXmlItems(result);

    return rawItems
      .map((item: any) => {
        const title = decodeBasicEntities(String(item.title ?? '').trim());
        const bodyRaw = item.body ?? item.field_tweet_text ?? '';
        const body = decodeBasicEntities(stripHtml(String(bodyRaw ?? '')));
        const createdDateTime = parseCreatedField(item.created_1 ?? item.created);
        return {
          title,
          contentType,
          url: resolveItemUrl(item),
          body,
          createdDateTime,
        };
      })
      .filter((item) => item.title && passesDateFilter(item.createdDateTime, dateFilters));
  } catch (err) {
    console.error(`Failed to parse ${contentType} XML:`, err);
    return [];
  }
}

async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new AppError(502, `Failed to fetch feed ${url}: HTTP ${res.status}`, 'FEED_FETCH_FAILED');
  }
  return res.text();
}

function formatItemsForPrompt(items: SynthesisSourceItem[]): string {
  return items
    .map((item, index) => {
      const lines = [
        `### Item ${index + 1}`,
        `Title: ${item.title}`,
        `Content type: ${item.contentType}`,
        `URL: ${item.url || '(none)'}`,
      ];
      if (item.createdDateTime) lines.push(`Created: ${item.createdDateTime}`);
      if (item.body) lines.push(`Body:\n${item.body}`);
      return lines.join('\n');
    })
    .join('\n\n');
}

function stripMarkdownFences(content: string): string {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json|html)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : trimmed;
}

function parseDigestJson(content: string): SynthesisDigest {
  const cleaned = stripMarkdownFences(content);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Model sometimes wraps JSON with leading prose — try first {...} block.
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new AppError(502, 'Portkey returned invalid JSON', 'PORTKEY_INVALID_JSON');
    }
    try {
      parsed = JSON.parse(match[0]);
    } catch {
      throw new AppError(502, 'Portkey returned invalid JSON', 'PORTKEY_INVALID_JSON');
    }
  }

  const result = SynthesisDigestSchema.safeParse(parsed);
  if (!result.success) {
    console.error('Portkey digest validation failed:', result.error.flatten());
    throw new AppError(502, 'Portkey returned an unexpected digest shape', 'PORTKEY_INVALID_DIGEST');
  }
  return result.data;
}

function buildSystemPrompt(specialInstructions?: string | null): string {
  const extra = typeof specialInstructions === 'string' ? specialInstructions.trim() : '';
  if (!extra) return SYNTHESIS_SYSTEM_PROMPT;
  return [
    SYNTHESIS_SYSTEM_PROMPT,
    '',
    '---',
    '',
    '## Important Special Instructions (from the editor)',
    '',
    'Treat the following as high-priority guidance for this run. Follow the core skill rules',
    '(JSON shape, tone, theme limits, icon/content-type mapping) unless these instructions',
    'explicitly ask otherwise:',
    '',
    extra,
  ].join('\n');
}

async function callPortkey(
  userContent: string,
  specialInstructions?: string | null
): Promise<SynthesisDigest> {
  const apiKey = process.env.PORTKEY_API_KEY;
  if (!apiKey) {
    throw new AppError(500, 'PORTKEY_API_KEY is not configured', 'PORTKEY_NOT_CONFIGURED');
  }

  const response = await fetch(PORTKEY_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-portkey-api-key': apiKey,
    },
    body: JSON.stringify({
      model: PORTKEY_MODEL,
      max_tokens: PORTKEY_MAX_TOKENS,
      messages: [
        { role: 'system', content: buildSystemPrompt(specialInstructions) },
        { role: 'user', content: userContent },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    console.error('Portkey API error:', response.status, errorText);
    throw new AppError(
      502,
      `Portkey API request failed (${response.status})`,
      'PORTKEY_REQUEST_FAILED'
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new AppError(502, 'Portkey returned an empty synthesis', 'PORTKEY_EMPTY_RESPONSE');
  }
  return parseDigestJson(content);
}

/**
 * Fetch selected RheumNow feeds, filter by date/topic, and synthesize via Portkey.
 */
export async function generateSynthesis(req: SynthesisGenerateRequest): Promise<{
  digest: SynthesisDigest;
  itemCount: number;
  itemsByType: Record<SynthesisItemType, number>;
}> {
  const includeVideos = req.includeVideos !== false;
  const includeArticles = req.includeArticles !== false;
  const includeTweets = req.includeTweets !== false;
  const includePodcasts = req.includePodcasts !== false;

  if (!includeVideos && !includeArticles && !includeTweets && !includePodcasts) {
    throw new AppError(400, 'Select at least one item type', 'NO_ITEM_TYPES');
  }

  const dateFilters: DateFilterOptions = {
    createdStartDate: req.createdStartDate,
    createdEndDate: req.createdEndDate,
    createdRelativeDays: req.createdRelativeDays,
  };

  const feeds: Array<{ type: SynthesisItemType; url: string }> = [];
  if (includeVideos) {
    feeds.push({
      type: 'video',
      url: buildTopicFilteredFeedUrl(FEED_URLS.video, req.topicTid, req.dashboardTagTid),
    });
  }
  if (includeArticles) {
    feeds.push({
      type: 'article',
      url: buildTopicFilteredFeedUrl(FEED_URLS.article, req.topicTid, req.dashboardTagTid),
    });
  }
  if (includeTweets) {
    feeds.push({
      type: 'tweet',
      url: buildTopicFilteredFeedUrl(FEED_URLS.tweet, req.topicTid, req.dashboardTagTid),
    });
  }
  if (includePodcasts) {
    feeds.push({
      type: 'podcast',
      url: buildTopicFilteredFeedUrl(FEED_URLS.podcast, req.topicTid, req.dashboardTagTid),
    });
  }

  const settled = await Promise.allSettled(feeds.map((f) => fetchXml(f.url)));
  const items: SynthesisSourceItem[] = [];
  const itemsByType: Record<SynthesisItemType, number> = {
    video: 0,
    article: 0,
    tweet: 0,
    podcast: 0,
  };

  settled.forEach((result, index) => {
    const feed = feeds[index];
    if (result.status !== 'fulfilled') {
      console.error(`Failed to fetch ${feed.type} feed:`, result.reason);
      return;
    }
    const parsed = parseFeedItems(result.value, feed.type, dateFilters);
    itemsByType[feed.type] = parsed.length;
    items.push(...parsed);
  });

  if (items.length === 0) {
    throw new AppError(
      400,
      'No items matched the selected filters. Adjust dates, topic, or item types.',
      'NO_ITEMS'
    );
  }

  const userContent = [
    'Synthesize the following rheumatology content into the JSON digest format specified in your instructions.',
    '',
    `Total items: ${items.length}`,
    `Breakdown: videos=${itemsByType.video}, articles=${itemsByType.article}, tweets=${itemsByType.tweet}, podcasts=${itemsByType.podcast}`,
    '',
    formatItemsForPrompt(items),
  ].join('\n');

  const digest = await callPortkey(userContent, req.specialInstructions);

  return { digest, itemCount: items.length, itemsByType };
}
