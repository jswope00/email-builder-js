import React from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
// Re-export block type options; title helper is defined here so it works with compiled blockTypes.js
export { BLOCK_TYPE_OPTIONS } from './blockTypes';
/** Default block header title by block type (used when blockTypes.js has no blockTitle). */
const BLOCK_TITLE_BY_TYPE = {
    VideoXml: 'Video XML',
    VideoPosterBlock: 'Poster Hall',
    Gems: 'Gems',
    TherapeuticUpdateXml: 'Therapeutic Updates',
    FeaturedStoryXml: 'Featured Story',
    NewsPanelXml: 'News Panel',
    BlogXml: 'Blogs',
    Advertisement72890Xml: 'Advertisement 728x90',
    Advertisement300250Xml: 'Advertisement 300x250',
    ConferenceAdvertisement300250Xml: 'Conference Advertisement',
    DailyDownloadXml: 'Daily Download',
    PromotedSurveyXml: 'RheumNow Survey',
};
/** Default block header title for a given block type. */
export function getBlockTitleByType(blockType) {
    var _a;
    if (!blockType)
        return '';
    return (_a = BLOCK_TITLE_BY_TYPE[blockType]) !== null && _a !== void 0 ? _a : '';
}
/** Field type options for the mapping table (second column). */
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
        title: z.string().optional().nullable(),
        displayBlockTitle: z.boolean().optional().nullable(),
        url: z.string().optional().nullable(),
        numberOfItems: z.number().min(0).optional().nullable(),
        fieldOrder: z.array(z.string()).optional().nullable(),
        fieldMapping: z.record(z.string(), z.string()).optional().nullable(),
        previewItems: z.array(z.record(z.string(), z.unknown())).optional().nullable(),
    })
        .optional()
        .nullable(),
});
export const UniversalXmlFeedPropsDefaults = {
    blockType: 'PromotedSurveyXml',
    title: null,
    displayBlockTitle: true,
    url: '',
    numberOfItems: 0,
    fieldOrder: null,
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
        return keys;
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
function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
export function UniversalXmlFeed({ style, props: propsData }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const url = (_a = propsData === null || propsData === void 0 ? void 0 : propsData.url) !== null && _a !== void 0 ? _a : UniversalXmlFeedPropsDefaults.url;
    const blockType = (_b = propsData === null || propsData === void 0 ? void 0 : propsData.blockType) !== null && _b !== void 0 ? _b : UniversalXmlFeedPropsDefaults.blockType;
    const title = (propsData === null || propsData === void 0 ? void 0 : propsData.title) != null && propsData.title !== ''
        ? propsData.title
        : getBlockTitleByType(blockType);
    const displayBlockTitle = (_c = propsData === null || propsData === void 0 ? void 0 : propsData.displayBlockTitle) !== null && _c !== void 0 ? _c : UniversalXmlFeedPropsDefaults.displayBlockTitle;
    const fieldMapping = (_d = propsData === null || propsData === void 0 ? void 0 : propsData.fieldMapping) !== null && _d !== void 0 ? _d : UniversalXmlFeedPropsDefaults.fieldMapping;
    const previewItems = (_f = (_e = propsData === null || propsData === void 0 ? void 0 : propsData.previewItems) !== null && _e !== void 0 ? _e : UniversalXmlFeedPropsDefaults.previewItems) !== null && _f !== void 0 ? _f : [];
    const padding = style === null || style === void 0 ? void 0 : style.padding;
    const wrapperStyle = {
        padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
        fontFamily: 'sans-serif',
    };
    if (!url) {
        return (React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { border: '1px dashed #ccc', textAlign: 'center', padding: '20px', color: '#666' }) }, "Configure XML feed: choose block type, enter URL, and click Load in the right panel."));
    }
    if (previewItems.length > 0) {
        const fieldOrder = (_g = propsData === null || propsData === void 0 ? void 0 : propsData.fieldOrder) !== null && _g !== void 0 ? _g : UniversalXmlFeedPropsDefaults.fieldOrder;
        const mapping = fieldMapping !== null && fieldMapping !== void 0 ? fieldMapping : {};
        const visible = (name) => mapping[name] && mapping[name] !== 'doNotShow';
        const orderedNames = fieldOrder && fieldOrder.length > 0
            ? [
                ...fieldOrder.filter((name) => visible(name)),
                ...Object.keys(mapping).filter((name) => visible(name) && !fieldOrder.includes(name)),
            ]
            : Object.keys(mapping).filter((name) => visible(name));
        const mappingEntries = orderedNames.map((name) => [name, mapping[name]]);
        const contentLinkField = (_h = mappingEntries.find(([, t]) => t === 'contentLink')) === null || _h === void 0 ? void 0 : _h[0];
        const titleField = (_j = mappingEntries.find(([, t]) => t === 'title')) === null || _j === void 0 ? void 0 : _j[0];
        const showPlayIcon = blockType === 'VideoPosterBlock' || blockType === 'VideoXml';
        const playIconSpan = showPlayIcon ? (React.createElement("span", { style: { marginRight: '6px', color: '#1585fe' } }, "\u25B6")) : null;
        const isGems = blockType === 'Gems';
        const gemsBorderColor = '#a8bed4';
        const gemsBgColor = 'rgba(168, 190, 212, 0.3)';
        const gemsTextColor = '#2c3e50';
        const gemsAccentColor = '#4a6fa5';
        const blockTitleStyle = isGems
            ? {
                fontSize: '22px',
                marginBottom: '14px',
                color: gemsTextColor,
                textTransform: 'none',
                borderLeft: `4px solid ${gemsBorderColor}`,
                paddingLeft: '12px',
                lineHeight: 1.3,
                margin: '0 0 20px 0',
                fontStyle: 'italic',
            }
            : {
                fontSize: '18px',
                marginBottom: '12px',
                color: '#333',
                textTransform: 'uppercase',
                borderLeft: '4px solid #1585fe',
                paddingLeft: '10px',
                lineHeight: 1.2,
                margin: '0 0 16px 0',
            };
        const getItemWrapperStyle = (index) => isGems
            ? {
                marginBottom: 28,
                padding: '18px 18px 20px 20px',
                borderLeft: `3px solid ${gemsBorderColor}`,
                backgroundColor: gemsBgColor,
                borderRadius: '0 4px 4px 0',
            }
            : {
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: index < previewItems.length - 1 ? '1px solid #eee' : 'none',
            };
        const gemsTitleFontSize = '22px';
        const gemsBodyFontSize = '18px';
        const titleStyle = isGems
            ? { margin: '0 0 10px 0', fontSize: gemsTitleFontSize, lineHeight: 1.45, color: gemsTextColor, fontStyle: 'italic' }
            : { margin: '0 0 8px 0', fontSize: '18px', lineHeight: 1.4, color: '#333' };
        const textStyle = isGems
            ? { marginBottom: 6, fontSize: gemsBodyFontSize, lineHeight: 1.5, color: gemsTextColor }
            : { marginBottom: 4 };
        const blockStyle = isGems
            ? { marginBottom: 10 }
            : { marginBottom: 8 };
        /** Same as in block-featured-story-xml, block-blog-xml: author (bold) and date on one line with bullet. */
        const authorDateLineStyle = {
            fontSize: '12px',
            color: '#666',
            marginBottom: '8px',
        };
        return (React.createElement("div", { style: wrapperStyle },
            displayBlockTitle && title && (React.createElement("h2", { style: blockTitleStyle }, title)),
            previewItems.map((item, index) => {
                const record = item;
                const linkUrl = contentLinkField ? stringValue(record[contentLinkField]) : '';
                const titleVal = titleField ? stringValue(record[titleField]) : '';
                const renderField = (fieldName, fieldType, val, key) => {
                    if (fieldType === 'doNotShow' || !val)
                        return null;
                    if (fieldType === 'contentLink')
                        return null;
                    if (fieldType === 'link') {
                        return (React.createElement("div", { key: key, style: textStyle },
                            React.createElement("a", { href: val, target: "_blank", rel: "noopener noreferrer", style: { color: isGems ? gemsAccentColor : '#1585fe' } }, escapeHtml(val))));
                    }
                    if (fieldType === 'title') {
                        const titleNode = (React.createElement("h3", { style: titleStyle },
                            playIconSpan,
                            escapeHtml(val)));
                        if (linkUrl) {
                            return (React.createElement("div", { key: key, style: blockStyle },
                                React.createElement("a", { href: linkUrl, target: "_blank", rel: "noopener noreferrer", style: { textDecoration: 'none', color: 'inherit', display: 'block' } }, titleNode)));
                        }
                        return (React.createElement("div", { key: key, style: blockStyle }, titleNode));
                    }
                    if (fieldType === 'image' || fieldType === 'imageWithContentLink') {
                        const img = (React.createElement("img", { src: val, alt: titleVal || '', style: { width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 } }));
                        if (fieldType === 'imageWithContentLink' && linkUrl) {
                            return (React.createElement("div", { key: key, style: textStyle },
                                React.createElement("a", { href: linkUrl, target: "_blank", rel: "noopener noreferrer", style: { textDecoration: 'none', color: 'inherit', display: 'block' } }, img)));
                        }
                        return (React.createElement("div", { key: key, style: textStyle }, img));
                    }
                    if (fieldType === 'html') {
                        return (React.createElement("div", { key: key, style: textStyle, dangerouslySetInnerHTML: { __html: val } }));
                    }
                    return (React.createElement("div", { key: key, style: textStyle }, escapeHtml(val)));
                };
                if (Object.keys(fieldMapping).length === 0) {
                    return (React.createElement("div", { key: index, style: {
                            marginBottom: 16,
                            borderBottom: index < previewItems.length - 1 ? '1px solid #eee' : 'none',
                            paddingBottom: 16,
                        } }, Object.entries(item).map(([k, v]) => (React.createElement("div", { key: k, style: { marginBottom: 4 } }, escapeHtml(stringValue(v)))))));
                }
                const fieldNodes = [];
                let skipNext = false;
                mappingEntries.forEach(([fieldName, fieldType], i) => {
                    if (skipNext) {
                        skipNext = false;
                        return;
                    }
                    const val = stringValue(record[fieldName]);
                    if (fieldType === 'author') {
                        const next = mappingEntries[i + 1];
                        const nextIsDate = next && next[1] === 'date';
                        const dateVal = nextIsDate ? stringValue(record[next[0]]) : '';
                        const authorDateStyle = isGems
                            ? Object.assign(Object.assign({}, authorDateLineStyle), { color: gemsTextColor }) : authorDateLineStyle;
                        fieldNodes.push(React.createElement("div", { key: `author-date-${fieldName}`, style: authorDateStyle },
                            val && (React.createElement(React.Fragment, null,
                                React.createElement("span", { style: { fontWeight: 'bold' } }, escapeHtml(val)),
                                dateVal && (React.createElement(React.Fragment, null,
                                    React.createElement("span", { style: { margin: '0 8px' } }, "\u2022"),
                                    React.createElement("span", null, escapeHtml(dateVal)))))),
                            !val && dateVal && React.createElement("span", null, escapeHtml(dateVal))));
                        if (nextIsDate)
                            skipNext = true;
                    }
                    else if (fieldType === 'date') {
                        const authorDateStyle = isGems
                            ? Object.assign(Object.assign({}, authorDateLineStyle), { color: gemsTextColor }) : authorDateLineStyle;
                        if (val) {
                            fieldNodes.push(React.createElement("div", { key: fieldName, style: authorDateStyle },
                                React.createElement("span", null, escapeHtml(val))));
                        }
                    }
                    else {
                        const node = renderField(fieldName, fieldType, val, fieldName);
                        if (node != null)
                            fieldNodes.push(React.createElement(React.Fragment, { key: fieldName }, node));
                    }
                });
                return (React.createElement("div", { key: index, style: getItemWrapperStyle(index) }, fieldNodes));
            })));
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