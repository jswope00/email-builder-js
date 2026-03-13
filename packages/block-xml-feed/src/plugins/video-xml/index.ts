import type { XmlFeedPlugin } from '../types';

/**
 * Video XML plugin – fields from block-video-xml.
 * title, field_media_image, field_captions, field_media_video_embed_field.
 */
export const videoXmlPlugin: XmlFeedPlugin = {
  name: 'Video XML',
  machineName: 'VideoXml',
  urlSuffix: 'video-xml',
  blockTitle: 'Video XML',
  defaultShowBlockTitle: true,
  defaultFieldMapping: {
    view_node: { type: 'contentLink', weight: -10 },
    title: { type: 'title', weight: 20 },
    created: { type: 'doNotShow', weight: 100 },
    field_media_image: { type: 'imageWithContentLink', weight: 10 },
    field_captions: { type: 'html', weight: 30 },
    field_media_video_embed_field: { type: 'doNotShow', weight: 100 },
    nid_1: { type: 'doNotShow', weight: 100 },

  },
  styles: `
.universal-xml-feed-block.universal-xml-feed-VideoXml a {
  color: inherit;
}
.universal-xml-feed-block.universal-xml-feed-VideoXml .universal-xml-feed-item {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}
  `.trim(),
};
