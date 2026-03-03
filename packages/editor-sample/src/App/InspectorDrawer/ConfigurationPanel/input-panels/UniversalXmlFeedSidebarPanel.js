var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useRef, useState } from 'react';
import { Box, Button, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, } from '@mui/material';
import { BLOCK_TYPE_OPTIONS, FIELD_TYPE_OPTIONS, parseXmlToFieldNames, parseXmlToItems, UniversalXmlFeedPropsDefaults, UniversalXmlFeedPropsSchema, } from '@nattusia/block-xml-feed';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
export default function UniversalXmlFeedSidebarPanel({ data, setData, }) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const [, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [parseLoading, setParseLoading] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const [parseError, setParseError] = useState(null);
    const [loadedFieldNames, setLoadedFieldNames] = useState([]);
    const urlInputRef = useRef('');
    const safeData = {
        style: (_a = data === null || data === void 0 ? void 0 : data.style) !== null && _a !== void 0 ? _a : null,
        props: (_b = data === null || data === void 0 ? void 0 : data.props) !== null && _b !== void 0 ? _b : {
            blockType: UniversalXmlFeedPropsDefaults.blockType,
            url: UniversalXmlFeedPropsDefaults.url,
            fieldMapping: UniversalXmlFeedPropsDefaults.fieldMapping,
        },
    };
    const updateData = (d) => {
        const res = UniversalXmlFeedPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    const blockType = (_d = (_c = safeData.props) === null || _c === void 0 ? void 0 : _c.blockType) !== null && _d !== void 0 ? _d : UniversalXmlFeedPropsDefaults.blockType;
    const url = (_f = (_e = safeData.props) === null || _e === void 0 ? void 0 : _e.url) !== null && _f !== void 0 ? _f : UniversalXmlFeedPropsDefaults.url;
    const fieldMapping = (_h = (_g = safeData.props) === null || _g === void 0 ? void 0 : _g.fieldMapping) !== null && _h !== void 0 ? _h : UniversalXmlFeedPropsDefaults.fieldMapping;
    urlInputRef.current = url !== null && url !== void 0 ? url : '';
    const handleLoad = () => __awaiter(this, void 0, void 0, function* () {
        const urlToFetch = (urlInputRef.current || url || '').trim();
        if (!urlToFetch) {
            setLoadError('Enter a URL first.');
            return;
        }
        setLoadError(null);
        setLoading(true);
        try {
            const response = yield fetch(urlToFetch);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const text = yield response.text();
            const names = parseXmlToFieldNames(text);
            setLoadedFieldNames(names);
            // Initialize fieldMapping for new fields with default type "text"
            const nextMapping = Object.assign({}, fieldMapping);
            names.forEach((name) => {
                if (nextMapping[name] == null)
                    nextMapping[name] = 'text';
            });
            updateData(Object.assign(Object.assign({}, safeData), { props: Object.assign(Object.assign({}, safeData.props), { fieldMapping: nextMapping }) }));
        }
        catch (err) {
            setLoadError(err instanceof Error ? err.message : 'Failed to load URL.');
        }
        finally {
            setLoading(false);
        }
    });
    const handleParseAndShow = () => __awaiter(this, void 0, void 0, function* () {
        const urlToFetch = (urlInputRef.current || url || '').trim();
        if (!urlToFetch) {
            setParseError('Enter a URL first.');
            return;
        }
        setParseError(null);
        setParseLoading(true);
        try {
            const response = yield fetch(urlToFetch);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const text = yield response.text();
            const items = parseXmlToItems(text);
            updateData(Object.assign(Object.assign({}, safeData), { props: Object.assign(Object.assign({}, safeData.props), { url: urlToFetch, previewItems: items }) }));
        }
        catch (err) {
            setParseError(err instanceof Error ? err.message : 'Failed to parse XML.');
        }
        finally {
            setParseLoading(false);
        }
    });
    const tableRows = loadedFieldNames.length > 0 ? loadedFieldNames : Object.keys(fieldMapping !== null && fieldMapping !== void 0 ? fieldMapping : {});
    const canParseAndShow = (urlInputRef.current || url || '').trim().length > 0;
    return (React.createElement(BaseSidebarPanel, { title: "Universal XML Feed Block" },
        React.createElement(TextField, { select: true, fullWidth: true, variant: "standard", label: "Block type", value: blockType !== null && blockType !== void 0 ? blockType : '', onChange: (ev) => updateData(Object.assign(Object.assign({}, safeData), { props: Object.assign(Object.assign({}, safeData.props), { blockType: ev.target.value }) })) }, BLOCK_TYPE_OPTIONS.map((opt) => (React.createElement(MenuItem, { key: opt.value, value: opt.value }, opt.label)))),
        React.createElement(Box, { sx: { display: 'flex', gap: 1, alignItems: 'flex-start' } },
            React.createElement(TextInput, { label: "URL", placeholder: "https://example.com/feed.xml", defaultValue: url !== null && url !== void 0 ? url : '', onChange: (v) => {
                    urlInputRef.current = v;
                    updateData(Object.assign(Object.assign({}, safeData), { props: Object.assign(Object.assign({}, safeData.props), { url: v }) }));
                } }),
            React.createElement(Button, { variant: "outlined", size: "small", onClick: handleLoad, disabled: loading, sx: { mt: 2, minWidth: 90 } }, loading ? 'Loading…' : 'Load')),
        loadError && (React.createElement(Box, { sx: { color: 'error.main', fontSize: '0.875rem' } }, loadError)),
        tableRows.length > 0 && (React.createElement(Box, { sx: { overflowX: 'auto' } },
            React.createElement(Table, { size: "small", padding: "none" },
                React.createElement(TableHead, null,
                    React.createElement(TableRow, null,
                        React.createElement(TableCell, { sx: { fontWeight: 600 } }, "Field name"),
                        React.createElement(TableCell, { sx: { fontWeight: 600 } }, "Type"))),
                React.createElement(TableBody, null, tableRows.map((name) => {
                    var _a;
                    return (React.createElement(TableRow, { key: name },
                        React.createElement(TableCell, { sx: { fontFamily: 'monospace' } }, name),
                        React.createElement(TableCell, null,
                            React.createElement(TextField, { select: true, size: "small", variant: "standard", value: (_a = fieldMapping === null || fieldMapping === void 0 ? void 0 : fieldMapping[name]) !== null && _a !== void 0 ? _a : 'text', onChange: (ev) => {
                                    const next = Object.assign(Object.assign({}, (fieldMapping !== null && fieldMapping !== void 0 ? fieldMapping : {})), { [name]: ev.target.value });
                                    updateData(Object.assign(Object.assign({}, safeData), { props: Object.assign(Object.assign({}, safeData.props), { fieldMapping: next }) }));
                                }, sx: { minWidth: 100 } }, FIELD_TYPE_OPTIONS.map((opt) => (React.createElement(MenuItem, { key: opt.value, value: opt.value }, opt.label)))))));
                }))))),
        React.createElement(Button, { variant: "contained", size: "medium", onClick: handleParseAndShow, disabled: !canParseAndShow || parseLoading, fullWidth: true }, parseLoading ? 'Parsing…' : 'Parse & show'),
        parseError && (React.createElement(Box, { sx: { color: 'error.main', fontSize: '0.875rem' } }, parseError)),
        React.createElement(MultiStylePropertyPanel, { names: ['padding'], value: safeData.style, onChange: (style) => updateData(Object.assign(Object.assign({}, safeData), { style })) })));
}
//# sourceMappingURL=UniversalXmlFeedSidebarPanel.js.map