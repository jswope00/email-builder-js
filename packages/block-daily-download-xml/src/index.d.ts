import React from 'react';
import { z } from 'zod';
export declare const DailyDownloadXmlPropsSchema: z.ZodObject<{
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
        url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        title: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        numberOfItems: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        url?: string | null | undefined;
        title?: string | null | undefined;
        numberOfItems?: number | null | undefined;
    }, {
        url?: string | null | undefined;
        title?: string | null | undefined;
        numberOfItems?: number | null | undefined;
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
    } | null | undefined;
}>;
export type DailyDownloadXmlProps = z.infer<typeof DailyDownloadXmlPropsSchema>;
export declare const DailyDownloadXmlPropsDefaults: {
    readonly url: "";
    readonly title: "";
    readonly numberOfItems: 3;
};
export declare function DailyDownloadXml({ style, props }: DailyDownloadXmlProps): React.JSX.Element;
//# sourceMappingURL=index.d.ts.map