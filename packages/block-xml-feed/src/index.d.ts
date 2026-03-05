import React from 'react';
import { z } from 'zod';
export { BLOCK_TYPE_OPTIONS, type XmlBlockTypeValue } from './blockTypes';
/** Default block header title for a given block type. */
export declare function getBlockTitleByType(blockType: string | null | undefined): string;
/** Field type options for the mapping table (second column). */
export declare const FIELD_TYPE_OPTIONS: readonly [{
    readonly value: "text";
    readonly label: "Text";
}, {
    readonly value: "title";
    readonly label: "Title";
}, {
    readonly value: "contentLink";
    readonly label: "Content link";
}, {
    readonly value: "imageWithContentLink";
    readonly label: "Image with content link";
}, {
    readonly value: "author";
    readonly label: "Author";
}, {
    readonly value: "date";
    readonly label: "Date";
}, {
    readonly value: "link";
    readonly label: "Link";
}, {
    readonly value: "image";
    readonly label: "Image";
}, {
    readonly value: "number";
    readonly label: "Number";
}, {
    readonly value: "html";
    readonly label: "HTML";
}, {
    readonly value: "doNotShow";
    readonly label: "Do not show";
}];
export type FieldTypeValue = (typeof FIELD_TYPE_OPTIONS)[number]['value'];
export declare const UniversalXmlFeedPropsSchema: z.ZodObject<{
    style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        padding: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            top: z.ZodNumber;
            bottom: z.ZodNumber;
            right: z.ZodNumber;
            left: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            top: number;
            bottom: number;
            right: number;
            left: number;
        }, {
            top: number;
            bottom: number;
            right: number;
            left: number;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        padding?: {
            top: number;
            bottom: number;
            right: number;
            left: number;
        } | null | undefined;
    }, {
        padding?: {
            top: number;
            bottom: number;
            right: number;
            left: number;
        } | null | undefined;
    }>>>;
    props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        blockType: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        displayBlockTitle: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
        url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        numberOfItems: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        fieldOrder: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        fieldMapping: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
        previewItems: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        url?: string | null | undefined;
        title?: string | null | undefined;
        numberOfItems?: number | null | undefined;
        blockType?: string | null | undefined;
        displayBlockTitle?: boolean | null | undefined;
        fieldOrder?: string[] | null | undefined;
        fieldMapping?: Record<string, string> | null | undefined;
        previewItems?: Record<string, unknown>[] | null | undefined;
    }, {
        url?: string | null | undefined;
        title?: string | null | undefined;
        numberOfItems?: number | null | undefined;
        blockType?: string | null | undefined;
        displayBlockTitle?: boolean | null | undefined;
        fieldOrder?: string[] | null | undefined;
        fieldMapping?: Record<string, string> | null | undefined;
        previewItems?: Record<string, unknown>[] | null | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    style?: {
        padding?: {
            top: number;
            bottom: number;
            right: number;
            left: number;
        } | null | undefined;
    } | null | undefined;
    props?: {
        url?: string | null | undefined;
        title?: string | null | undefined;
        numberOfItems?: number | null | undefined;
        blockType?: string | null | undefined;
        displayBlockTitle?: boolean | null | undefined;
        fieldOrder?: string[] | null | undefined;
        fieldMapping?: Record<string, string> | null | undefined;
        previewItems?: Record<string, unknown>[] | null | undefined;
    } | null | undefined;
}, {
    style?: {
        padding?: {
            top: number;
            bottom: number;
            right: number;
            left: number;
        } | null | undefined;
    } | null | undefined;
    props?: {
        url?: string | null | undefined;
        title?: string | null | undefined;
        numberOfItems?: number | null | undefined;
        blockType?: string | null | undefined;
        displayBlockTitle?: boolean | null | undefined;
        fieldOrder?: string[] | null | undefined;
        fieldMapping?: Record<string, string> | null | undefined;
        previewItems?: Record<string, unknown>[] | null | undefined;
    } | null | undefined;
}>;
export type UniversalXmlFeedProps = z.infer<typeof UniversalXmlFeedPropsSchema>;
export declare const UniversalXmlFeedPropsDefaults: {
    readonly blockType: "PromotedSurveyXml";
    readonly title: string | null;
    readonly displayBlockTitle: true;
    readonly url: "";
    readonly numberOfItems: 0;
    readonly fieldOrder: string[] | null;
    readonly fieldMapping: Record<string, string>;
    readonly previewItems: Record<string, unknown>[] | null;
};
/**
 * Parses XML string and returns all items as array of objects (same structure as discovered by parseXmlToFieldNames).
 * Used when user clicks "Parse & show" to display the feed in the block.
 */
export declare function parseXmlToItems(xmlText: string): Record<string, unknown>[];
/**
 * Parses XML string and returns field names from the first item found in a repeating structure (e.g. item[], rss.channel.item).
 * Used by the config panel when user clicks "Load" to discover columns for the mapping table.
 */
export declare function parseXmlToFieldNames(xmlText: string): string[];
export declare function UniversalXmlFeed({ style, props: propsData }: UniversalXmlFeedProps): React.JSX.Element;
//# sourceMappingURL=index.d.ts.map