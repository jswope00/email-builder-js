export { default as renderToStaticMarkup } from './renderers/renderToStaticMarkup';
export { useXmlData, XmlDataProvider, type XmlDataMap } from './Reader/XmlDataContext';

export { useReaderDocument, useRootBlockId, type ReaderDocumentShape } from './Reader/ReaderContexts';

export { default as EmailBuildingEnvironment } from './Reader/EmailBuildingEnvironment';
export type { EmailBuildingEnvironmentProps } from './Reader/EmailBuildingEnvironment';

export { default as HeadingReader } from './blocks/Heading/HeadingReader';

export {
  ReaderBlockSchema,
  TReaderBlock,
  //
  ReaderDocumentSchema,
  TReaderDocument,
  //
  ReaderBlock,
  TReaderBlockProps,
  //
  TReaderProps,
  default as Reader,
} from './Reader/core';
