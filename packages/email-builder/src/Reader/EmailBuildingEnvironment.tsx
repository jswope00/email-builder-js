import React from 'react';

import { ReaderContext, RootBlockIdContext, type ReaderDocumentShape } from './ReaderContexts';
import { XmlDataProvider, type XmlDataMap } from './XmlDataContext';

export type EmailBuildingEnvironmentProps = {
  document: ReaderDocumentShape;
  rootBlockId: string;
  xmlData?: XmlDataMap;
  children: React.ReactNode;
};

/**
 * Provides the same document / XML context as `Reader`, without rendering the document tree.
 * Use around editor canvases that render blocks which rely on heading wildcards (`HeadingReader`).
 */
export default function EmailBuildingEnvironment({
  document,
  rootBlockId,
  xmlData = {},
  children,
}: EmailBuildingEnvironmentProps) {
  return (
    <ReaderContext.Provider value={document}>
      <RootBlockIdContext.Provider value={rootBlockId}>
        <XmlDataProvider data={xmlData}>{children}</XmlDataProvider>
      </RootBlockIdContext.Provider>
    </ReaderContext.Provider>
  );
}
