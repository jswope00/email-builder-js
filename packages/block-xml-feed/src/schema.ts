import { z } from 'zod';

export const FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'title', label: 'Title' },
  { value: 'contentLink', label: 'Content link' },
  { value: 'imageWithContentLink', label: 'Image with content link' },
  { value: 'author', label: 'Author' },
  { value: 'date', label: 'Date' },
  { value: 'link', label: 'Link' },
  { value: 'image', label: 'Image' },
  { value: 'number', label: 'Number' },
  { value: 'html', label: 'HTML' },
  { value: 'doNotShow', label: 'Do not show' },
] as const;

export type FieldTypeValue = (typeof FIELD_TYPE_OPTIONS)[number]['value'];

const DEFAULT_FIELD_TYPE_BY_NAME: Record<string, string> = {
  view_node: 'contentLink',
  title: 'title',
  field_media_image: 'imageWithContentLink',
  created: 'date',
  field_author_attribution: 'author',
  field_addtional_authors: 'author',
  type: 'doNotShow',
  field_article_type: 'doNotShow',
};

export function getDefaultFieldTypeForName(fieldName: string): string {
  return DEFAULT_FIELD_TYPE_BY_NAME[fieldName] ?? 'html';
}

export const UniversalXmlFeedPropsSchema = z.object({
  style: z
    .object({
      padding: z
        .object({
          top: z.number(),
          bottom: z.number(),
          right: z.number(),
          left: z.number(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  props: z
    .object({
      blockType: z.string().optional().nullable(),
      title: z.string().optional().nullable(),
      displayBlockTitle: z.boolean().optional().nullable(),
      url: z.string().optional().nullable(),
      campaignTermIds: z.array(z.string()).optional().nullable(),
      topicTermIds: z.array(z.string()).optional().nullable(),
      numberOfItems: z.number().min(0).optional().nullable(),
      fieldOrder: z.array(z.string()).optional().nullable(),
      fieldMapping: z.record(z.string(), z.string()).optional().nullable(),
      fieldWeights: z.record(z.string(), z.number()).optional().nullable(),
      previewItems: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
      feedSlices: z
        .array(z.object({ label: z.string(), items: z.array(z.record(z.string(), z.unknown())) }))
        .optional()
        .nullable(),
      activeSliceIndex: z.number().min(0).optional().nullable(),
    })
    .optional()
    .nullable(),
});

export type UniversalXmlFeedProps = z.infer<typeof UniversalXmlFeedPropsSchema>;

export const UniversalXmlFeedPropsDefaults = {
  blockType: '',
  title: null as string | null,
  displayBlockTitle: true,
  url: '',
  campaignTermIds: null as string[] | null,
  topicTermIds: null as string[] | null,
  numberOfItems: 0,
  fieldOrder: null as string[] | null,
  fieldMapping: {} as Record<string, string>,
  fieldWeights: null as Record<string, number> | null,
  previewItems: null as Record<string, unknown>[] | null,
  feedSlices: null as { label: string; items: Record<string, unknown>[] }[] | null,
  activeSliceIndex: 0,
} as const;
