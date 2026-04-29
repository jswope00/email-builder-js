import React from 'react';
import { renderToStaticMarkup as baseRenderToStaticMarkup } from 'react-dom/server';
import { COLUMNS_CONTAINER_STACK_TD_CLASS } from '@usewaypoint/block-columns-container';
import { ADVERTISEMENT_300250_XML_FEED_URL } from '@usewaypoint/block-advertisement-300-250-xml';
import { ADVERTISEMENT_72890_XML_FEED_URL } from '@usewaypoint/block-advertisement-728-90-xml';
import { BLOG_XML_FEED_URL } from '@usewaypoint/block-blog-xml';
import { CONFERENCE_ADVERTISEMENT_300250_XML_FEED_URL } from '@usewaypoint/block-conference-advertisement-300-250-xml';
import { COVERAGE_XML_FEED_URLS } from '@usewaypoint/block-coverage-xml';
import { DAILY_DOWNLOAD_XML_FEED_URL } from '@usewaypoint/block-daily-download-xml';
import { EMAIL_SURVEY_XML_FEED_URL } from '@usewaypoint/block-email-survey-xml';
import { FEATURED_STORY_XML_FEED_URL } from '@usewaypoint/block-featured-story-xml';
import { NEWS_PANEL_XML_FEED_URL } from '@usewaypoint/block-news-panel-xml';
import { THERAPEUTIC_UPDATE_XML_FEED_URL } from '@usewaypoint/block-therapeutic-update-xml';
import { VIDEO_POSTER_XML_FEED_URL } from '@usewaypoint/block-video-poster-xml';
import { VIDEO_XML_FEED_URL } from '@usewaypoint/block-video-xml';

import Reader, { TReaderDocument } from '../Reader/core';

/** Same rules as `@usewaypoint/rheumnow-xml-topic` `buildTopicFilteredFeedUrl` (kept inline so this package does not depend on that workspace package). */
function buildTopicFilteredFeedUrl(
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

/** Maps XML-backed block types to their fixed feed URL(s) (see each block package).
 *  A block may specify an array of base URLs when it fetches from multiple feeds. */
const XML_FEED_URL_BY_BLOCK_TYPE: Record<string, string | readonly string[]> = {
  VideoXml: VIDEO_XML_FEED_URL,
  TherapeuticUpdateXml: THERAPEUTIC_UPDATE_XML_FEED_URL,
  VideoPosterXml: VIDEO_POSTER_XML_FEED_URL,
  FeaturedStoryXml: FEATURED_STORY_XML_FEED_URL,
  NewsPanelXml: NEWS_PANEL_XML_FEED_URL,
  BlogXml: BLOG_XML_FEED_URL,
  Advertisement72890Xml: ADVERTISEMENT_72890_XML_FEED_URL,
  Advertisement300250Xml: ADVERTISEMENT_300250_XML_FEED_URL,
  ConferenceAdvertisement300250Xml: CONFERENCE_ADVERTISEMENT_300250_XML_FEED_URL,
  DailyDownloadXml: DAILY_DOWNLOAD_XML_FEED_URL,
  EmailSurveyXml: EMAIL_SURVEY_XML_FEED_URL,
  CoverageXml: COVERAGE_XML_FEED_URLS,
};

/** Matches typical email canvas width; column `<td>`s stack below this viewport width. */
const RESPONSIVE_BREAKPOINT_PX = 600;

function buildEmailResponsiveStackCss(stackTdClass: string): string {
  const c = stackTdClass;
  return [
    `@media only screen and (max-width: ${RESPONSIVE_BREAKPOINT_PX}px) {`,
    `  td.${c} {`,
    '    display: block !important;',
    '    width: 100% !important;',
    '    max-width: 100% !important;',
    '    box-sizing: border-box !important;',
    '    padding-left: 0 !important;',
    '    padding-right: 0 !important;',
    '  }',
    `  td.${c} + td.${c} {`,
    '    padding-top: 16px !important;',
    '  }',
    '}',
  ].join('\n');
}

type TOptions = {
  rootBlockId: string;
};

function topicTidFromProps(props: Record<string, unknown> | undefined): number | null {
  const raw = props?.topicTid;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }
  return null;
}

