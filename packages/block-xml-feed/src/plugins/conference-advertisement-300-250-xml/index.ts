import type { XmlFeedPlugin } from '../types';

/**
 * Conference Advertisement 300x250 XML – same fields as Advertisement 300x250.
 * Image exact size 300x250px, "Advertisement" label below.
 */
export const conferenceAdvertisement300250XmlPlugin: XmlFeedPlugin = {
  name: 'Conference Advertisement 300x250 XML',
  machineName: 'ConferenceAdvertisement300250Xml',
  urlSuffix: 'conference_email_ad_300_250_xml',
  blockTitle: 'Conference Advertisement 300x250',
  defaultShowBlockTitle: false,
  defaultFieldMapping: {
    field_destination_url: { type: 'contentLink', weight: -10 },
    field_ad_image: { type: 'imageWithContentLink', weight: 0 },
    field_ad_image_1: { type: 'doNotShow', weight: 100 },
    field_tracking_code: { type: 'doNotShow', weight: 100 },
  },
  imageDimensions: { width: 300, height: 250 },
  showAdvertisementLabel: true,
  trackingCodeField: 'field_tracking_code',
  styles: `
.universal-xml-feed-block.universal-xml-feed-ConferenceAdvertisement300250Xml .universal-xml-feed-item {
  margin-bottom: 6px;
  text-align: center;
}
.universal-xml-feed-block.universal-xml-feed-ConferenceAdvertisement300250Xml .universal-xml-feed-ad-label {
  font-size: 11px;
  color: #999;
  text-align: center;
}
  `.trim(),
};
