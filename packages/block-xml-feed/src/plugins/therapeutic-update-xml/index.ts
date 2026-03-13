import type { XmlFeedPlugin } from '../types';

/**
 * Therapeutic Update XML plugin – fields from block-therapeutic-update-xml.
 * title, created, field_author_attribution, field_media_image, body, view_node,
 * field_rxu_is_sponsored, field_show_author.
 */
export const therapeuticUpdateXmlPlugin: XmlFeedPlugin = {
  name: 'Therapeutic Update XML',
  machineName: 'TherapeuticUpdateXml',
  urlSuffix: 'therapeutic_update_xml',
  blockTitle: 'Therapeutic Updates',
  defaultFieldMapping: {
    view_node: { type: 'contentLink', weight: -10 },
    title: { type: 'title', weight: 0 },
    field_full_name: {type: 'author', weight: 15 },
    field_author_attribution: { type: 'author', weight: 15 },
    created: { type: 'date', weight: 10 },
    field_media_image: { type: 'imageWithContentLink', weight: 20 },
    body: { type: 'html', weight: 30 },
    field_rxu_is_sponsored: { type: 'doNotShow', weight: 100 },
    field_show_author: { type: 'doNotShow', weight: 100 },
    field_article_type: { type: 'doNotShow', weight: 100 },
    nid: { type: 'doNotShow', weight: 100 },
    user_picture: { type: 'doNotShow', weight: 100 },
    field_addtional_authors: { type: 'doNotShow', weight: 100 },
    field_sponsored_by_text: { type: 'doNotShow', weight: 100 },
    field_image: { type: 'doNotShow', weight: 100 },
  },
  styles: `
.universal-xml-feed-block.universal-xml-feed-TherapeuticUpdateXml .author-sponsored {
  color: #800080;
  font-weight: bold;
}
.universal-xml-feed-block.universal-xml-feed-TherapeuticUpdateXml .universal-xml-feed-item {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}
  `.trim(),
};
