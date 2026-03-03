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
export const NewsPanelXmlPropsSchema = z.object({
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
export const NewsPanelXmlPropsDefaults = {
    url: '',
    title: '',
    numberOfItems: 3,
};
// Helper function to extract date from created_1 field
const extractDate = (created) => {
    if (!created)
        return '';
    const match = created.match(/>([^<]+)<\/time>/);
    if (match && match[1]) {
        return match[1];
    }
    return created;
};
// Helper function to extract author from field_full_name (may contain HTML)
const extractAuthor = (fullName) => {
    if (!fullName)
        return '';
    // Strip HTML tags
    const text = fullName.replace(/<[^>]*>?/gm, '');
    return text.trim();
};
// Helper function to parse field_links HTML and extract link items
const parseLinks = (linksHtml) => {
    if (!linksHtml)
        return [];
    const links = [];
    // Match <a href="..." target="...">text</a> patterns
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    let match;
    while ((match = linkRegex.exec(linksHtml)) !== null) {
        links.push({
            href: match[1],
            text: match[2].replace(/<[^>]*>?/gm, '').trim(),
        });
    }
    return links;
};
// Extract XML parsing logic so it can be used both synchronously (SSR) and asynchronously (client)
function parseNewsPanelXml(xmlText, numberOfItems) {
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
                if (first && (first.title || first.field_media_image || first.nid || first.type)) {
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
            const itemType = item.type || '';
            const createdDate = extractDate(item.created_1 || '');
            if (itemType.toLowerCase() === 'article') {
                const author = extractAuthor(item.field_full_name || '');
                const showAuthor = item.field_show_author == 1 || item.field_show_author === '1';
                return {
                    type: 'Article',
                    title: item.title || '',
                    author: author,
                    createdDate: createdDate,
                    image: item.field_media_image || '',
                    body: item.body || '',
                    viewNode: item.view_node || '',
                    showAuthor: showAuthor,
                };
            }
            else {
                const image = item.field_tweet_external_image || item.field_social_author_image1 || '';
                const links = parseLinks(item.field_links || '');
                return {
                    type: 'Tweet',
                    image: image,
                    tweetContent: item.field_tweet_content || '',
                    links: links,
                    authorName: item.field_social_author_name || '',
                    createdDate: createdDate,
                    tweetId: item.field_tweet_id || '',
                };
            }
        });
        return mappedItems.slice(0, numberOfItems);
    }
    catch (err) {
        console.error('Failed to parse news panel XML:', err);
        return [];
    }
}
export function NewsPanelXml({ style, props }) {
    var _a, _b, _c;
    const url = (_a = props === null || props === void 0 ? void 0 : props.url) !== null && _a !== void 0 ? _a : NewsPanelXmlPropsDefaults.url;
    const title = (_b = props === null || props === void 0 ? void 0 : props.title) !== null && _b !== void 0 ? _b : NewsPanelXmlPropsDefaults.title;
    const numberOfItems = (_c = props === null || props === void 0 ? void 0 : props.numberOfItems) !== null && _c !== void 0 ? _c : NewsPanelXmlPropsDefaults.numberOfItems;
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
    const preFetchedItems = preFetchedXmlText ? parseNewsPanelXml(preFetchedXmlText, numberOfItems) : null;
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
                const parsedItems = parseNewsPanelXml(text, numberOfItems);
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
        return React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { border: '1px dashed #ccc', textAlign: 'center', padding: '20px' }) }, "Configure News Panel XML URL");
    }
    if (loading)
        return React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { textAlign: 'center', padding: '20px' }) }, "Loading news...");
    if (error)
        return React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { color: 'red', textAlign: 'center', padding: '20px' }) },
            "Error: ",
            error);
    if (items.length === 0)
        return React.createElement("div", { style: Object.assign(Object.assign({}, wrapperStyle), { textAlign: 'center', padding: '20px' }) }, "No news items found.");
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
        items.map((item, index) => {
            if (item.type === 'Article') {
                // Render Article
                return (React.createElement("div", { key: index, style: { marginBottom: 24, paddingBottom: 16, borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none' } },
                    React.createElement("table", { width: "100%", cellPadding: "0", cellSpacing: "0", style: { borderCollapse: 'collapse' } },
                        React.createElement("tbody", null,
                            React.createElement("tr", null,
                                item.image && (React.createElement("td", { width: "160", valign: "top", style: { paddingRight: 16, paddingBottom: 0 } }, item.viewNode ? (React.createElement("a", { href: item.viewNode, target: "_blank", style: { textDecoration: 'none', color: 'inherit', display: 'block' } },
                                    React.createElement("img", { src: item.image, alt: item.title, width: "160", style: { width: '160px', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 } }))) : (React.createElement("img", { src: item.image, alt: item.title, width: "160", style: { width: '160px', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 } })))),
                                React.createElement("td", { valign: "top", style: { paddingBottom: 0 } },
                                    item.viewNode ? (React.createElement("a", { href: item.viewNode, target: "_blank", style: { textDecoration: 'none', color: 'inherit' } },
                                        React.createElement("h3", { style: { margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4', color: '#333' } }, item.title))) : (React.createElement("h3", { style: { margin: '0 0 8px 0', fontSize: '18px', lineHeight: '1.4' } }, item.title)),
                                    React.createElement("div", { style: { fontSize: '12px', color: '#666', marginBottom: '8px' } },
                                        item.showAuthor && item.author && (React.createElement(React.Fragment, null,
                                            React.createElement("span", { style: { fontWeight: 'bold' } }, item.author),
                                            item.createdDate && (React.createElement(React.Fragment, null,
                                                React.createElement("span", { style: { margin: '0 8px' } }, "\u2022"),
                                                React.createElement("span", null, item.createdDate))))),
                                        !item.showAuthor && item.createdDate && (React.createElement("span", null, item.createdDate))),
                                    item.body && (React.createElement("div", { style: { fontSize: '14px', lineHeight: '1.5', color: '#666' } }, item.body.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>?/gm, '')))))))));
            }
            else {
                // Render Tweet
                return (React.createElement("div", { key: index, style: { marginBottom: 24, paddingBottom: 16, borderBottom: index < items.length - 1 ? '1px solid #eee' : 'none' } },
                    React.createElement("table", { width: "100%", cellPadding: "0", cellSpacing: "0", style: { borderCollapse: 'collapse' } },
                        React.createElement("tbody", null,
                            React.createElement("tr", null,
                                item.image && (React.createElement("td", { width: "160", valign: "top", style: { paddingRight: 16, paddingBottom: 0 } }, item.tweetId ? (React.createElement("a", { href: item.tweetId, target: "_blank", style: { textDecoration: 'none', color: 'inherit', display: 'block' } },
                                    React.createElement("img", { src: item.image, alt: "Tweet", width: "160", style: { width: '160px', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 } }))) : (React.createElement("img", { src: item.image, alt: "Tweet", width: "160", style: { width: '160px', maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 4 } })))),
                                React.createElement("td", { valign: "top", style: { paddingBottom: 0 } },
                                    item.tweetId ? (React.createElement("a", { href: item.tweetId, target: "_blank", style: { textDecoration: 'none', color: 'inherit' } },
                                        React.createElement("div", { style: { fontSize: '14px', lineHeight: '1.5', color: '#666', marginBottom: 12 } }, item.tweetContent.replace(/<!\[CDATA\[|\]\]>/g, '')))) : (React.createElement("div", { style: { fontSize: '14px', lineHeight: '1.5', color: '#666', marginBottom: 12 } }, item.tweetContent.replace(/<!\[CDATA\[|\]\]>/g, ''))),
                                    item.links.length > 0 && (React.createElement("div", { style: { marginBottom: 12 } }, item.links.map((link, linkIndex) => (React.createElement("div", { key: linkIndex, style: { marginBottom: 8 } },
                                        React.createElement("a", { href: link.href, target: "_blank", style: { color: '#1585fe', textDecoration: 'none', fontSize: '14px' } }, link.text || link.href)))))),
                                    React.createElement("div", { style: { fontSize: '12px', color: '#666' } },
                                        React.createElement("img", { src: "https://rkrn-images.s3.us-east-1.amazonaws.com/x_logo.png", alt: "Twitter/X", width: "14", height: "14", style: {
                                                width: '14px',
                                                height: '14px',
                                                display: 'inline-block',
                                                verticalAlign: 'middle',
                                                marginRight: '6px'
                                            } }),
                                        item.authorName && (React.createElement(React.Fragment, null,
                                            React.createElement("span", { style: { fontWeight: 'bold' } }, item.authorName),
                                            item.createdDate && (React.createElement(React.Fragment, null,
                                                React.createElement("span", { style: { margin: '0 8px' } }, "\u2022"),
                                                React.createElement("span", null, item.createdDate))))),
                                        !item.authorName && item.createdDate && (React.createElement("span", null, item.createdDate)))))))));
            }
        })));
}
//# sourceMappingURL=index.js.map