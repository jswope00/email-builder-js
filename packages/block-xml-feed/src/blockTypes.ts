/** Human-readable block type labels for the XML block type select. Single source of truth. */
export const BLOCK_TYPE_OPTIONS = [
  { value: 'VideoXml', label: 'Video XML' },
  { value: 'TherapeuticUpdateXml', label: 'Therapeutic Update XML' },
  { value: 'FeaturedStoryXml', label: 'Featured Story XML' },
  { value: 'NewsPanelXml', label: 'News Panel XML' },
  { value: 'BlogXml', label: 'Blog XML' },
  { value: 'Advertisement72890Xml', label: 'Advertisement 728x90 XML' },
  { value: 'Advertisement300250Xml', label: 'Advertisement 300x250 XML' },
  { value: 'ConferenceAdvertisement300250Xml', label: 'Conference Advertisement 300x250 XML' },
  { value: 'DailyDownloadXml', label: 'Daily Download XML' },
  { value: 'PromotedSurveyXml', label: 'Promoted Survey XML' },
] as const;

export type XmlBlockTypeValue = (typeof BLOCK_TYPE_OPTIONS)[number]['value'];
