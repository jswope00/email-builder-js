import React, { useEffect, useState } from 'react';

import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import { useDocument } from '../../documents/editor/EditorContext';

import HighlightedCodePanel from './helper/HighlightedCodePanel';

export default function HtmlPanel() {
  const document = useDocument();
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    
    renderToStaticMarkup(document, { rootBlockId: 'root' }).then((html) => {
      if (!cancelled) {
        setCode(html);
      }
    }).catch((error) => {
      console.error('Error rendering HTML:', error);
      if (!cancelled) {
        setCode('<!DOCTYPE html><html><body><p>Error rendering HTML. Check console for details.</p></body></html>');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [document]);

  if (!code) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Loading HTML...</div>;
  }

  return <HighlightedCodePanel type="html" value={code} />;
}
