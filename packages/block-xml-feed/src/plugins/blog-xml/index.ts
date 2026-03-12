import type { XmlFeedPlugin } from '../types';

/**
 * Blog XML plugin – fields and weights from block-blog-xml.
 * view_node, title, field_author_attribution, created, field_media_image, body,
 * field_show_author, field_article_type.
 */
export const blogXmlPlugin: XmlFeedPlugin = {
  name: 'Blog XML',
  machineName: 'BlogXml',
  urlSuffix: 'blogs_xml',
  blockTitle: 'Blogs',
  defaultFieldMapping: {
    view_node: { type: 'contentLink', weight: -10 },
    title: { type: 'title', weight: 0 },
    field_author_attribution: { type: 'author', weight: 10 },
    created: { type: 'date', weight: 15 },
    field_media_image: { type: 'imageWithContentLink', weight: 20 },
    body: { type: 'html', weight: 30 },
    field_show_author: { type: 'doNotShow', weight: 100 },
    field_article_type: { type: 'doNotShow', weight: 100 },
  },
};
