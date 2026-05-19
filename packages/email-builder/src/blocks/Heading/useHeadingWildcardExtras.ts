import { useEffect, useMemo, useState } from 'react';

import {
  buildFeaturedStoryFeedUrl,
  getFirstFeaturedStoryTitleFromXml,
} from '@usewaypoint/block-featured-story-xml';
import {
  HEADING_FEATURED_STORY_TITLE_WILDCARD,
  HEADING_RHEUMIQ_QUIZ_LINK_WILDCARD,
  HEADING_RHEUMIQ_QUIZ_TITLE_WILDCARD,
  type HeadingWildcardExtrasValue,
} from '@usewaypoint/block-heading';
import {
  buildRheumIqQuizFeedUrl,
  getFirstRheumIqQuizWildcardValuesFromXml,
} from '@usewaypoint/block-rheumiq-quiz-xml';

import {
  findFirstFeaturedStoryBlockData,
  findFirstRheumIqQuizBlockData,
} from '../../Reader/findFirstFeaturedStoryBlock';
import { useReaderDocument, useRootBlockId } from '../../Reader/ReaderContexts';
import { useXmlData } from '../../Reader/XmlDataContext';

type RheumIqQuizWildcardValues = {
  title: string;
  link: string;
};

export default function useHeadingWildcardExtras(rawText: string): HeadingWildcardExtrasValue {
  const document = useReaderDocument();
  const rootBlockId = useRootBlockId();
  const xmlMap = useXmlData();

  const needsFeaturedTitle = rawText.includes(HEADING_FEATURED_STORY_TITLE_WILDCARD);
  const needsRheumIqQuiz =
    rawText.includes(HEADING_RHEUMIQ_QUIZ_TITLE_WILDCARD) ||
    rawText.includes(HEADING_RHEUMIQ_QUIZ_LINK_WILDCARD);

  const featuredConfig = useMemo(
    () => (needsFeaturedTitle ? findFirstFeaturedStoryBlockData(document, rootBlockId) : null),
    [document, rootBlockId, needsFeaturedTitle]
  );

  const feedUrl = useMemo(() => {
    if (!featuredConfig) return null;
    return buildFeaturedStoryFeedUrl(featuredConfig.topicTid, featuredConfig.dashboardTagTid);
  }, [featuredConfig]);

  const rheumIqQuizConfig = useMemo(
    () => (needsRheumIqQuiz ? findFirstRheumIqQuizBlockData(document, rootBlockId) : null),
    [document, rootBlockId, needsRheumIqQuiz]
  );

  const rheumIqQuizFeedUrl = useMemo(() => {
    if (!rheumIqQuizConfig) return null;
    return buildRheumIqQuizFeedUrl(rheumIqQuizConfig.topicTid, rheumIqQuizConfig.dashboardTagTid);
  }, [rheumIqQuizConfig]);

  const syncTitle = useMemo(() => {
    if (!needsFeaturedTitle || !feedUrl) return '';
    const xml = xmlMap[feedUrl];
    if (!xml) return null as string | null;
    return getFirstFeaturedStoryTitleFromXml(xml);
  }, [needsFeaturedTitle, feedUrl, xmlMap]);

  const syncRheumIqQuiz = useMemo(() => {
    if (!needsRheumIqQuiz || !rheumIqQuizFeedUrl) return { title: '', link: '' };
    const xml = xmlMap[rheumIqQuizFeedUrl];
    if (!xml) return null as RheumIqQuizWildcardValues | null;
    return getFirstRheumIqQuizWildcardValuesFromXml(xml);
  }, [needsRheumIqQuiz, rheumIqQuizFeedUrl, xmlMap]);

  const [fetchedTitle, setFetchedTitle] = useState<string | null>(null);
  const [fetchedRheumIqQuiz, setFetchedRheumIqQuiz] =
    useState<RheumIqQuizWildcardValues | null>(null);

  useEffect(() => {
    setFetchedTitle(null);
  }, [feedUrl]);

  useEffect(() => {
    setFetchedRheumIqQuiz(null);
  }, [rheumIqQuizFeedUrl]);

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

  useEffect(() => {
    if (!needsRheumIqQuiz || !rheumIqQuizFeedUrl) return;
    if (xmlMap[rheumIqQuizFeedUrl]) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(rheumIqQuizFeedUrl, { cache: 'no-store' });
        if (!res.ok) return;
        const text = await res.text();
        if (!cancelled) setFetchedRheumIqQuiz(getFirstRheumIqQuizWildcardValuesFromXml(text));
      } catch {
        /* ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [needsRheumIqQuiz, rheumIqQuizFeedUrl, xmlMap]);

  const featuredStoryFirstTitle = useMemo(() => {
    if (!needsFeaturedTitle) return '';
    if (syncTitle !== null) return syncTitle;
    return fetchedTitle ?? '';
  }, [needsFeaturedTitle, syncTitle, fetchedTitle]);

  const rheumIqQuizValues = useMemo(() => {
    if (!needsRheumIqQuiz) return { title: '', link: '' };
    if (syncRheumIqQuiz !== null) return syncRheumIqQuiz;
    return fetchedRheumIqQuiz ?? { title: '', link: '' };
  }, [needsRheumIqQuiz, syncRheumIqQuiz, fetchedRheumIqQuiz]);

  return {
    featuredStoryFirstTitle,
    rheumIqQuizTitle: rheumIqQuizValues.title,
    rheumIqQuizLink: rheumIqQuizValues.link,
  };
}
