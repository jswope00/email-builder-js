/**
 * Self-contained subject-line wildcard expansion for the API server.
 *
 * Mirrors the logic in @usewaypoint/block-heading (wildcards.ts) and
 * @usewaypoint/block-featured-story-xml so that no workspace-only packages
 * are needed at EC2 runtime — only real npm packages (fast-xml-parser).
 */
import { XMLParser } from 'fast-xml-parser';

// ─── Constants (mirrors block-heading/src/wildcards.ts) ───────────────────────

export const HEADING_DATE_WILDCARD = '%DATE%';
export const HEADING_FEATURED_STORY_TITLE_WILDCARD = '%FEATURED_STORY_TITLE%';

const FEATURED_STORY_XML_FEED_URL = 'https://rheumnow.com/admin/featured-story-xml';

// ─── Date formatting ──────────────────────────────────────────────────────────

function formatHeadingWildcardDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// ─── Wildcard expansion ───────────────────────────────────────────────────────

export type ExpandHeadingWildcardsOptions = {
  featuredStoryFirstTitle?: string | null;
};

export function expandHeadingWildcards(
  text: string,
  date: Date = new Date(),
  options?: ExpandHeadingWildcardsOptions
): string {
  let out = text;
  if (out.includes(HEADING_DATE_WILDCARD)) {
    out = out.split(HEADING_DATE_WILDCARD).join(formatHeadingWildcardDate(date));
  }
  if (out.includes(HEADING_FEATURED_STORY_TITLE_WILDCARD)) {
    const title = options?.featuredStoryFirstTitle ?? '';
    out = out.split(HEADING_FEATURED_STORY_TITLE_WILDCARD).join(title);
  }
  return out;
}

// ─── Featured story feed URL builder (mirrors rheumnow-xml-topic) ─────────────

export function buildFeaturedStoryFeedUrl(
  topicTid?: number | null,
  dashboardTagTid?: number | null
): string {
  const base = FEATURED_STORY_XML_FEED_URL.replace(/\/+$/, '');
  const t =
    topicTid != null && Number.isFinite(topicTid) && topicTid > 0 ? Math.floor(topicTid) : null;
  const d =
    dashboardTagTid != null && Number.isFinite(dashboardTagTid) && dashboardTagTid > 0
      ? Math.floor(dashboardTagTid)
      : null;
  if (t == null && d == null) return FEATURED_STORY_XML_FEED_URL;
  if (t != null && d != null) return `${base}/${t},${d}`;
  if (t != null) return `${base}/${t}`;
  return `${base}/${d!}`;
}

// ─── Featured story XML title extractor (mirrors block-featured-story-xml) ────

export function getFirstFeaturedStoryTitleFromXml(xmlText: string): string {
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const result = parser.parse(xmlText);

    let foundItems: any[] = [];

    const findItems = (obj: any) => {
      if (foundItems.length > 0) return;
      if (Array.isArray(obj)) {
        const first = obj[0];
        if (first && (first.title || first.field_media_image || first.nid)) {
          foundItems = obj;
          return;
        }
        for (const item of obj) findItems(item);
      } else if (typeof obj === 'object' && obj !== null) {
        if (obj.item && Array.isArray(obj.item)) { foundItems = obj.item; return; }
        if (obj.item && typeof obj.item === 'object') { foundItems = [obj.item]; return; }
        for (const key in obj) findItems(obj[key]);
      }
    };

    findItems(result);
    return (foundItems[0]?.title ?? '').toString().trim();
  } catch {
    return '';
  }
}
