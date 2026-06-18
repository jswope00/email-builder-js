import React from 'react';

import { CloseOutlined, FirstPageOutlined, MenuOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { toggleSamplesDrawerOpen, useSamplesDrawerOpen } from '../../documents/editor/EditorContext';

import { useIsMobileNav } from './useMobileNav';

function useIcon() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const isMobileNav = useIsMobileNav();
  if (samplesDrawerOpen) {
    return isMobileNav ? <CloseOutlined fontSize="small" /> : <FirstPageOutlined fontSize="small" />;
  }
  return <MenuOutlined fontSize="small" />;
}

export default function ToggleSamplesPanelButton() {
  const icon = useIcon();
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const isMobileNav = useIsMobileNav();

  return (
    <IconButton
      onClick={toggleSamplesDrawerOpen}
      aria-label={samplesDrawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={isMobileNav ? samplesDrawerOpen : undefined}
    >
      {icon}
    </IconButton>
  );
}
