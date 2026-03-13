import type { XmlFeedPlugin } from '../types';

export const advertisement72890XmlPlugin: XmlFeedPlugin = {
  name: 'Advertisement 728x90 XML',
  machineName: 'Advertisement72890Xml',
  urlSuffix: 'email_ad_728_90_xml',
  blockTitle: 'Advertisement 728x90',
  defaultFieldMapping: {
    title: { type: 'doNotShow', weight: 100 },
    field_destination_url: { type: 'contentLink', weight: -10 },
    field_ad_image: { type: 'imageWithContentLink', weight: 0 },
    field_ad_image_1: { type: 'doNotShow', weight: 100 },
    field_tracking_code: { type: 'doNotShow', weight: 100 },
  },
  imageDimensions: { width: 728, height: 90 },
  showAdvertisementLabel: true,
  trackingCodeField: 'field_tracking_code',
  styles: '.universal-xml-feed-Advertisement72890Xml .universal-xml-feed-ad-label{font-size:11px;color:#999;text-align:center;}',
};
