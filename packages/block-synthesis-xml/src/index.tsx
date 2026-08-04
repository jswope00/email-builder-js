import React, { CSSProperties } from 'react';
import { z } from 'zod';

/** Fixed feed URLs used when generating synthesis content (same sources as CoverageXml). */
export const SYNTHESIS_VIDEO_XML_FEED_URL = 'https://rheumnow.com/admin/videos-xml';
export const SYNTHESIS_ARTICLE_XML_FEED_URL = 'https://rheumnow.com/admin/article-xml';
export const SYNTHESIS_TWEET_XML_FEED_URL = 'https://rheumnow.com/admin/tweet-xml';
export const SYNTHESIS_PODCAST_XML_FEED_URL = 'https://rheumnow.com/admin/podcasts_xml';

export const SYNTHESIS_XML_FEED_URLS = [
  SYNTHESIS_VIDEO_XML_FEED_URL,
  SYNTHESIS_ARTICLE_XML_FEED_URL,
  SYNTHESIS_TWEET_XML_FEED_URL,
  SYNTHESIS_PODCAST_XML_FEED_URL,
] as const;

export const SYNTHESIS_ICON_URLS = {
  article: 'https://rheumnow.com/sites/default/files/2026-04/news-icon-black.png',
  video: 'https://rheumnow.com/sites/default/files/2026-04/video-play-black.png',
  podcast: 'https://rheumnow.com/sites/default/files/2026-04/podcast-icon-black.png',
  tweet: 'https://rheumnow.com/sites/default/files/2026-04/news-icon-black.png',
} as const;

export const SynthesisContentTypeSchema = z.enum(['article', 'video', 'podcast', 'tweet']);
export type SynthesisContentType = z.infer<typeof SynthesisContentTypeSchema>;

export const SynthesisDigestItemSchema = z.object({
  title: z.string(),
  url: z.string().optional().nullable(),
  contentType: SynthesisContentTypeSchema.default('article'),
});
export type SynthesisDigestItem = z.infer<typeof SynthesisDigestItemSchema>;

export const SynthesisThemeSchema = z.object({
  /** e.g. "I. THE JAK INHIBITOR RECKONING" */
  heading: z.string(),
  hook: z.string(),
  items: z.array(SynthesisDigestItemSchema).default([]),
  conclusions: z.string(),
});
export type SynthesisTheme = z.infer<typeof SynthesisThemeSchema>;

export const SynthesisDigestSchema = z.object({
  themes: z.array(SynthesisThemeSchema).default([]),
});
export type SynthesisDigest = z.infer<typeof SynthesisDigestSchema>;

const PADDING_SCHEMA = z
  .object({
    top: z.number(),
    bottom: z.number(),
    right: z.number(),
    left: z.number(),
  })
  .optional()
  .nullable();

const getPadding = (padding: z.infer<typeof PADDING_SCHEMA>) =>
  padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined;

