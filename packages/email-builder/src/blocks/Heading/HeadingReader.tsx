import React, { useEffect, useMemo, useState } from 'react';

import {
  buildFeaturedStoryFeedUrl,
  getFirstFeaturedStoryTitleFromXml,
} from '@usewaypoint/block-featured-story-xml';
import {
  Heading,
  HEADING_FEATURED_STORY_TITLE_WILDCARD,
  HeadingProps,
  HeadingWildcardExtrasContext,
} from '@usewaypoint/block-heading';

import { findFirstFeaturedStoryBlockData } from '../../Reader/findFirstFeaturedStoryBlock';
import { useReaderDocument, useRootBlockId } from '../../Reader/ReaderContexts';
import { useXmlData } from '../../Reader/XmlDataContext';

export default function HeadingReader(props: HeadingProps) {
  const document = useReaderDocument();
  const rootBlockId = useRootBlockId();
  const xmlMap = useXmlData();

  const rawText = props.props?.text ?? '';
  const needsFeaturedTitle = rawText.includes(HEADING_FEATURED_STORY_TITLE_WILDCARD);

  const featuredConfig = useMemo(
    () => (needsFeaturedTitle ? findFirstFeaturedStoryBlockData(document, rootBlockId) : null),
    [document, rootBlockId, needsFeaturedTitle]
  );

  const feedUrl = useMemo(() => {
    if (!featuredConfig) return null;
    return buildFeaturedStoryFeedUrl(featuredConfig.topicTid, featuredConfig.dashboardTagTid);
  }, [featuredConfig]);

  const syncTitle = useMemo(() => {
    if (!needsFeaturedTitle || !feedUrl) return '';
    const xml = xmlMap[feedUrl];
    if (!xml) return null as string | null;
    return getFirstFeaturedStoryTitleFromXml(xml);
  }, [needsFeaturedTitle, feedUrl, xmlMap]);

  const [fetchedTitle, setFetchedTitle] = useState<string | null>(null);

  useEffect(() => {
    setFetchedTitle(null);
  }, [feedUrl]);

  useEffect(() => {
    if (!needsFeaturedTitle || !feedUrl) return;
    if (xmlMap[feedUrl]) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(feedUrl, { cache: 'no-store' });
        if (!res.ok) return;
        const text = await res.text();
        if (!cancelled) setFetchedTitle(getFirstFeaturedStoryTitleFromXml(text));
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [needsFeaturedTitle, feedUrl, xmlMap]);

  const featuredStoryFirstTitle = useMemo(() => {
    if (!needsFeaturedTitle) return '';
    if (syncTitle !== null) return syncTitle;
    return fetchedTitle ?? '';
  }, [needsFeaturedTitle, syncTitle, fetchedTitle]);

  return (
    <HeadingWildcardExtrasContext.Provider value={{ featuredStoryFirstTitle }}>
      <Heading {...props} />
    </HeadingWildcardExtrasContext.Provider>
  );
}
