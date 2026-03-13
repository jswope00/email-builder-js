import type { XmlFeedPlugin } from '../types';

export const advertisement300250XmlPlugin: XmlFeedPlugin = {
  name: 'Advertisement 300x250 XML',
  machineName: 'Advertisement300250Xml',
  urlSuffix: 'email_ad_300_250_xml',
  blockTitle: 'Advertisement 300x250',
  defaultShowBlockTitle: false,
  defaultFieldMapping: {
    title: { type: 'doNotShow', weight: 100 },
    field_destination_url: { type: 'contentLink', weight: -10 },
    field_ad_image: { type: 'imageWithContentLink', weight: 0 },
    field_ad_image_1: { type: 'doNotShow', weight: 100 },
    field_tracking_code: { type: 'html', weight: 100 },
  },
  imageDimensions: { width: 300, height: 250 },
  showAdvertisementLabel: true,
  trackingCodeField: 'field_tracking_code',
  defaultShowBlockTitle: false,
  styles: '.universal-xml-feed-Advertisement300250Xml .universal-xml-feed-ad-label{font-size:11px;color:#999;text-align:center;}',
};
