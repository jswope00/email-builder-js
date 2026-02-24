import React from 'react';

import { Button } from '@mui/material';

import { resetDocument, setCurrentView } from '../../documents/editor/EditorContext';
import getConfiguration from '../../getConfiguration';

export default function SidebarButton({ href, children }: { href: string; children: JSX.Element | string }) {
  const handleClick = () => {
    setCurrentView('editor');
    resetDocument(getConfiguration(href));
  };
  return (
    <Button size="small" href={href} onClick={handleClick}>
      {children}
    </Button>
  );
}
