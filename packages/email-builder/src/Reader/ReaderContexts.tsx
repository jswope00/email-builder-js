import { createContext, useContext } from 'react';

/** Matches `Reader` document shape enough for tree walks and block lookup. */
export type ReaderDocumentShape = Record<string, { type: string; data?: unknown }>;

export const ReaderContext = createContext<ReaderDocumentShape>({});

export const RootBlockIdContext = createContext<string>('root');

export function useReaderDocument() {
  return useContext(ReaderContext);
}

export function useRootBlockId() {
  return useContext(RootBlockIdContext);
}
