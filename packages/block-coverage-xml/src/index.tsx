import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
import { buildTopicFilteredFeedUrl } from '@usewaypoint/rheumnow-xml-topic';

/** Fixed feed URLs used by this block (not editable in the inspector). */
export const COVERAGE_VIDEO_XML_FEED_URL = 'https://rheumnow.com/admin/videos-xml';
export const COVERAGE_ARTICLE_XML_FEED_URL = 'https://rheumnow.com/admin/article-xml';
export const COVERAGE_TWEET_XML_FEED_URL = 'https://rheumnow.com/admin/tweet-xml';
export const COVERAGE_PODCAST_XML_FEED_URL = 'https://rheumnow.com/admin/podcasts_xml';

/** All base feed URLs this block fetches from (used for SSR prefetch). */
export const COVERAGE_XML_FEED_URLS = [
  COVERAGE_VIDEO_XML_FEED_URL,
  COVERAGE_ARTICLE_XML_FEED_URL,
  COVERAGE_TWEET_XML_FEED_URL,
  COVERAGE_PODCAST_XML_FEED_URL,
] as const;

export const CoverageXmlPropsSchema = z.object({
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
      topicTid: z.number().int().positive().optional().nullable(),
      dashboardTagTid: z.number().int().positive().optional().nullable(),
      createdStartDate: z.string().optional().nullable(),
      createdEndDate: z.string().optional().nullable(),
      createdRelativeDays: z.number().int().min(0).optional().nullable(),
      // Tile appearance
      tileBackgroundColor: z.string().optional().nullable(),
      tileBorderColor: z.string().optional().nullable(),
      tileBorderWidth: z.number().min(0).optional().nullable(),
      tileTextColor: z.string().optional().nullable(),
      // Per-tile image overrides (replaces built-in SVG icon when set)
      videoImageUrl: z.string().optional().nullable(),
      articleImageUrl: z.string().optional().nullable(),
      tweetImageUrl: z.string().optional().nullable(),
      podcastImageUrl: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type CoverageXmlProps = z.infer<typeof CoverageXmlPropsSchema>;

export const CoverageXmlPropsDefaults = {
  title: '',
  createdStartDate: null,
  createdEndDate: null,
  createdRelativeDays: null,
} as const;

type DateFilterOptions = {
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

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

function countItemsInXml(xmlText: string, dateFilters: DateFilterOptions): number {
  try {
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
    const result = parser.parse(xmlText);

    let foundItems: any[] = [];

    const findItems = (obj: any) => {
      if (foundItems.length > 0) return;
      if (Array.isArray(obj)) {
        const first = obj[0];
        if (first && (first.title || first.field_media_image || first.nid || first.type || first.view_node)) {
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

    findItems(result);

    const hasDateFilter =
      (typeof dateFilters.createdStartDate === 'string' && dateFilters.createdStartDate.trim() !== '') ||
      (typeof dateFilters.createdEndDate === 'string' && dateFilters.createdEndDate.trim() !== '') ||
      (typeof dateFilters.createdRelativeDays === 'number' &&
        Number.isFinite(dateFilters.createdRelativeDays));

    if (!hasDateFilter) return foundItems.length;

    return foundItems.filter((item: any) => {
      const createdRaw = item.created_1 ?? item.created;
      const dt = parseCreatedField(createdRaw);
      return passesDateFilter(dt, dateFilters);
    }).length;
  } catch {
    return 0;
  }
}

function getPreFetchedXml(url: string): string | null {
  try {
    const ctx =
      (typeof global !== 'undefined' ? (global as any).__XML_DATA_CONTEXT__ : undefined) ||
      (typeof window !== 'undefined' ? (window as any).__XML_DATA_CONTEXT__ : undefined);
    return ctx?.[url] ?? null;
  } catch {
    return null;
  }
}

async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const VideoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="12" fill="#1585fe" />
    <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="white" />
  </svg>
);

const ArticleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="12" fill="#22c55e" />
    <rect x="7" y="7" width="10" height="2" rx="1" fill="white" />
    <rect x="7" y="11" width="10" height="2" rx="1" fill="white" />
    <rect x="7" y="15" width="6" height="2" rx="1" fill="white" />
  </svg>
);

const TweetIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="12" fill="#000000" />
    <path d="M13.72 10.89L17.48 6.5h-.9l-3.27 3.79-2.61-3.79H8l3.94 5.73L8 17.5h.9l3.44-3.99 2.75 3.99H17l-3.28-6.61zm-1.22 1.41l-.4-.57-3.18-4.55h1.37l2.57 3.67.4.57 3.34 4.79h-1.37l-2.73-3.91z" fill="white" />
  </svg>
);

const PodcastIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <circle cx="12" cy="12" r="12" fill="#a855f7" />
    <path d="M12 7c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2s2-.9 2-2V9c0-1.1-.9-2-2-2zm3.5 5c0 1.93-1.57 3.5-3.5 3.5S8.5 13.93 8.5 12H7c0 2.34 1.72 4.28 4 4.58V18h2v-1.42c2.28-.3 4-2.24 4-4.58h-1.5z" fill="white" />
  </svg>
);

// ─── Tile component ────────────────────────────────────────────────────────────

type TileProps = {
  icon: React.ReactNode;
  imageUrl?: string | null;
  count: number | null;
  label: string;
  loading: boolean;
  backgroundColor?: string | null;
  borderColor?: string | null;
  borderWidth?: number | null;
  textColor?: string | null;
};

function CoverageTile({ icon, imageUrl, count, label, loading, backgroundColor, borderColor, borderWidth, textColor }: TileProps) {
  const bWidth = borderWidth ?? 1;
  const border = bWidth === 0 ? 'none' : `${bWidth}px solid ${borderColor ?? '#e8eaed'}`;
  const countColor = textColor ?? '#1a1a2e';
  const labelColor = textColor ?? '#6b7280';

  const iconContent = imageUrl
    ? <img src={imageUrl} alt={label} width={32} height={32} style={{ display: 'block' }} />
    : icon;

  return (
    <td
      width="25%"
      style={{
        textAlign: 'center',
        padding: '12px 8px',
        verticalAlign: 'top',
      }}
    >
      <div
        style={{
          backgroundColor: backgroundColor ?? '#f8f9fb',
          borderRadius: '8px',
          padding: '20px 12px',
          border,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          {iconContent}
        </div>
        <div
          style={{
            fontSize: '36px',
            fontWeight: 700,
            lineHeight: 1.1,
            color: countColor,
            marginBottom: '6px',
            fontFamily: 'sans-serif',
          }}
        >
          {loading ? '—' : count ?? 0}
        </div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: labelColor,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontFamily: 'sans-serif',
          }}
        >
          {label}
        </div>
      </div>
    </td>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

type Counts = {
  videos: number;
  articles: number;
  tweets: number;
  podcasts: number;
};

export function CoverageXml({
  style,
  props,
}: CoverageXmlProps) {
  const topicTid = props?.topicTid ?? null;
  const dashboardTagTid = props?.dashboardTagTid ?? null;
  const title = props?.title ?? CoverageXmlPropsDefaults.title;
  const dateFilters: DateFilterOptions = {
    createdStartDate: props?.createdStartDate,
    createdEndDate: props?.createdEndDate,
    createdRelativeDays: props?.createdRelativeDays,
  };

  const tileBackgroundColor = props?.tileBackgroundColor ?? null;
  const tileBorderColor = props?.tileBorderColor ?? null;
  const tileBorderWidth = props?.tileBorderWidth ?? null;
  const tileTextColor = props?.tileTextColor ?? null;
  const tileStyleProps = { backgroundColor: tileBackgroundColor, borderColor: tileBorderColor, borderWidth: tileBorderWidth, textColor: tileTextColor };

  const videoUrl = buildTopicFilteredFeedUrl(COVERAGE_VIDEO_XML_FEED_URL, topicTid, dashboardTagTid);
  const articleUrl = buildTopicFilteredFeedUrl(COVERAGE_ARTICLE_XML_FEED_URL, topicTid, dashboardTagTid);
  const tweetUrl = buildTopicFilteredFeedUrl(COVERAGE_TWEET_XML_FEED_URL, topicTid, dashboardTagTid);
  const podcastUrl = buildTopicFilteredFeedUrl(COVERAGE_PODCAST_XML_FEED_URL, topicTid, dashboardTagTid);

  // Compute counts from pre-fetched SSR data if available
  function computeFromPrefetch(): Counts | null {
    const videoXml = getPreFetchedXml(videoUrl);
    const articleXml = getPreFetchedXml(articleUrl);
    const tweetXml = getPreFetchedXml(tweetUrl);
    const podcastXml = getPreFetchedXml(podcastUrl);
    if (!videoXml && !articleXml && !tweetXml && !podcastXml) return null;
    return {
      videos: videoXml ? countItemsInXml(videoXml, dateFilters) : 0,
      articles: articleXml ? countItemsInXml(articleXml, dateFilters) : 0,
      tweets: tweetXml ? countItemsInXml(tweetXml, dateFilters) : 0,
      podcasts: podcastXml ? countItemsInXml(podcastXml, dateFilters) : 0,
    };
  }

  const preFetchedCounts = computeFromPrefetch();

  const [counts, setCounts] = useState<Counts | null>(preFetchedCounts);
  const [loading, setLoading] = useState(preFetchedCounts === null);

  useEffect(() => {
    if (preFetchedCounts !== null) {
      setCounts(preFetchedCounts);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const run = async () => {
      try {
        const [videoXml, articleXml, tweetXml, podcastXml] = await Promise.allSettled([
          fetchXml(videoUrl),
          fetchXml(articleUrl),
          fetchXml(tweetUrl),
          fetchXml(podcastUrl),
        ]);

        if (cancelled) return;

        const getVal = (r: PromiseSettledResult<string>): string | null =>
          r.status === 'fulfilled' ? r.value : null;

        const vXml = getVal(videoXml);
        const aXml = getVal(articleXml);
        const tXml = getVal(tweetXml);
        const pXml = getVal(podcastXml);

        setCounts({
          videos: vXml ? countItemsInXml(vXml, dateFilters) : 0,
          articles: aXml ? countItemsInXml(aXml, dateFilters) : 0,
          tweets: tXml ? countItemsInXml(tXml, dateFilters) : 0,
          podcasts: pXml ? countItemsInXml(pXml, dateFilters) : 0,
        });
      } catch (err) {
        console.error('CoverageXml fetch error:', err);
        if (!cancelled) setCounts({ videos: 0, articles: 0, tweets: 0, podcasts: 0 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [
    videoUrl,
    articleUrl,
    tweetUrl,
    podcastUrl,
    dateFilters.createdStartDate,
    dateFilters.createdEndDate,
    dateFilters.createdRelativeDays,
  ]);

  const padding = style?.padding;
  const wrapperPadding = padding
    ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
    : undefined;

  return (
    <div style={{ padding: wrapperPadding, fontFamily: 'sans-serif' }}>
      {title && (
        <h2
          style={{
            fontSize: '18px',
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
      <table
        width="100%"
        cellPadding="0"
        cellSpacing="0"
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <tbody>
          <tr>
            <CoverageTile
              icon={<VideoIcon />}
              imageUrl={props?.videoImageUrl}
              count={counts?.videos ?? null}
              label="Videos"
              loading={loading}
              {...tileStyleProps}
            />
            <CoverageTile
              icon={<ArticleIcon />}
              imageUrl={props?.articleImageUrl}
              count={counts?.articles ?? null}
              label="Articles"
              loading={loading}
              {...tileStyleProps}
            />
            <CoverageTile
              icon={<TweetIcon />}
              imageUrl={props?.tweetImageUrl}
              count={counts?.tweets ?? null}
              label="Tweets"
              loading={loading}
              {...tileStyleProps}
            />
            <CoverageTile
              icon={<PodcastIcon />}
              imageUrl={props?.podcastImageUrl}
              count={counts?.podcasts ?? null}
              label="Podcasts"
              loading={loading}
              {...tileStyleProps}
            />
          </tr>
        </tbody>
      </table>
    </div>
  );
}
