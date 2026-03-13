/**
 * Field mapping entry: type and weight for render order (lower weight = higher in list).
 */
export type FieldMappingEntry = { type: string; weight: number };

/**
 * Plugin descriptor for an XML feed block type.
 */
export interface XmlFeedPlugin {
  /** Human-readable name for the block type selector. */
  name: string;
  /** Machine name (e.g. BlogXml), stored in blockType. */
  machineName: string;
  /** URL path suffix (e.g. blogs_xml), appended to base URL. */
  urlSuffix: string;
  /** Default block header title. */
  blockTitle: string;
  /** Default for "Show block title". When false, block title is hidden by default (e.g. ads). Omit or true = show. */
  defaultShowBlockTitle?: boolean;
  /** Default field name -> { type, weight }. Weight used for render order. */
  defaultFieldMapping: Record<string, FieldMappingEntry>;
  /** Optional CSS string for this block type. */
  styles?: string;
  /** Exact image dimensions (e.g. 300x250, 728x90). When set, img gets width/height in px. */
  imageDimensions?: { width: number; height: number };
  /** When true, render "Advertisement" label and optional tracking code below each item. */
  showAdvertisementLabel?: boolean;
  /** Field name for tracking code (hidden div, raw HTML). Used when showAdvertisementLabel is true. */
  trackingCodeField?: string;
}
