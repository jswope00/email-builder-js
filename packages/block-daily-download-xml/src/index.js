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
export const DailyDownloadXmlPropsSchema = z.object({
    style: z.object({
        padding: z.object({
            top: z.number(),
            bottom: z.number(),
            right: z.number(),
            left: z.number(),
        }).optional().nullable(),
    }).optional().nullable(),
    props: z.object({
        url: z.string().optional().nullable(),
        title: z.string().optional().nullable(),
        numberOfItems: z.number().min(1).max(10).optional().nullable(),
    }).optional().nullable(),
});
export const DailyDownloadXmlPropsDefaults = {
    url: '',
    title: '',
    numberOfItems: 3,
};
// Extract XML parsing logic so it can be used both synchronously (SSR) and asynchronously (client)
function parseDailyDownloadXml(xmlText, numberOfItems) {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@_"
        });
        const result = parser.parse(xmlText);
        let foundItems = [];
        const findItems = (obj) => {
            if (foundItems.length > 0)
                return;
            if (Array.isArray(obj)) {
                const first = obj[0];
                if (first && (first.title || first.thumbnail__target_id || first.view_node || first.nid)) {
                    foundItems = obj;
                    return;
                }
                for (const item of obj) {
                    findItems(item);
                }
            }
            else if (typeof obj === 'object' && obj !== null) {
                if (obj.item && Array.isArray(obj.item)) {
                    foundItems = obj.item;
                    return;
                }
                if (obj.item && typeof obj.item === 'object') {
                    foundItems = [obj.item];
                    return;
                }
                for (const key in obj) {
                    findItems(obj[key]);
                }
            }
        };
        findItems(result);
        const mappedItems = foundItems.map((item) => {
            return {
                title: item.title || '',
                image: item.thumbnail__target_id || '',
                viewNode: item.view_node || '',
            };
        });
        return mappedItems.slice(0, numberOfItems);
    }
    catch (err) {
        console.error('Failed to parse daily download XML:', err);
        return [];
    }
}
export function DailyDownloadXml({ style, props }) {
    var _a, _b, _c;
    const url = (_a = props === null || props === void 0 ? void 0 : props.url) !== null && _a !== void 0 ? _a : DailyDownloadXmlPropsDefaults.url;
    const title = (_b = props === null || props === void 0 ? void 0 : props.title) !== null && _b !== void 0 ? _b : DailyDownloadXmlPropsDefaults.title;
    const numberOfItems = (_c = props === null || props === void 0 ? void 0 : props.numberOfItems) !== null && _c !== void 0 ? _c : DailyDownloadXmlPropsDefaults.numberOfItems;
    // Try to get pre-fetched XML data from context
    // The renderToStaticMarkup function fetches XML data and makes it available globally
    // Supports both Node.js (global) and browser (window) environments
    let preFetchedXmlText = null;
    try {
        if (url) {
            // Check global (Node.js) first, then window (browser)
            const contextData = (typeof global !== 'undefined' ? global.__XML_DATA_CONTEXT__ : undefined) ||
                (typeof window !== 'undefined' ? window.__XML_DATA_CONTEXT__ : undefined);
            if (contextData && contextData[url]) {
                preFetchedXmlText = contextData[url];
            }
        }
    }
    catch (_d) {
        // Context not available, will use useEffect fallback
    }
    // Parse pre-fetched data synchronously if available
    const preFetchedItems = preFetchedXmlText ? parseDailyDownloadXml(preFetchedXmlText, numberOfItems) : null;
    const [items, setItems] = useState(preFetchedItems || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        // Skip fetching if we already have pre-fetched data
        if (preFetchedItems) {
            return;
        }
        if (!url) {
            setItems([]);
            return;
        }
        const fetchData = () => __awaiter(this, void 0, void 0, function* () {
            setLoading(true);
            setError(null);
            try {
                const response = yield fetch(url);
                if (!response.ok) {
                    throw new Error(`Status: ${response.status}`);
                }
                const text = yield response.text();
                const parsedItems = parseDailyDownloadXml(text, numberOfItems);
                setItems(parsedItems);
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
        return React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { border: '1px dashed #ccc', textAlign: 'center', padding: '20px' }) }, "Configure Daily Download XML URL");
    }
    if (loading)
        return React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { textAlign: 'center', padding: '20px' }) }, "Loading downloads...");
    if (error)
        return React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { color: 'red', textAlign: 'center', padding: '20px' }) },
            "Error: ",
            error);
    if (items.length === 0)
        return React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { textAlign: 'center', padding: '20px' }) }, "No downloads found.");
    return (React.createElement("div", { style: wrapperStyle },
        title && (React.createElement("h2", { style: {
                fontSize: '18px',
                marginBottom: '12px',
                color: '#333',
                textTransform: 'uppercase',
                borderLeft: '4px solid #1585fe',
                paddingLeft: '10px',
                lineHeight: '1.2',
                margin: '0 0 16px 0',
            } }, title)),
        items.map((item, index) => (React.createElement("div", { key: index, style: { marginBottom: 24, paddingBottom: 16, borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none' } },
            item.viewNode ? (React.createElement("a", { href: item.viewNode, target: "_blank", style: { textDecoration: 'none', color: 'inherit', display: 'block' } },
                item.image && (React.createElement("img", { src: item.image, alt: item.title, style: { width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 } })),
                React.createElement("h3", { style: { margin: '0 0 12px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' } }, item.title))) : (React.createElement(React.Fragment, null,
                item.image && (React.createElement("img", { src: item.image, alt: item.title, style: { width: '100%', maxWidth: '100%', height: 'auto', display: 'block', marginBottom: 12, borderRadius: 4 } })),
                React.createElement("h3", { style: { margin: '0 0 12px 0', fontSize: '18px', lineHeight: '1.4' } }, item.title))),
            item.viewNode && (React.createElement("a", { href: item.viewNode, target: "_blank", style: {
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#1585fe',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'center'
                } }, "Download")))))));
}
//# sourceMappingURL=index.js.map