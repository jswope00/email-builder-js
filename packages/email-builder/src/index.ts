export { default as renderToStaticMarkup } from './renderers/renderToStaticMarkup';
export { useXmlData, XmlDataProvider, type XmlDataMap } from './Reader/XmlDataContext';

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
