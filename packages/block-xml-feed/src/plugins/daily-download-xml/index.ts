import type { XmlFeedPlugin } from '../types';

export const dailyDownloadXmlPlugin: XmlFeedPlugin = {
  name: 'Daily Download XML',
  machineName: 'DailyDownloadXml',
  urlSuffix: 'daily_download_xml',
  blockTitle: 'Daily Download',
  defaultShowBlockTitle: true,
  defaultFieldMapping: {
    view_node: { type: 'contentLink', weight: -10 },
    title: { type: 'title', weight: 10 },
    thumbnail__target_id: { type: 'imageWithContentLink', weight: 0 },
    nid: { type: 'doNotShow', weight: 100 },
    field_primary_topic: { type: 'doNotShow', weight: 100 },
    field_secondary_topics: { type: 'doNotShow', weight: 100 },
  },
  styles: '.universal-xml-feed-DailyDownloadXml .download-btn-link{display:inline-block;padding:12px 24px;background:#1585fe;color:#fff;text-decoration:none;border-radius:4px;font-size:14px;font-weight:bold;margin-top:8px;}',
};
