import { XMLParser } from 'fast-xml-parser';

/** RheumNow taxonomy/terms XML (same source as documented in xml-topic-schma.md). */
export const RHEUMNOW_TERMS_URL = 'https://rheumnow.com/admin/terms';

/** `vid` value for clinical topic rows when the endpoint includes vocabulary names (see xml-topic-schma.md). */
export const RHEUMNOW_TOPIC_VID = 'Topic';

/** `vid` value for dashboard tag rows (see xml-topic-schma.md). */
export const RHEUMNOW_DASHBOARD_TAGS_VID = 'Dashboard tags';

export type RheumnowTermRow = {
  tid: number;
  name: string;
  /** Vocabulary label from XML, e.g. `Topic` or `Dashboard tags`. */
  vid: string;
  /** Drupal `field_topic_type` when present (e.g. Primary / Secondary); not used for filtering. */
  fieldTopicType: string;
  /** Raw `field_is_active` text from XML. */
  fieldIsActive: string;
};

/** True when `field_is_active` is exactly `1` (used for Dashboard tags). */
export function isTermFieldActiveOne(row: RheumnowTermRow): boolean {
  return row.fieldIsActive === '1';
}

/**
 * Topic vocabulary: Drupal often leaves `field_is_active` empty for active terms.
 * Include when `vid` is Topic and the flag is not explicitly off (`0`, `Off`).
 */
export function isTopicTermActiveForDropdown(r: RheumnowTermRow): boolean {
  if (r.vid.trim().toLowerCase() !== RHEUMNOW_TOPIC_VID.toLowerCase()) {
    return false;
  }
  const a = r.fieldIsActive.trim().toLowerCase();
  if (a === '0' || a === 'off') return false;
  return true;
}

/**
 * Parse `/admin/terms` XML into flat rows.
 */
export function parseTermsXml(xmlText: string): RheumnowTermRow[] {
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const result = parser.parse(xmlText);
    const response = result?.response;
    if (!response) return [];

    const raw = response.item;
    const items: unknown[] = Array.isArray(raw) ? raw : raw != null ? [raw] : [];

    const rows: RheumnowTermRow[] = [];
    for (const item of items) {
      if (typeof item !== 'object' || item === null) continue;
      const o = item as Record<string, unknown>;
      const tid = Number(o.tid);
      if (!Number.isFinite(tid) || tid <= 0) continue;
      const rawActive = o.field_is_active;
      const fieldIsActive =
        rawActive === undefined || rawActive === null ? '' : String(rawActive).trim();
      rows.push({
        tid,
        name: String(o.name ?? ''),
        vid: String(o.vid ?? '').trim(),
        fieldTopicType: String(o.field_topic_type ?? '').trim(),
        fieldIsActive,
      });
    }
    return rows;
  } catch {
    return [];
  }
}

/**
 * Topic terms: `vid === 'Topic'` (case-insensitive), and not explicitly inactive
 * (`field_is_active` empty or `1` counts as show; `0` / `Off` excluded).
 */
export function filterTopicTerms(rows: RheumnowTermRow[]): RheumnowTermRow[] {
  return rows.filter(isTopicTermActiveForDropdown);
}

/**
 * Dashboard tags: `vid === 'Dashboard tags'` (case-insensitive) and `field_is_active === 1`.
 */
export function filterDashboardTagTerms(rows: RheumnowTermRow[]): RheumnowTermRow[] {
  const want = RHEUMNOW_DASHBOARD_TAGS_VID.toLowerCase();
  return rows.filter(
    (r) =>
      isTermFieldActiveOne(r) && r.vid.trim().toLowerCase() === want
  );
}

/**
 * Build the path suffix for RheumNow XML feeds from optional topic and dashboard-tag term ids.
 * - Neither: unchanged base URL
 * - Topic only: `{base}/{topicTid}`
 * - Dashboard tag only: `{base}/{dashboardTagTid}`
 * - Both: `{base}/{topicTid},{dashboardTagTid}` (comma; e.g. `/admin/videos-xml/115,12`)
 */
export function buildTopicFilteredFeedUrl(
  baseFeedUrl: string,
  topicTid?: number | null,
  dashboardTagTid?: number | null
): string {
  const base = baseFeedUrl.replace(/\/+$/, '');
  const t =
    topicTid != null && topicTid !== undefined && Number.isFinite(topicTid) && topicTid > 0
      ? Math.floor(topicTid)
      : null;
  const d =
    dashboardTagTid != null &&
    dashboardTagTid !== undefined &&
    Number.isFinite(dashboardTagTid) &&
    dashboardTagTid > 0
      ? Math.floor(dashboardTagTid)
      : null;

  if (t == null && d == null) return baseFeedUrl;
  if (t != null && d != null) return `${base}/${t},${d}`;
  if (t != null) return `${base}/${t}`;
  return `${base}/${d!}`;
}
