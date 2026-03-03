var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { XMLParser } from 'fast-xml-parser';
export const PromotedSurveyXmlPropsSchema = z.object({
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
        url: z.string().optional().nullable(),
        numberOfItems: z.number().min(1).max(20).optional().nullable(),
    })
        .optional()
        .nullable(),
});
export const PromotedSurveyXmlPropsDefaults = {
    url: '',
    numberOfItems: 3,
};
/** Parses XML string into SurveyItem[] — looks for item arrays (e.g. o.item or root array) and maps title/link/description. */
function parseSurveyXml(xmlText, numberOfItems) {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
        });
        const result = parser.parse(xmlText);
        //console.log('[PromotedSurveyXml] parseSurveyXml — raw parser result:', result);
        let foundItems = [];
        const findItems = (obj) => {
            if (foundItems.length > 0)
                return;
            if (Array.isArray(obj)) {
                const first = obj[0];
                if (first && typeof first === 'object' && (first.title || first.link || first.description)) {
                    foundItems = obj;
                    return;
                }
                for (const item of obj) {
                    findItems(item);
                }
            }
            else if (typeof obj === 'object' && obj !== null) {
                const o = obj;
                if (o.item && Array.isArray(o.item)) {
                    foundItems = o.item;
                    return;
                }
                if (o.item && typeof o.item === 'object') {
                    foundItems = [o.item];
                    return;
                }
                for (const key in o) {
                    findItems(o[key]);
                }
            }
        };
        findItems(result);
        const mappedItems = foundItems.map((item) => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                title: String((_b = (_a = item.title) !== null && _a !== void 0 ? _a : item.name) !== null && _b !== void 0 ? _b : ''),
                link: String((_d = (_c = item.link) !== null && _c !== void 0 ? _c : item.url) !== null && _d !== void 0 ? _d : ''),
                description: String((_f = (_e = item.description) !== null && _e !== void 0 ? _e : item.body) !== null && _f !== void 0 ? _f : ''),
            });
        });
        return mappedItems.slice(0, numberOfItems);
    }
    catch (err) {
        console.error('Failed to parse survey XML:', err);
        return [];
    }
}
export function PromotedSurveyXml({ style, props: propsData }) {
    var _a, _b;
    const url = (_a = propsData === null || propsData === void 0 ? void 0 : propsData.url) !== null && _a !== void 0 ? _a : PromotedSurveyXmlPropsDefaults.url;
    const numberOfItems = (_b = propsData === null || propsData === void 0 ? void 0 : propsData.numberOfItems) !== null && _b !== void 0 ? _b : PromotedSurveyXmlPropsDefaults.numberOfItems;
    let preFetchedXmlText = null;
    try {
        if (url) {
            const contextData = (typeof global !== 'undefined' ? global.__XML_DATA_CONTEXT__ : undefined) ||
                (typeof window !== 'undefined' ? window.__XML_DATA_CONTEXT__ : undefined);
            if (contextData && contextData[url]) {
                preFetchedXmlText = contextData[url];
            }
        }
    }
    catch (_c) {
        // Context not available
    }
    const preFetchedItems = preFetchedXmlText ? parseSurveyXml(preFetchedXmlText, numberOfItems) : null;
    const [items, setItems] = useState(preFetchedItems !== null && preFetchedItems !== void 0 ? preFetchedItems : []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (preFetchedItems)
            return;
        if (!url) {
            setItems([]);
            return;
        }
        const fetchData = () => __awaiter(this, void 0, void 0, function* () {
            setLoading(true);
            setError(null);
            try {
                const response = yield fetch(url);
                if (!response.ok)
                    throw new Error(`Status: ${response.status}`);
                const text = yield response.text();
                //console.log('[PromotedSurveyXml] Fetched raw response (length):', text.length, 'preview:', text.slice(0, 200));
                // Parsing happens here — parseSurveyXml turns XML string into SurveyItem[]
                const parsed = parseSurveyXml(text, numberOfItems);
                //console.log('[PromotedSurveyXml] Parsed items after fetch:', parsed);
                setItems(parsed);
            }
            catch (err) {
                setError('Failed to load data');
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        });
        fetchData();
    }, [url, numberOfItems, preFetchedItems]);
    const padding = style === null || style === void 0 ? void 0 : style.padding;
    const wrapperStyle = {
        padding: padding ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px` : undefined,
        fontFamily: 'sans-serif',
    };
    if (!url) {
        return (React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { border: '1px dashed #ccc', textAlign: 'center', padding: '20px', color: '#666' }) }, "Configure Promoted Survey XML URL \u2014 use the right panel to enter the XML feed URL."));
    }
    if (loading)
        return (React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { textAlign: 'center', padding: '20px' }) }, "Loading survey..."));
    if (error)
        return (React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { color: 'red', textAlign: 'center', padding: '20px' }) },
            "Error: ",
            error));
    if (items.length === 0)
        return (React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { textAlign: 'center', padding: '20px' }) }, "No survey items found."));
    return (React.createElement("div", { style: wrapperStyle },
        React.createElement("h2", { style: {
                fontSize: '18px',
                margin: '0 0 16px 0',
                color: '#333',
                textTransform: 'uppercase',
                borderLeft: '4px solid #1585fe',
                paddingLeft: '10px',
                lineHeight: '1.2',
            } }, "Promoted Survey"),
        items.map((item, index) => (React.createElement("div", { key: index, style: {
                marginBottom: 16,
                borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none',
                paddingBottom: 16,
            } },
            item.link ? (React.createElement("a", { href: item.link, target: "_blank", rel: "noopener noreferrer", style: { textDecoration: 'none', color: 'inherit', display: 'block' } },
                React.createElement("h3", { style: { margin: '0 0 8px 0', fontSize: '16px', lineHeight: '1.4', color: '#1585fe' } }, item.title))) : (React.createElement("h3", { style: { margin: '0 0 8px 0', fontSize: '16px', lineHeight: '1.4', color: '#333' } }, item.title)),
            item.description && (React.createElement("p", { style: { margin: 0, fontSize: '14px', lineHeight: '1.5', color: '#666' } }, item.description)))))));
}
//# sourceMappingURL=index.js.map