import {
  buildFeaturedStoryFeedUrl,
  getFirstFeaturedStoryTitleFromXml,
} from '@usewaypoint/block-featured-story-xml';
import {
  expandHeadingWildcards,
  HEADING_FEATURED_STORY_TITLE_WILDCARD,
} from '@usewaypoint/block-heading';
import { renderToStaticMarkup, type TReaderDocument } from '@usewaypoint/email-builder';

import { getTemplateById } from '../db/queries';
import { AppError } from '../utils/errors';
import { createAndSendCampaign } from './mailchimpCampaign';

export type ExecuteMode = 'live' | 'test';

export interface SendRowForExecution {
  id: string;
  name: string;
  template_id: string;
  subject: string;
  list_id: string;
  segment_id: number | null;
  from_name: string;
  from_email: string;
  reply_to: string;
  test_subject: string | null;
  test_list_id: string | null;
  test_segment_id: number | null;
}

/** Breadth-first search for the first FeaturedStoryXml block in a template configuration. */
function findFirstFeaturedStoryBlock(
  config: Record<string, { type: string; data?: unknown }>,
  rootId = 'root'
): { topicTid?: number | null; dashboardTagTid?: number | null } | null {
  const queue: string[] = [rootId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const block = config[id];
    if (!block) continue;

    if (block.type === 'FeaturedStoryXml') {
      const props = (block.data as { props?: Record<string, unknown> } | undefined)?.props;
      return {
        topicTid: props?.topicTid as number | null | undefined,
        dashboardTagTid: props?.dashboardTagTid as number | null | undefined,
      };
    }

    const data = block.data as Record<string, unknown> | undefined;
    const props = data?.props as Record<string, unknown> | undefined;
    const childIds: string[] = [];

    if (Array.isArray(data?.childrenIds)) {
      for (const c of data.childrenIds as unknown[]) {
        if (typeof c === 'string') childIds.push(c);
      }
    }
    if (Array.isArray(props?.childrenIds)) {
      for (const c of props.childrenIds as unknown[]) {
        if (typeof c === 'string') childIds.push(c);
      }
    }
    const columns = props?.columns as Array<{ childrenIds?: unknown }> | undefined;
    if (columns) {
      for (const col of columns) {
        if (Array.isArray(col?.childrenIds)) {
          for (const c of col.childrenIds as unknown[]) {
            if (typeof c === 'string') childIds.push(c);
          }
        }
      }
    }

    queue.push(...childIds);
  }
  return null;
}

/** Resolves all wildcards (%DATE%, %FEATURED_STORY_TITLE%) in a subject line. */
async function expandSubjectWildcards(
  rawSubject: string,
  templateConfig: Record<string, { type: string; data?: unknown }>
): Promise<string> {
  let featuredStoryTitle: string | undefined;

  if (rawSubject.includes(HEADING_FEATURED_STORY_TITLE_WILDCARD)) {
    const featuredBlock = findFirstFeaturedStoryBlock(templateConfig);
    if (featuredBlock) {
      const feedUrl = buildFeaturedStoryFeedUrl(featuredBlock.topicTid, featuredBlock.dashboardTagTid);
      try {
        const res = await fetch(feedUrl);
        if (res.ok) {
          featuredStoryTitle = getFirstFeaturedStoryTitleFromXml(await res.text());
        }
      } catch {
        // Leave the wildcard unexpanded rather than failing the whole send
      }
    }
  }

  return expandHeadingWildcards(rawSubject, new Date(), { featuredStoryFirstTitle: featuredStoryTitle });
}

export async function executeSendForMailchimp(send: SendRowForExecution, mode: ExecuteMode) {
  if (mode === 'test') {
    if (!send.test_subject?.trim() || !send.test_list_id?.trim()) {
      throw new AppError(
        400,
        'Test sends require test subject and test audience on this send',
        'SEND_TEST_CONFIG_MISSING'
      );
    }
  }

  const rawSubject = mode === 'test' ? send.test_subject!.trim() : send.subject.trim();
  const listId = mode === 'test' ? send.test_list_id!.trim() : send.list_id.trim();
  const segmentId =
    mode === 'test'
      ? send.test_segment_id != null
        ? send.test_segment_id
        : undefined
      : send.segment_id != null
        ? send.segment_id
        : undefined;

  const template = await getTemplateById(send.template_id);
  if (!template) {
    throw new AppError(404, 'Template not found or inactive', 'TEMPLATE_NOT_FOUND');
  }

  const templateConfig = template.configuration as Record<string, { type: string; data?: unknown }>;
  const subject = await expandSubjectWildcards(rawSubject, templateConfig);

  const htmlContent = await renderToStaticMarkup(template.configuration as TReaderDocument, { rootBlockId: 'root' });

  const dateStr = new Date().toISOString().split('T')[0];
  const title = `${send.name} ${dateStr}`;

  return createAndSendCampaign({
    title,
    subject,
    fromName: send.from_name,
    fromEmail: send.from_email,
    replyTo: send.reply_to,
    listId,
    segmentId,
    htmlContent,
  });
}