function dashboardTagTidFromProps(props: Record<string, unknown> | undefined): number | null {
  const raw = props?.dashboardTagTid;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }
  return null;
}

// Helper function to extract all XML URLs from a document
function extractXmlUrls(document: TReaderDocument): string[] {
  const urls: string[] = [];
  const visited = new Set<string>();

  function traverse(blockId: string) {
    if (visited.has(blockId)) return;
    visited.add(blockId);

    const block = document[blockId];
    if (!block) return;

    const data = block.data as Record<string, unknown> | undefined;
    const props = data?.props as Record<string, unknown> | undefined;

    const feedUrl = XML_FEED_URL_BY_BLOCK_TYPE[block.type];
    if (feedUrl) {
      const baseUrls = Array.isArray(feedUrl) ? feedUrl : [feedUrl];
      for (const base of baseUrls) {
        urls.push(
          buildTopicFilteredFeedUrl(base, topicTidFromProps(props), dashboardTagTidFromProps(props))
        );
      }
    }

    // Traverse children
    const childrenIds = data?.childrenIds;
    if (Array.isArray(childrenIds)) {
      childrenIds.forEach((childId) => {
        if (typeof childId === 'string') {
          traverse(childId);
        }
      });
    }

    const propsChildrenIds = props?.childrenIds;
    if (Array.isArray(propsChildrenIds)) {
      propsChildrenIds.forEach((childId) => {
        if (typeof childId === 'string') {
          traverse(childId);
        }
      });
    }

    // Traverse columns in ColumnsContainer
    const columns = props?.columns;
    if (Array.isArray(columns)) {
      columns.forEach((column: any) => {
        if (column?.childrenIds && Array.isArray(column.childrenIds)) {
          column.childrenIds.forEach((childId: string) => {
            if (typeof childId === 'string') {
              traverse(childId);
            }
          });
        }
      });
    }
  }

  Object.keys(document).forEach((key) => traverse(key));
  return [...new Set(urls)]; // Remove duplicates
}

// Helper function to fetch XML data
async function fetchXmlData(url: string): Promise<string> {
  try {
    // In Node.js environment, use node-fetch or similar
    // For browser environment, use fetch
    if (typeof fetch === 'function') {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      return await response.text();
    } else {
      // Node.js environment - try to use node:https or require node-fetch
      throw new Error('fetch is not available in this environment');
    }
  } catch (error) {
    console.error(`Error fetching XML from ${url}:`, error);
    return '';
  }
}

export default async function renderToStaticMarkup(
  document: TReaderDocument,
  { rootBlockId }: TOptions
): Promise<string> {
  // Extract all XML URLs from the document
  const xmlUrls = extractXmlUrls(document);

  // Fetch all XML data in parallel
  const xmlDataMap: Record<string, string> = {};
  await Promise.all(
    xmlUrls.map(async (url) => {
      const data = await fetchXmlData(url);
      if (data) {
        xmlDataMap[url] = data;
      }
    })
  );

  // Make XML data available globally for components that can't import the context
  // This is a workaround for components in separate packages
  // Support both Node.js (global) and browser (window) environments
  if (typeof global !== 'undefined') {
    (global as any).__XML_DATA_CONTEXT__ = xmlDataMap;
  }
  if (typeof window !== 'undefined') {
    (window as any).__XML_DATA_CONTEXT__ = xmlDataMap;
  }

  const responsiveStackCss = buildEmailResponsiveStackCss(COLUMNS_CONTAINER_STACK_TD_CLASS);

  const html = '<!DOCTYPE html>' +
    baseRenderToStaticMarkup(
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style dangerouslySetInnerHTML={{ __html: responsiveStackCss }} />
        </head>
        <body>
          <Reader document={document} rootBlockId={rootBlockId} xmlData={xmlDataMap} />
        </body>
      </html>
    );

  // Clean up global
  if (typeof global !== 'undefined') {
    delete (global as any).__XML_DATA_CONTEXT__;
  }
  if (typeof window !== 'undefined') {
    delete (window as any).__XML_DATA_CONTEXT__;
  }

  return html;
}
