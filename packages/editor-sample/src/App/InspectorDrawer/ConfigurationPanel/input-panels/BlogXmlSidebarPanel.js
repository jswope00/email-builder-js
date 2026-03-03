import React, { useState } from 'react';
import { BlogXmlPropsDefaults, BlogXmlPropsSchema } from '@usewaypoint/block-blog-xml';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
export default function BlogXmlSidebarPanel({ data, setData }) {
    var _a, _b, _c, _d, _e, _f;
    const [, setErrors] = useState(null);
    const updateData = (d) => {
        const res = BlogXmlPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    const url = (_b = (_a = data.props) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : BlogXmlPropsDefaults.url;
    const title = (_d = (_c = data.props) === null || _c === void 0 ? void 0 : _c.title) !== null && _d !== void 0 ? _d : BlogXmlPropsDefaults.title;
    const numberOfItems = (_f = (_e = data.props) === null || _e === void 0 ? void 0 : _e.numberOfItems) !== null && _f !== void 0 ? _f : BlogXmlPropsDefaults.numberOfItems;
    return (React.createElement(BaseSidebarPanel, { title: "Blog XML Block" },
        React.createElement(TextInput, { label: "Title (optional)", defaultValue: title, onChange: (v) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { title: v }) })) }),
        React.createElement(TextInput, { label: "XML URL", defaultValue: url, onChange: (v) => updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { url: v }) })) }),
        React.createElement(TextInput, { label: "Number of items", defaultValue: numberOfItems.toString(), onChange: (v) => {
                const num = parseInt(v, 10);
                if (!isNaN(num)) {
                    updateData(Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { numberOfItems: num }) }));
                }
            } }),
        React.createElement(MultiStylePropertyPanel, { names: ['padding'], value: data.style, onChange: (style) => updateData(Object.assign(Object.assign({}, data), { style })) })));
}
//# sourceMappingURL=BlogXmlSidebarPanel.js.map