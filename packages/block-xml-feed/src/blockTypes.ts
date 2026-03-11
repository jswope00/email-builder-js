/** Base URL for all XML feed API endpoints. Path suffixes in BLOCK_TYPE_OPTIONS are appended to this. */
export const XML_FEED_API_BASE_URL = 'https://rheumnow.com/admin';

/** Human-readable block type labels, default block header titles, and endpoint path suffix (appended to XML_FEED_API_BASE_URL). */
export const BLOCK_TYPE_OPTIONS = [
  { value: 'VideoXml', label: 'Video XML', blockTitle: 'Video XML', path: '/video-xml' },
  { value: 'VideoPosterBlock', label: 'Video Poster Block', blockTitle: 'Poster Hall', path: '/video-posters-xml' },
  { value: 'Gems', label: 'Gems', blockTitle: 'Gems', path: '/gems-xml' },
  { value: 'TherapeuticUpdateXml', label: 'Therapeutic Update XML', blockTitle: 'Therapeutic Updates', path: '/therapeutic_update_xml' },
  { value: 'FeaturedStoryXml', label: 'Large Story Block', blockTitle: 'Featured Story', path: '/featured-story-xml' },
  { value: 'NewsPanelXml', label: 'News Panel XML', blockTitle: 'News Panel', path: '/daily_news_xml' },
  { value: 'BlogXml', label: 'Blog XML', blockTitle: 'Blogs', path: '/blogs_xml' },
  { value: 'Advertisement72890Xml', label: 'Advertisement 728x90 XML', blockTitle: 'Advertisement 728x90', path: '/email_ad_728_90_xml' },
  { value: 'Advertisement300250Xml', label: 'Advertisement 300x250 XML', blockTitle: 'Advertisement 300x250', path: '/email_ad_300_250_xml' },
  { value: 'ConferenceAdvertisement300250Xml', label: 'Conference Advertisement 300x250 XML', blockTitle: 'Conference Advertisement', path: '/conference_email_ad_300_250_xml' },
  { value: 'DailyDownloadXml', label: 'Daily Download XML', blockTitle: 'Daily Download', path: '/daily_download_xml' },
  { value: 'PromotedSurveyXml', label: 'Promoted Survey XML', blockTitle: 'RheumNow Survey', path: '/promoted-survey-xml' },
] as const;

export type XmlBlockTypeValue = (typeof BLOCK_TYPE_OPTIONS)[number]['value'];

/** Default block header title for a given block type. */
export function getBlockTitleByType(blockType: string | null | undefined): string {
  if (!blockType) return '';
  const opt = BLOCK_TYPE_OPTIONS.find((o) => o.value === blockType);
  return opt?.blockTitle ?? '';
}

/** Full endpoint URL for a given block type: API_BASE_URL + path (hardcoded in code, not from form). */
export function getEndpointByType(blockType: string | null | undefined): string {
  if (!blockType) return '';
  const opt = BLOCK_TYPE_OPTIONS.find((o) => o.value === blockType);
  const path = opt?.path ?? '';
  if (!path) return '';
  const base = XML_FEED_API_BASE_URL.replace(/\/$/, '');
  const suffix = path.replace(/^\//, '');
  return `${base}/${suffix}`;
}
