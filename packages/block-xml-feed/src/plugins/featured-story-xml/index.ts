import type { XmlFeedPlugin } from '../types';

/**
 * Featured Story XML – same structure as blog: view_node, title, author, date, image, body.
 * When type === 'video', play icon is shown on the image.
 * Block title hidden by default.
 */
export const featuredStoryXmlPlugin: XmlFeedPlugin = {
  name: 'Featured Story XML',
  machineName: 'FeaturedStoryXml',
  urlSuffix: 'featured-story-xml',
  blockTitle: 'Featured Story',
  defaultShowBlockTitle: false,
  videoIndicatorField: 'type',
  videoIndicatorValue: 'video',
  defaultFieldMapping: {
    view_node: { type: 'contentLink', weight: -10 },
    title: { type: 'title', weight: 0 },
    field_author_attribution: { type: 'author', weight: 10 },
    created: { type: 'date', weight: 15 },
    field_media_image: { type: 'imageWithContentLink', weight: 20 },
    body: { type: 'html', weight: 30 },
    field_show_author: { type: 'doNotShow', weight: 100 },
    type: { type: 'doNotShow', weight: 100 },
    nid: { type: 'doNotShow', weight: 100 },
    field_article_type: { type: 'doNotShow', weight: 100 },
    field_addtional_authors: { type: 'author', weight: 10 },
    field_media_video_embed_field: { type: 'doNotShow', weight: 100 },
    field_captions: { type: 'doNotShow', weight: 100 },
  },
  styles: `
.universal-xml-feed-block.universal-xml-feed-FeaturedStoryXml a:not(.download-btn-link) {
  color: inherit;
}
  `.trim(),
};
