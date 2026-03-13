import type { XmlFeedPlugin } from './types';
import { blogXmlPlugin } from './blog-xml';
import { videoXmlPlugin } from './video-xml';
import { therapeuticUpdateXmlPlugin } from './therapeutic-update-xml';
import { advertisement300250XmlPlugin } from './advertisement-300-250-xml';
import { advertisement72890XmlPlugin } from './advertisement-728-90-xml';
import { conferenceAdvertisement300250XmlPlugin } from './conference-advertisement-300-250-xml';
import { dailyDownloadXmlPlugin } from './daily-download-xml';
import { emailSurveyXmlPlugin } from './email-survey-xml';
import { featuredStoryXmlPlugin } from './featured-story-xml';

const PLUGINS: XmlFeedPlugin[] = [
  blogXmlPlugin,
  videoXmlPlugin,
  therapeuticUpdateXmlPlugin,
  advertisement300250XmlPlugin,
  advertisement72890XmlPlugin,
  conferenceAdvertisement300250XmlPlugin,
  dailyDownloadXmlPlugin,
  emailSurveyXmlPlugin,
  featuredStoryXmlPlugin,
];

const BY_MACHINE_NAME = new Map<string, XmlFeedPlugin>(PLUGINS.map((p) => [p.machineName, p]));

export const XML_FEED_API_BASE_URL = 'https://rheumnow.com/admin';

export function getPluginsList(): XmlFeedPlugin[] {
  return [...PLUGINS];
}

export function getPlugin(machineName: string | null | undefined): XmlFeedPlugin | undefined {
  if (!machineName) return undefined;
  return BY_MACHINE_NAME.get(machineName);
}

export function getBlockTitleByType(blockType: string | null | undefined): string {
  const plugin = getPlugin(blockType);
  return plugin?.blockTitle ?? '';
}

export function getEndpointByType(blockType: string | null | undefined): string {
  const plugin = getPlugin(blockType);
  if (!plugin?.urlSuffix) return '';
  const base = XML_FEED_API_BASE_URL.replace(/\/$/, '');
  const suffix = plugin.urlSuffix.replace(/^\//, '');
  return `${base}/${suffix}`;
}
