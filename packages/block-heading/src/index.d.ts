import React from 'react';
import { z } from 'zod';
export declare const HeadingPropsSchema: z.ZodObject<{
    props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        level: z.ZodNullable<z.ZodOptional<z.ZodEnum<["h1", "h2", "h3"]>>>;
    }, "strip", z.ZodTypeAny, {
        text?: string | null | undefined;
        level?: "h2" | "h1" | "h3" | null | undefined;
    }, {
        text?: string | null | undefined;
        level?: "h2" | "h1" | "h3" | null | undefined;
    }>>>;
    style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<["MODERN_SANS", "BOOK_SANS", "ORGANIC_SANS", "GEOMETRIC_SANS", "HEAVY_SANS", "ROUNDED_SANS", "MODERN_SERIF", "BOOK_SERIF", "MONOSPACE"]>>>;
        fontWeight: z.ZodNullable<z.ZodOptional<z.ZodEnum<["bold", "normal"]>>>;
        textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<["left", "center", "right"]>>>;
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
        textAlign?: "right" | "left" | "center" | null | undefined;
        color?: string | null | undefined;
        backgroundColor?: string | null | undefined;
        fontWeight?: "bold" | "normal" | null | undefined;
        fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
    }, {
        padding?: {
            top: number;
            bottom: number;
            right: number;
            left: number;
        } | null | undefined;
        textAlign?: "right" | "left" | "center" | null | undefined;
        color?: string | null | undefined;
        backgroundColor?: string | null | undefined;
        fontWeight?: "bold" | "normal" | null | undefined;
        fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
    }>>>;
}, "strip", z.ZodTypeAny, {
    style?: {
        padding?: {
            top: number;
            bottom: number;
            right: number;
            left: number;
        } | null | undefined;
        textAlign?: "right" | "left" | "center" | null | undefined;
        color?: string | null | undefined;
        backgroundColor?: string | null | undefined;
        fontWeight?: "bold" | "normal" | null | undefined;
        fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
    } | null | undefined;
    props?: {
        text?: string | null | undefined;
        level?: "h2" | "h1" | "h3" | null | undefined;
    } | null | undefined;
}, {
    style?: {
        padding?: {
            top: number;
            bottom: number;
            right: number;
            left: number;
        } | null | undefined;
        textAlign?: "right" | "left" | "center" | null | undefined;
        color?: string | null | undefined;
        backgroundColor?: string | null | undefined;
        fontWeight?: "bold" | "normal" | null | undefined;
        fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
    } | null | undefined;
    props?: {
        text?: string | null | undefined;
        level?: "h2" | "h1" | "h3" | null | undefined;
    } | null | undefined;
}>;
export type HeadingProps = z.infer<typeof HeadingPropsSchema>;
export declare const HeadingPropsDefaults: {
    readonly level: "h2";
    readonly text: "";
};
export declare function Heading({ props, style }: HeadingProps): React.JSX.Element;
//# sourceMappingURL=index.d.ts.map