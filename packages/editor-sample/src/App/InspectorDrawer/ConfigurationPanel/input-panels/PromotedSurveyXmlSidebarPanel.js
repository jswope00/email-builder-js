import React, { useState } from 'react';
import { PromotedSurveyXmlPropsDefaults, PromotedSurveyXmlPropsSchema, } from '@nattusia/block-email-survey-xml';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
export default function PromotedSurveyXmlSidebarPanel({ data, setData, }) {
    var _a, _b, _c, _d, _e, _f;
    const [, setErrors] = useState(null);
    // Normalize so we always have props (like VideoXmlSidebarPanel / DailyDownloadXmlSidebarPanel)
    const safeData = {
        style: (_a = data === null || data === void 0 ? void 0 : data.style) !== null && _a !== void 0 ? _a : null,
        props: (_b = data === null || data === void 0 ? void 0 : data.props) !== null && _b !== void 0 ? _b : { url: PromotedSurveyXmlPropsDefaults.url, numberOfItems: PromotedSurveyXmlPropsDefaults.numberOfItems },
    };
    const updateData = (d) => {
        const res = PromotedSurveyXmlPropsSchema.safeParse(d);
        if (res.success) {
            setData(res.data);
            setErrors(null);
        }
        else {
            setErrors(res.error);
        }
    };
    const url = (_d = (_c = safeData.props) === null || _c === void 0 ? void 0 : _c.url) !== null && _d !== void 0 ? _d : PromotedSurveyXmlPropsDefaults.url;
    const numberOfItems = (_f = (_e = safeData.props) === null || _e === void 0 ? void 0 : _e.numberOfItems) !== null && _f !== void 0 ? _f : PromotedSurveyXmlPropsDefaults.numberOfItems;
    return (React.createElement(BaseSidebarPanel, { title: "Promoted Survey XML Block" },
        React.createElement(TextInput, { label: "XML URL", placeholder: "https://example.com/survey.xml", defaultValue: url !== null && url !== void 0 ? url : '', onChange: (v) => updateData(Object.assign(Object.assign({}, safeData), { props: Object.assign(Object.assign({}, safeData.props), { url: v }) })) }),
        React.createElement(TextInput, { label: "Number of items", defaultValue: String(numberOfItems !== null && numberOfItems !== void 0 ? numberOfItems : PromotedSurveyXmlPropsDefaults.numberOfItems), onChange: (v) => {
                const num = parseInt(v, 10);
                if (!isNaN(num)) {
                    updateData(Object.assign(Object.assign({}, safeData), { props: Object.assign(Object.assign({}, safeData.props), { numberOfItems: num }) }));
                }
            } }),
        React.createElement(MultiStylePropertyPanel, { names: ['padding'], value: safeData.style, onChange: (style) => updateData(Object.assign(Object.assign({}, safeData), { style })) })));
}
//# sourceMappingURL=PromotedSurveyXmlSidebarPanel.js.map