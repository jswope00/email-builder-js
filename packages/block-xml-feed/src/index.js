import React from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
// Re-export block type options (single source of truth for the list)
export { BLOCK_TYPE_OPTIONS } from './blockTypes';
/** Field type options for the mapping table (second column). */
export const FIELD_TYPE_OPTIONS = [
    { value: 'text', label: 'Text' },
    { value: 'link', label: 'Link' },
    { value: 'image', label: 'Image' },
    { value: 'number', label: 'Number' },
];
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
        url: z.string().optional().nullable(),
        fieldMapping: z.record(z.string(), z.string()).optional().nullable(),
        previewItems: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
    })
        .optional()
        .nullable(),
});
export const UniversalXmlFeedPropsDefaults = {
    blockType: 'PromotedSurveyXml',
    url: '',
    fieldMapping: {},
    previewItems: null,
};
/**
 * Parses XML string and returns all items as array of objects (same structure as discovered by parseXmlToFieldNames).
 * Used when user clicks "Parse & show" to display the feed in the block.
 */
export function parseXmlToItems(xmlText) {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
        });
        const result = parser.parse(xmlText);
        let items = [];
        const findItems = (obj) => {
            if (items.length > 0)
                return;
            if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
                items = obj;
                return;
            }
            if (typeof obj === 'object' && obj !== null) {
                const o = obj;
                if (Array.isArray(o.item) && o.item.length > 0) {
                    items = o.item;
                    return;
                }
                if (o.item && typeof o.item === 'object' && o.item !== null && !Array.isArray(o.item)) {
                    items = [o.item];
                    return;
                }
                for (const key in o) {
                    findItems(o[key]);
                    if (items.length > 0)
                        return;
                }
            }
        };
        findItems(result);
        return items;
    }
    catch (_a) {
        return [];
    }
}
/**
 * Parses XML string and returns field names from the first item found in a repeating structure (e.g. item[], rss.channel.item).
 * Used by the config panel when user clicks "Load" to discover columns for the mapping table.
 */
export function parseXmlToFieldNames(xmlText) {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
        });
        const result = parser.parse(xmlText);
        let firstItem = null;
        const findFirstItem = (obj) => {
            if (firstItem)
                return;
            if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === 'object' && obj[0] !== null) {
                firstItem = obj[0];
                return;
            }
            if (typeof obj === 'object' && obj !== null) {
                const o = obj;
                if (Array.isArray(o.item) && o.item.length > 0) {
                    firstItem = o.item[0];
                    return;
                }
                if (o.item && typeof o.item === 'object' && o.item !== null) {
                    firstItem = o.item;
                    return;
                }
                for (const key in o) {
                    findFirstItem(o[key]);
                    if (firstItem)
                        return;
                }
            }
        };
        findFirstItem(result);
        if (!firstItem)
            return [];
        const obj = firstItem;
        const keys = [];
        for (const k of Object.keys(obj)) {
            if (k.startsWith('@_'))
                continue;
            const v = obj[k];
            if (typeof v === 'string' || typeof v === 'number' || v === null) {
                keys.push(k);
            }
        }
        return keys.sort();
    }
    catch (_a) {
        return [];
    }
}
function stringValue(val) {
    if (val == null)
        return '';
    if (typeof val === 'string')
        return val;
    if (typeof val === 'number')
        return String(val);
    return String(val);
}
export function UniversalXmlFeed({ style, props: propsData }) {
    var _a, _b, _c, _d, _e;
    const url = (_a = propsData === null || propsData === void 0 ? void 0 : propsData.url) !== null && _a !== void 0 ? _a : UniversalXmlFeedPropsDefaults.url;
    const blockType = (_b = propsData === null || propsData === void 0 ? void 0 : propsData.blockType) !== null && _b !== void 0 ? _b : UniversalXmlFeedPropsDefaults.blockType;
    const fieldMapping = (_c = propsData === null || propsData === void 0 ? void 0 : propsData.fieldMapping) !== null && _c !== void 0 ? _c : UniversalXmlFeedPropsDefaults.fieldMapping;
    const previewItems = (_e = (_d = propsData === null || propsData === void 0 ? void 0 : propsData.previewItems) !== null && _d !== void 0 ? _d : UniversalXmlFeedPropsDefaults.previewItems) !== null && _e !== void 0 ? _e : [];
    const padding = style === null || style === void 0 ? void 0 : style.padding;
    const wrapperStyle = {
        padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
        fontFamily: 'sans-serif',
    };
    if (!url) {
        return (React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { border: '1px dashed #ccc', textAlign: 'center', padding: '20px', color: '#666' }) }, "Configure XML feed: choose block type, enter URL, and click Load in the right panel."));
    }
    if (previewItems.length > 0) {
        return (React.createElement("div", { style: wrapperStyle },
            React.createElement("div", { style: { fontSize: 12, color: '#666', marginBottom: 12 } },
                "XML feed (",
                blockType,
                ") \u2014 ",
                previewItems.length,
                " item(s)"),
            previewItems.map((item, index) => (React.createElement("div", { key: index, style: {
                    marginBottom: 16,
                    borderBottom: index < previewItems.length - 1 ? '1px solid #eee' : 'none',
                    paddingBottom: 16,
                } }, Object.keys(fieldMapping).length === 0
                ? Object.entries(item).map(([k, v]) => (React.createElement("div", { key: k, style: { marginBottom: 4 } },
                    React.createElement("strong", null,
                        k,
                        ":"),
                    " ",
                    stringValue(v))))
                : Object.entries(fieldMapping).map(([fieldName, fieldType]) => {
                    const raw = item[fieldName];
                    const val = stringValue(raw);
                    if (fieldType === 'link' && val) {
                        return (React.createElement("div", { key: fieldName, style: { marginBottom: 4 } },
                            React.createElement("strong", null,
                                fieldName,
                                ":"),
                            ' ',
                            React.createElement("a", { href: val, target: "_blank", rel: "noopener noreferrer", style: { color: '#1585fe' } }, val)));
                    }
                    if (fieldType === 'image' && val) {
                        return (React.createElement("div", { key: fieldName, style: { marginBottom: 4 } },
                            React.createElement("strong", null,
                                fieldName,
                                ":"),
                            ' ',
                            React.createElement("img", { src: val, alt: "", style: { maxWidth: '100%', height: 'auto', display: 'block' } })));
                    }
                    return (React.createElement("div", { key: fieldName, style: { marginBottom: 4 } },
                        React.createElement("strong", null,
                            fieldName,
                            ":"),
                        " ",
                        val));
                }))))));
    }
    return (React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { border: '1px solid #eee', borderRadius: 4, padding: 12 }) },
        React.createElement("div", { style: { fontSize: 12, color: '#666', marginBottom: 8 } },
            "XML feed (",
            blockType,
            ")"),
        React.createElement("div", { style: { fontSize: 14, color: '#333' } }, url),
        React.createElement("div", { style: { fontSize: 12, color: '#999', marginTop: 8 } }, "Click \"Parse & show\" in the right panel to display the feed.")));
}
//# sourceMappingURL=index.js.map