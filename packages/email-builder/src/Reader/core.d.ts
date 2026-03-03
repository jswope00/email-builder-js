import React from 'react';
import { z } from 'zod';
export declare const ReaderBlockSchema: z.ZodEffects<z.ZodDiscriminatedUnion<"type", any>, import("@usewaypoint/document-core").BlockConfiguration<{
    ColumnsContainer: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
            backgroundColor?: string | null | undefined;
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            columns: z.ZodTuple<[z.ZodObject<{
                childrenIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }>, z.ZodObject<{
                childrenIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }>, z.ZodObject<{
                childrenIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }>], null>;
            fixedWidths: z.ZodNullable<z.ZodOptional<z.ZodTuple<[z.ZodOptional<z.ZodNullable<z.ZodNumber>>, z.ZodOptional<z.ZodNullable<z.ZodNumber>>, z.ZodOptional<z.ZodNullable<z.ZodNumber>>], null>>>;
            columnsCount: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<3>]>>>;
            columnsGap: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            contentAlignment: z.ZodNullable<z.ZodOptional<z.ZodEnum<["top", "middle", "bottom"]>>>;
        }, "strip", z.ZodTypeAny, {
            columns: [{
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }];
            fixedWidths?: [number | null | undefined, number | null | undefined, number | null | undefined] | null | undefined;
            columnsCount?: 2 | 3 | null | undefined;
            columnsGap?: number | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
        }, {
            columns: [{
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }];
            fixedWidths?: [number | null | undefined, number | null | undefined, number | null | undefined] | null | undefined;
            columnsCount?: 2 | 3 | null | undefined;
            columnsGap?: number | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            columns: [{
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }];
            fixedWidths?: [number | null | undefined, number | null | undefined, number | null | undefined] | null | undefined;
            columnsCount?: 2 | 3 | null | undefined;
            columnsGap?: number | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
        } | null | undefined;
    }, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            columns: [{
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }];
            fixedWidths?: [number | null | undefined, number | null | undefined, number | null | undefined] | null | undefined;
            columnsCount?: 2 | 3 | null | undefined;
            columnsGap?: number | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
        } | null | undefined;
    }>;
    Container: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            borderColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
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
            backgroundColor?: string | null | undefined;
            borderRadius?: number | null | undefined;
            borderColor?: string | null | undefined;
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
            borderRadius?: number | null | undefined;
            borderColor?: string | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            childrenIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            childrenIds?: string[] | null | undefined;
        }, {
            childrenIds?: string[] | null | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
            borderRadius?: number | null | undefined;
            borderColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            childrenIds?: string[] | null | undefined;
        } | null | undefined;
    }, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
            borderRadius?: number | null | undefined;
            borderColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            childrenIds?: string[] | null | undefined;
        } | null | undefined;
    }>;
    EmailLayout: z.ZodObject<{
        backdropColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        borderColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        canvasColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        textColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<["MODERN_SANS", "BOOK_SANS", "ORGANIC_SANS", "GEOMETRIC_SANS", "HEAVY_SANS", "ROUNDED_SANS", "MODERN_SERIF", "BOOK_SERIF", "MONOSPACE"]>>>;
        childrenIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        borderRadius?: number | null | undefined;
        fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        borderColor?: string | null | undefined;
        childrenIds?: string[] | null | undefined;
        backdropColor?: string | null | undefined;
        canvasColor?: string | null | undefined;
        textColor?: string | null | undefined;
    }, {
        borderRadius?: number | null | undefined;
        fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        borderColor?: string | null | undefined;
        childrenIds?: string[] | null | undefined;
        backdropColor?: string | null | undefined;
        canvasColor?: string | null | undefined;
        textColor?: string | null | undefined;
    }>;
    Avatar: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
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
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            textAlign?: "right" | "left" | "center" | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            shape: z.ZodNullable<z.ZodOptional<z.ZodEnum<["circle", "square", "rounded"]>>>;
            imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            alt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            alt?: string | null | undefined;
            size?: number | null | undefined;
            shape?: "circle" | "square" | "rounded" | null | undefined;
            imageUrl?: string | null | undefined;
        }, {
            alt?: string | null | undefined;
            size?: number | null | undefined;
            shape?: "circle" | "square" | "rounded" | null | undefined;
            imageUrl?: string | null | undefined;
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
        } | null | undefined;
        props?: {
            alt?: string | null | undefined;
            size?: number | null | undefined;
            shape?: "circle" | "square" | "rounded" | null | undefined;
            imageUrl?: string | null | undefined;
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
        } | null | undefined;
        props?: {
            alt?: string | null | undefined;
            size?: number | null | undefined;
            shape?: "circle" | "square" | "rounded" | null | undefined;
            imageUrl?: string | null | undefined;
        } | null | undefined;
    }>;
    Button: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
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
            fontSize?: number | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            buttonBackgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            buttonStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<["rectangle", "pill", "rounded"]>>>;
            buttonTextColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            fullWidth: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
            size: z.ZodNullable<z.ZodOptional<z.ZodEnum<["x-small", "small", "large", "medium"]>>>;
            text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            url?: string | null | undefined;
            size?: "small" | "medium" | "large" | "x-small" | null | undefined;
            text?: string | null | undefined;
            buttonBackgroundColor?: string | null | undefined;
            buttonStyle?: "rounded" | "rectangle" | "pill" | null | undefined;
            buttonTextColor?: string | null | undefined;
            fullWidth?: boolean | null | undefined;
        }, {
            url?: string | null | undefined;
            size?: "small" | "medium" | "large" | "x-small" | null | undefined;
            text?: string | null | undefined;
            buttonBackgroundColor?: string | null | undefined;
            buttonStyle?: "rounded" | "rectangle" | "pill" | null | undefined;
            buttonTextColor?: string | null | undefined;
            fullWidth?: boolean | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            url?: string | null | undefined;
            size?: "small" | "medium" | "large" | "x-small" | null | undefined;
            text?: string | null | undefined;
            buttonBackgroundColor?: string | null | undefined;
            buttonStyle?: "rounded" | "rectangle" | "pill" | null | undefined;
            buttonTextColor?: string | null | undefined;
            fullWidth?: boolean | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            url?: string | null | undefined;
            size?: "small" | "medium" | "large" | "x-small" | null | undefined;
            text?: string | null | undefined;
            buttonBackgroundColor?: string | null | undefined;
            buttonStyle?: "rounded" | "rectangle" | "pill" | null | undefined;
            buttonTextColor?: string | null | undefined;
            fullWidth?: boolean | null | undefined;
        } | null | undefined;
    }>;
    Divider: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
            backgroundColor?: string | null | undefined;
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            lineColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            lineHeight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            lineHeight?: number | null | undefined;
            lineColor?: string | null | undefined;
        }, {
            lineHeight?: number | null | undefined;
            lineColor?: string | null | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            lineHeight?: number | null | undefined;
            lineColor?: string | null | undefined;
        } | null | undefined;
    }, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            lineHeight?: number | null | undefined;
            lineColor?: string | null | undefined;
        } | null | undefined;
    }>;
    Heading: z.ZodObject<{
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
    Html: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<["MODERN_SANS", "BOOK_SANS", "ORGANIC_SANS", "GEOMETRIC_SANS", "HEAVY_SANS", "ROUNDED_SANS", "MODERN_SERIF", "BOOK_SERIF", "MONOSPACE"]>>>;
            fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<["left", "right", "center"]>>>;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            contents: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            contents?: string | null | undefined;
        }, {
            contents?: string | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            contents?: string | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            contents?: string | null | undefined;
        } | null | undefined;
    }>;
    Image: z.ZodObject<{
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
            backgroundColor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<["center", "left", "right"]>>>;
        }, "strip", z.ZodTypeAny, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            textAlign?: "right" | "left" | "center" | null | undefined;
            backgroundColor?: string | null | undefined;
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            textAlign?: "right" | "left" | "center" | null | undefined;
            backgroundColor?: string | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            width: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            height: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            alt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            linkHref: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            contentAlignment: z.ZodNullable<z.ZodOptional<z.ZodEnum<["top", "middle", "bottom"]>>>;
        }, "strip", z.ZodTypeAny, {
            url?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            alt?: string | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
            linkHref?: string | null | undefined;
        }, {
            url?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            alt?: string | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
            linkHref?: string | null | undefined;
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
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            url?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            alt?: string | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
            linkHref?: string | null | undefined;
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
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            url?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            alt?: string | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
            linkHref?: string | null | undefined;
        } | null | undefined;
    }>;
    Spacer: z.ZodObject<{
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            height: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
        }, "strip", z.ZodTypeAny, {
            height?: number | null | undefined;
        }, {
            height?: number | null | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        props?: {
            height?: number | null | undefined;
        } | null | undefined;
    }, {
        props?: {
            height?: number | null | undefined;
        } | null | undefined;
    }>;
    Text: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
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
            fontSize?: number | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            markdown: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
            text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            text?: string | null | undefined;
            markdown?: boolean | null | undefined;
        }, {
            text?: string | null | undefined;
            markdown?: boolean | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            text?: string | null | undefined;
            markdown?: boolean | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            text?: string | null | undefined;
            markdown?: boolean | null | undefined;
        } | null | undefined;
    }>;
    VideoXml: z.ZodObject<{
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
    TherapeuticUpdateXml: z.ZodObject<{
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
    FeaturedStoryXml: z.ZodObject<{
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
    NewsPanelXml: z.ZodObject<{
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
    BlogXml: z.ZodObject<{
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
    Advertisement72890Xml: z.ZodObject<{
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
    Advertisement300250Xml: z.ZodObject<{
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
    ConferenceAdvertisement300250Xml: z.ZodObject<{
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
    DailyDownloadXml: z.ZodObject<{
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
    PromotedSurveyXml: z.ZodObject<{
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
            numberOfItems: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            url?: string | null | undefined;
            numberOfItems?: number | null | undefined;
        }, {
            url?: string | null | undefined;
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
            numberOfItems?: number | null | undefined;
        } | null | undefined;
    }>;
    UniversalXmlFeed: z.ZodObject<{
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
            url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            fieldMapping: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
            previewItems: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>, "many">>>;
        }, "strip", z.ZodTypeAny, {
            url?: string | null | undefined;
            blockType?: string | null | undefined;
            fieldMapping?: Record<string, string> | null | undefined;
            previewItems?: Record<string, unknown>[] | null | undefined;
        }, {
            url?: string | null | undefined;
            blockType?: string | null | undefined;
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
            blockType?: string | null | undefined;
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
            blockType?: string | null | undefined;
            fieldMapping?: Record<string, string> | null | undefined;
            previewItems?: Record<string, unknown>[] | null | undefined;
        } | null | undefined;
    }>;
}>, any>;
export type TReaderBlock = z.infer<typeof ReaderBlockSchema>;
export declare const ReaderDocumentSchema: z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodDiscriminatedUnion<"type", any>, import("@usewaypoint/document-core").BlockConfiguration<{
    ColumnsContainer: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
            backgroundColor?: string | null | undefined;
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            columns: z.ZodTuple<[z.ZodObject<{
                childrenIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }>, z.ZodObject<{
                childrenIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }>, z.ZodObject<{
                childrenIds: z.ZodArray<z.ZodString, "many">;
            }, "strip", z.ZodTypeAny, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }>], null>;
            fixedWidths: z.ZodNullable<z.ZodOptional<z.ZodTuple<[z.ZodOptional<z.ZodNullable<z.ZodNumber>>, z.ZodOptional<z.ZodNullable<z.ZodNumber>>, z.ZodOptional<z.ZodNullable<z.ZodNumber>>], null>>>;
            columnsCount: z.ZodNullable<z.ZodOptional<z.ZodUnion<[z.ZodLiteral<2>, z.ZodLiteral<3>]>>>;
            columnsGap: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            contentAlignment: z.ZodNullable<z.ZodOptional<z.ZodEnum<["top", "middle", "bottom"]>>>;
        }, "strip", z.ZodTypeAny, {
            columns: [{
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }];
            fixedWidths?: [number | null | undefined, number | null | undefined, number | null | undefined] | null | undefined;
            columnsCount?: 2 | 3 | null | undefined;
            columnsGap?: number | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
        }, {
            columns: [{
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }];
            fixedWidths?: [number | null | undefined, number | null | undefined, number | null | undefined] | null | undefined;
            columnsCount?: 2 | 3 | null | undefined;
            columnsGap?: number | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            columns: [{
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }];
            fixedWidths?: [number | null | undefined, number | null | undefined, number | null | undefined] | null | undefined;
            columnsCount?: 2 | 3 | null | undefined;
            columnsGap?: number | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
        } | null | undefined;
    }, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            columns: [{
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }, {
                childrenIds: string[];
            }];
            fixedWidths?: [number | null | undefined, number | null | undefined, number | null | undefined] | null | undefined;
            columnsCount?: 2 | 3 | null | undefined;
            columnsGap?: number | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
        } | null | undefined;
    }>;
    Container: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            borderColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
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
            backgroundColor?: string | null | undefined;
            borderRadius?: number | null | undefined;
            borderColor?: string | null | undefined;
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
            borderRadius?: number | null | undefined;
            borderColor?: string | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            childrenIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
        }, "strip", z.ZodTypeAny, {
            childrenIds?: string[] | null | undefined;
        }, {
            childrenIds?: string[] | null | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
            borderRadius?: number | null | undefined;
            borderColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            childrenIds?: string[] | null | undefined;
        } | null | undefined;
    }, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
            borderRadius?: number | null | undefined;
            borderColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            childrenIds?: string[] | null | undefined;
        } | null | undefined;
    }>;
    EmailLayout: z.ZodObject<{
        backdropColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        borderColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        borderRadius: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        canvasColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        textColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<["MODERN_SANS", "BOOK_SANS", "ORGANIC_SANS", "GEOMETRIC_SANS", "HEAVY_SANS", "ROUNDED_SANS", "MODERN_SERIF", "BOOK_SERIF", "MONOSPACE"]>>>;
        childrenIds: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    }, "strip", z.ZodTypeAny, {
        borderRadius?: number | null | undefined;
        fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        borderColor?: string | null | undefined;
        childrenIds?: string[] | null | undefined;
        backdropColor?: string | null | undefined;
        canvasColor?: string | null | undefined;
        textColor?: string | null | undefined;
    }, {
        borderRadius?: number | null | undefined;
        fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        borderColor?: string | null | undefined;
        childrenIds?: string[] | null | undefined;
        backdropColor?: string | null | undefined;
        canvasColor?: string | null | undefined;
        textColor?: string | null | undefined;
    }>;
    Avatar: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
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
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            textAlign?: "right" | "left" | "center" | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            size: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            shape: z.ZodNullable<z.ZodOptional<z.ZodEnum<["circle", "square", "rounded"]>>>;
            imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            alt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            alt?: string | null | undefined;
            size?: number | null | undefined;
            shape?: "circle" | "square" | "rounded" | null | undefined;
            imageUrl?: string | null | undefined;
        }, {
            alt?: string | null | undefined;
            size?: number | null | undefined;
            shape?: "circle" | "square" | "rounded" | null | undefined;
            imageUrl?: string | null | undefined;
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
        } | null | undefined;
        props?: {
            alt?: string | null | undefined;
            size?: number | null | undefined;
            shape?: "circle" | "square" | "rounded" | null | undefined;
            imageUrl?: string | null | undefined;
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
        } | null | undefined;
        props?: {
            alt?: string | null | undefined;
            size?: number | null | undefined;
            shape?: "circle" | "square" | "rounded" | null | undefined;
            imageUrl?: string | null | undefined;
        } | null | undefined;
    }>;
    Button: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
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
            fontSize?: number | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            buttonBackgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            buttonStyle: z.ZodNullable<z.ZodOptional<z.ZodEnum<["rectangle", "pill", "rounded"]>>>;
            buttonTextColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            fullWidth: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
            size: z.ZodNullable<z.ZodOptional<z.ZodEnum<["x-small", "small", "large", "medium"]>>>;
            text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            url?: string | null | undefined;
            size?: "small" | "medium" | "large" | "x-small" | null | undefined;
            text?: string | null | undefined;
            buttonBackgroundColor?: string | null | undefined;
            buttonStyle?: "rounded" | "rectangle" | "pill" | null | undefined;
            buttonTextColor?: string | null | undefined;
            fullWidth?: boolean | null | undefined;
        }, {
            url?: string | null | undefined;
            size?: "small" | "medium" | "large" | "x-small" | null | undefined;
            text?: string | null | undefined;
            buttonBackgroundColor?: string | null | undefined;
            buttonStyle?: "rounded" | "rectangle" | "pill" | null | undefined;
            buttonTextColor?: string | null | undefined;
            fullWidth?: boolean | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            url?: string | null | undefined;
            size?: "small" | "medium" | "large" | "x-small" | null | undefined;
            text?: string | null | undefined;
            buttonBackgroundColor?: string | null | undefined;
            buttonStyle?: "rounded" | "rectangle" | "pill" | null | undefined;
            buttonTextColor?: string | null | undefined;
            fullWidth?: boolean | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            url?: string | null | undefined;
            size?: "small" | "medium" | "large" | "x-small" | null | undefined;
            text?: string | null | undefined;
            buttonBackgroundColor?: string | null | undefined;
            buttonStyle?: "rounded" | "rectangle" | "pill" | null | undefined;
            buttonTextColor?: string | null | undefined;
            fullWidth?: boolean | null | undefined;
        } | null | undefined;
    }>;
    Divider: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
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
            backgroundColor?: string | null | undefined;
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            lineColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            lineHeight: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            lineHeight?: number | null | undefined;
            lineColor?: string | null | undefined;
        }, {
            lineHeight?: number | null | undefined;
            lineColor?: string | null | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            lineHeight?: number | null | undefined;
            lineColor?: string | null | undefined;
        } | null | undefined;
    }, {
        style?: {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            lineHeight?: number | null | undefined;
            lineColor?: string | null | undefined;
        } | null | undefined;
    }>;
    Heading: z.ZodObject<{
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
    Html: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            fontFamily: z.ZodOptional<z.ZodNullable<z.ZodEnum<["MODERN_SANS", "BOOK_SANS", "ORGANIC_SANS", "GEOMETRIC_SANS", "HEAVY_SANS", "ROUNDED_SANS", "MODERN_SERIF", "BOOK_SERIF", "MONOSPACE"]>>>;
            fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<["left", "right", "center"]>>>;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            contents: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            contents?: string | null | undefined;
        }, {
            contents?: string | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            contents?: string | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            contents?: string | null | undefined;
        } | null | undefined;
    }>;
    Image: z.ZodObject<{
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
            backgroundColor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            textAlign: z.ZodNullable<z.ZodOptional<z.ZodEnum<["center", "left", "right"]>>>;
        }, "strip", z.ZodTypeAny, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            textAlign?: "right" | "left" | "center" | null | undefined;
            backgroundColor?: string | null | undefined;
        }, {
            padding?: {
                top: number;
                bottom: number;
                right: number;
                left: number;
            } | null | undefined;
            textAlign?: "right" | "left" | "center" | null | undefined;
            backgroundColor?: string | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            width: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            height: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
            url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            alt: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            linkHref: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            contentAlignment: z.ZodNullable<z.ZodOptional<z.ZodEnum<["top", "middle", "bottom"]>>>;
        }, "strip", z.ZodTypeAny, {
            url?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            alt?: string | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
            linkHref?: string | null | undefined;
        }, {
            url?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            alt?: string | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
            linkHref?: string | null | undefined;
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
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            url?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            alt?: string | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
            linkHref?: string | null | undefined;
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
            backgroundColor?: string | null | undefined;
        } | null | undefined;
        props?: {
            url?: string | null | undefined;
            width?: number | null | undefined;
            height?: number | null | undefined;
            alt?: string | null | undefined;
            contentAlignment?: "top" | "bottom" | "middle" | null | undefined;
            linkHref?: string | null | undefined;
        } | null | undefined;
    }>;
    Spacer: z.ZodObject<{
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            height: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
        }, "strip", z.ZodTypeAny, {
            height?: number | null | undefined;
        }, {
            height?: number | null | undefined;
        }>>>;
    }, "strip", z.ZodTypeAny, {
        props?: {
            height?: number | null | undefined;
        } | null | undefined;
    }, {
        props?: {
            height?: number | null | undefined;
        } | null | undefined;
    }>;
    Text: z.ZodObject<{
        style: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            color: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            backgroundColor: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            fontSize: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
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
            fontSize?: number | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        }>>>;
        props: z.ZodNullable<z.ZodOptional<z.ZodObject<{
            markdown: z.ZodNullable<z.ZodOptional<z.ZodBoolean>>;
            text: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            text?: string | null | undefined;
            markdown?: boolean | null | undefined;
        }, {
            text?: string | null | undefined;
            markdown?: boolean | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            text?: string | null | undefined;
            markdown?: boolean | null | undefined;
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
            fontSize?: number | null | undefined;
            backgroundColor?: string | null | undefined;
            fontWeight?: "bold" | "normal" | null | undefined;
            fontFamily?: "MODERN_SANS" | "BOOK_SANS" | "ORGANIC_SANS" | "GEOMETRIC_SANS" | "HEAVY_SANS" | "ROUNDED_SANS" | "MODERN_SERIF" | "BOOK_SERIF" | "MONOSPACE" | null | undefined;
        } | null | undefined;
        props?: {
            text?: string | null | undefined;
            markdown?: boolean | null | undefined;
        } | null | undefined;
    }>;
    VideoXml: z.ZodObject<{
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
    TherapeuticUpdateXml: z.ZodObject<{
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
    FeaturedStoryXml: z.ZodObject<{
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
    NewsPanelXml: z.ZodObject<{
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
    BlogXml: z.ZodObject<{
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
    Advertisement72890Xml: z.ZodObject<{
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
    Advertisement300250Xml: z.ZodObject<{
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
    ConferenceAdvertisement300250Xml: z.ZodObject<{
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
    DailyDownloadXml: z.ZodObject<{
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
    PromotedSurveyXml: z.ZodObject<{
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
            numberOfItems: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
        }, "strip", z.ZodTypeAny, {
            url?: string | null | undefined;
            numberOfItems?: number | null | undefined;
        }, {
            url?: string | null | undefined;
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
            numberOfItems?: number | null | undefined;
        } | null | undefined;
    }>;
    UniversalXmlFeed: z.ZodObject<{
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
            url: z.ZodNullable<z.ZodOptional<z.ZodString>>;
            fieldMapping: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
            previewItems: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodRecord<z.ZodString, z.ZodUnknown>, "many">>>;
        }, "strip", z.ZodTypeAny, {
            url?: string | null | undefined;
            blockType?: string | null | undefined;
            fieldMapping?: Record<string, string> | null | undefined;
            previewItems?: Record<string, unknown>[] | null | undefined;
        }, {
            url?: string | null | undefined;
            blockType?: string | null | undefined;
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
            blockType?: string | null | undefined;
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
            blockType?: string | null | undefined;
            fieldMapping?: Record<string, string> | null | undefined;
            previewItems?: Record<string, unknown>[] | null | undefined;
        } | null | undefined;
    }>;
}>, any>>;
export type TReaderDocument = Record<string, TReaderBlock>;
export type TReaderBlockProps = {
    id: string;
};
export declare function ReaderBlock({ id }: TReaderBlockProps): React.JSX.Element;
export type TReaderProps = {
    document: Record<string, z.infer<typeof ReaderBlockSchema>>;
    rootBlockId: string;
    xmlData?: Record<string, string>;
};
export default function Reader({ document, rootBlockId, xmlData }: TReaderProps): React.JSX.Element;
//# sourceMappingURL=core.d.ts.map