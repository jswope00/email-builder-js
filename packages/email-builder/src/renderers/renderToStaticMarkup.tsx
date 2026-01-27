import React from 'react';
import { renderToStaticMarkup as baseRenderToStaticMarkup } from 'react-dom/server';

import Reader, { TReaderDocument } from '../Reader/core';

type TOptions = {
  rootBlockId: string;
};

// Helper function to extract all XML URLs from a document
function extractXmlUrls(document: TReaderDocument): string[] {
  const urls: string[] = [];
  const visited = new Set<string>();

  function traverse(blockId: string) {
    if (visited.has(blockId)) return;
    visited.add(blockId);

    const block = document[blockId];
    if (!block) return;

    // Check if this is an XML block with a URL
    const props = block.data?.props;
    if (props?.url && typeof props.url === 'string' && props.url.trim()) {
      urls.push(props.url);
    }

    // Traverse children
    const childrenIds = block.data?.childrenIds;
    if (Array.isArray(childrenIds)) {
      childrenIds.forEach((childId) => {
        if (typeof childId === 'string') {
          traverse(childId);
        }
      });
    }

    // Traverse columns in ColumnsContainer
    const columns = props?.columns;
    if (Array.isArray(columns)) {
      columns.forEach((column: any) => {
        if (column?.childrenIds && Array.isArray(column.childrenIds)) {
          column.childrenIds.forEach((childId: string) => {
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
async function fetchXmlData(url: string): Promise<string> {
  try {
    // In Node.js environment, use node-fetch or similar
    // For browser environment, use fetch
    if (typeof fetch === 'function') {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`);
      }
      return await response.text();
    } else {
      // Node.js environment - try to use node:https or require node-fetch
      throw new Error('fetch is not available in this environment');
    }
  } catch (error) {
    console.error(`Error fetching XML from ${url}:`, error);
    return '';
  }
}

export default async function renderToStaticMarkup(
  document: TReaderDocument,
  { rootBlockId }: TOptions
): Promise<string> {
  // Extract all XML URLs from the document
  const xmlUrls = extractXmlUrls(document);

  // Fetch all XML data in parallel
  const xmlDataMap: Record<string, string> = {};
  await Promise.all(
    xmlUrls.map(async (url) => {
      const data = await fetchXmlData(url);
      if (data) {
        xmlDataMap[url] = data;
      }
    })
  );

  // Make XML data available globally for components that can't import the context
  // This is a workaround for components in separate packages
  if (typeof global !== 'undefined') {
    (global as any).__XML_DATA_CONTEXT__ = xmlDataMap;
  }

  const html = '<!DOCTYPE html>' +
    baseRenderToStaticMarkup(
      <html>
        <body>
          <Reader document={document} rootBlockId={rootBlockId} xmlData={xmlDataMap} />
        </body>
      </html>
    );

  // Clean up global
  if (typeof global !== 'undefined') {
    delete (global as any).__XML_DATA_CONTEXT__;
  }

  return html;
}
