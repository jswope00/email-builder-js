import React, { createContext, useContext } from 'react';

export type XmlDataMap = Record<string, string>;

const XmlDataContext = createContext<XmlDataMap>({});

export function useXmlData() {
  return useContext(XmlDataContext);
}

export function XmlDataProvider({ data, children }: { data: XmlDataMap; children: React.ReactNode }) {
  return <XmlDataContext.Provider value={data}>{children}</XmlDataContext.Provider>;
}
