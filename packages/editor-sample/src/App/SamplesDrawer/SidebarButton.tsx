import React from 'react';

import { Button } from '@mui/material';

import { resetDocument, setCurrentView } from '../../documents/editor/EditorContext';
import getConfiguration from '../../getConfiguration';

export default function SidebarButton({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: JSX.Element | string;
  onNavigate?: () => void;
}) {
  const handleClick = () => {
    setCurrentView('editor');
    resetDocument(getConfiguration(href));
    onNavigate?.();
  };
  return (
    <Button size="small" href={href} onClick={handleClick}>
      {children}
    </Button>
  );
}
