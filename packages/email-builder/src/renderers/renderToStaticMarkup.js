var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { renderToStaticMarkup as baseRenderToStaticMarkup } from 'react-dom/server';
import Reader from '../Reader/core';
// Helper function to extract all XML URLs from a document
function extractXmlUrls(document) {
    const urls = [];
    const visited = new Set();
    function traverse(blockId) {
        var _a, _b;
        if (visited.has(blockId))
            return;
        visited.add(blockId);
        const block = document[blockId];
        if (!block)
            return;
        // Check if this is an XML block with a URL
        const props = (_a = block.data) === null || _a === void 0 ? void 0 : _a.props;
        if ((props === null || props === void 0 ? void 0 : props.url) && typeof props.url === 'string' && props.url.trim()) {
            urls.push(props.url);
        }
        // Traverse children
        const childrenIds = (_b = block.data) === null || _b === void 0 ? void 0 : _b.childrenIds;
        if (Array.isArray(childrenIds)) {
            childrenIds.forEach((childId) => {
                if (typeof childId === 'string') {
                    traverse(childId);
                }
            });
        }
        // Traverse columns in ColumnsContainer
        const columns = props === null || props === void 0 ? void 0 : props.columns;
        if (Array.isArray(columns)) {
            columns.forEach((column) => {
                if ((column === null || column === void 0 ? void 0 : column.childrenIds) && Array.isArray(column.childrenIds)) {
                    column.childrenIds.forEach((childId) => {
                        if (typeof childId === 'string') {
                            traverse(childId);
                        }
                    });
                }
            });
        }
    }
    Object.keys(document).forEach((key) => traverse(key));
    return [...new Set(urls)]; // Remove duplicates
}
// Helper function to fetch XML data
function fetchXmlData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // In Node.js environment, use node-fetch or similar
            // For browser environment, use fetch
            if (typeof fetch === 'function') {
                const response = yield fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${url}: ${response.status}`);
                }
                return yield response.text();
            }
            else {
                // Node.js environment - try to use node:https or require node-fetch
                throw new Error('fetch is not available in this environment');
            }
        }
        catch (error) {
            console.error(`Error fetching XML from ${url}:`, error);
            return '';
        }
    });
}
export default function renderToStaticMarkup(document_1, _a) {
    return __awaiter(this, arguments, void 0, function* (document, { rootBlockId }) {
        // Extract all XML URLs from the document
        const xmlUrls = extractXmlUrls(document);
        // Fetch all XML data in parallel
        const xmlDataMap = {};
        yield Promise.all(xmlUrls.map((url) => __awaiter(this, void 0, void 0, function* () {
            const data = yield fetchXmlData(url);
            if (data) {
                xmlDataMap[url] = data;
            }
        })));
        // Make XML data available globally for components that can't import the context
        // This is a workaround for components in separate packages
        // Support both Node.js (global) and browser (window) environments
        if (typeof global !== 'undefined') {
            global.__XML_DATA_CONTEXT__ = xmlDataMap;
        }
        if (typeof window !== 'undefined') {
            window.__XML_DATA_CONTEXT__ = xmlDataMap;
        }
        const html = '<!DOCTYPE html>' +
            baseRenderToStaticMarkup(React.createElement("html", null,
                React.createElement("body", null,
                    React.createElement(Reader, { document: document, rootBlockId: rootBlockId, xmlData: xmlDataMap }))));
        // Clean up global
        if (typeof global !== 'undefined') {
            delete global.__XML_DATA_CONTEXT__;
        }
        if (typeof window !== 'undefined') {
            delete window.__XML_DATA_CONTEXT__;
        }
        return html;
    });
}
//# sourceMappingURL=renderToStaticMarkup.js.map