export const SynthesisXmlPropsSchema = z.object({
  style: z
    .object({
      padding: PADDING_SCHEMA,
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
      includeVideos: z.boolean().optional().nullable(),
      includeArticles: z.boolean().optional().nullable(),
      includeTweets: z.boolean().optional().nullable(),
      includePodcasts: z.boolean().optional().nullable(),
      /** Extra admin guidance merged into the AI prompt when generating. */
      specialInstructions: z.string().optional().nullable(),
      /** Structured editorial digest (preferred). */
      digest: SynthesisDigestSchema.optional().nullable(),
      /**
       * Legacy freeform HTML from earlier builds. Rendered only when `digest` is empty.
       * Prefer editing via `digest` going forward.
       */
      generatedHtml: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type SynthesisXmlProps = z.infer<typeof SynthesisXmlPropsSchema>;

export const SynthesisXmlPropsDefaults = {
  title: '',
  createdStartDate: null,
  createdEndDate: null,
  createdRelativeDays: null,
  includeVideos: true,
  includeArticles: true,
  includeTweets: true,
  includePodcasts: true,
  specialInstructions: '',
  digest: { themes: [] } as SynthesisDigest,
  generatedHtml: '',
} as const;

export function emptySynthesisTheme(index = 0): SynthesisTheme {
  const numerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const numeral = numerals[index] ?? String(index + 1);
  return {
    heading: `${numeral}. NEW THEME`,
    hook: '',
    items: [],
    conclusions: '',
  };
}

export function emptySynthesisDigestItem(): SynthesisDigestItem {
  return { title: '', url: '', contentType: 'article' };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function iconForType(contentType: SynthesisContentType | undefined): { url: string; alt: string } {
  switch (contentType) {
    case 'video':
      return { url: SYNTHESIS_ICON_URLS.video, alt: 'Video' };
    case 'podcast':
      return { url: SYNTHESIS_ICON_URLS.podcast, alt: 'Podcast' };
    case 'tweet':
      return { url: SYNTHESIS_ICON_URLS.tweet, alt: 'Tweet' };
    case 'article':
    default:
      return { url: SYNTHESIS_ICON_URLS.article, alt: 'Article' };
  }
}

/**
 * Build the email-safe HTML fragment from a structured digest.
 */
export function renderSynthesisDigestToHtml(digest: SynthesisDigest | null | undefined): string {
  const themes = digest?.themes ?? [];
  if (themes.length === 0) return '';

  const themeHtml = themes
    .map((theme) => {
      const heading = escapeHtml(theme.heading || '');
      const hook = escapeHtml(theme.hook || '');
      const conclusions = escapeHtml(theme.conclusions || '');

      const itemsHtml = (theme.items ?? [])
        .filter((item) => (item.title || '').trim())
        .map((item) => {
          const { url: iconUrl, alt } = iconForType(item.contentType);
          const title = escapeHtml(item.title.trim());
          const href = (item.url || '').trim();
          const titleEl = href
            ? `<a href="${escapeHtml(href)}" style="font-size: 14px; color: #2980b9; text-decoration: none; font-weight: 500;">${title}</a>`
            : `<span style="font-size: 14px; color: #2980b9; font-weight: 500;">${title}</span>`;
          return `<div style="display: flex; align-items: center; margin-bottom: 8px; padding: 5px 0;">
            <img src="${iconUrl}" alt="${alt}" style="width: 20px; height: 20px; margin-right: 12px; flex-shrink: 0;"/>
            ${titleEl}
        </div>`;
        })
        .join('\n');

      return `
    <h2>${heading}</h2>
    <span style="color: #555555; margin-bottom: 15px; display: block; font-size: 15px;">${hook}</span>

    <div style="list-style: none; padding: 0; margin: 0;">
${itemsHtml}
    </div>

    <div style="background: #f9f9f9; padding: 15px; margin-top: 15px; font-size: 14px; border-left: 4px solid #2c3e50;">
        <span style="font-weight: bold; color: #2c3e50; text-transform: uppercase; display: block; margin-bottom: 5px;">Conclusions:</span>
        ${conclusions}
    </div>`;
    })
    .join('\n');

  return `<div style="">\n${themeHtml}\n</div>`;
}

export function hasSynthesisContent(props: SynthesisXmlProps['props'] | null | undefined): boolean {
  const themes = props?.digest?.themes ?? [];
  if (themes.some((t) => (t.heading || t.hook || t.conclusions || (t.items?.length ?? 0) > 0))) {
    return true;
  }
  return Boolean(props?.generatedHtml?.trim());
}

/**
 * Renders structured digest (or legacy HTML). Generation happens in the editor via the API.
 */
export function SynthesisXml({ style, props }: SynthesisXmlProps) {
  const title = props?.title ?? SynthesisXmlPropsDefaults.title;
  const digestHtml = renderSynthesisDigestToHtml(props?.digest);
  const html = digestHtml || (props?.generatedHtml?.trim() ? props.generatedHtml : null);

  const cssStyle: CSSProperties = {
    padding: getPadding(style?.padding),
    fontFamily: 'sans-serif',
  };

  return (
    <div style={cssStyle}>
      {title ? (
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
      ) : null}
      {html ? (
        <div dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div
          style={{
            padding: '24px 16px',
            backgroundColor: '#f8f9fb',
            border: '1px dashed #d1d5db',
            borderRadius: '8px',
            color: '#6b7280',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          No synthesis generated yet. Configure filters in the sidebar and click Generate.
        </div>
      )}
    </div>
  );
}
