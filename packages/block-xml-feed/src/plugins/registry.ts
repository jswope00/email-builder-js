import type { XmlFeedPlugin } from './types';
import { blogXmlPlugin } from './blog-xml';
import { videoXmlPlugin } from './video-xml';
import { therapeuticUpdateXmlPlugin } from './therapeutic-update-xml';

const PLUGINS: XmlFeedPlugin[] = [blogXmlPlugin, videoXmlPlugin, therapeuticUpdateXmlPlugin];

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
