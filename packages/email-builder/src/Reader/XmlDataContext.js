import React, { createContext, useContext } from 'react';
const XmlDataContext = createContext({});
export function useXmlData() {
    return useContext(XmlDataContext);
}
export function XmlDataProvider({ data, children }) {
    return React.createElement(XmlDataContext.Provider, { value: data }, children);
}
//# sourceMappingURL=XmlDataContext.js.map