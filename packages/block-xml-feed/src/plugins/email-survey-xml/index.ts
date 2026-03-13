import type { XmlFeedPlugin } from '../types';

export const emailSurveyXmlPlugin: XmlFeedPlugin = {
  name: 'Email Survey XML',
  machineName: 'PromotedSurveyXml',
  urlSuffix: 'promoted_survey_xml',
  blockTitle: 'RheumNow Survey',
  defaultShowBlockTitle: true,
  defaultFieldMapping: {
    nothing: {type: 'html', weight: 0},
  },
};
