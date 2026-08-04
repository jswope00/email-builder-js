import React, { useEffect, useLayoutEffect, useState } from 'react';

import { Drawer } from '@mui/material';

import { closeSamplesDrawer, openSamplesDrawer, useSamplesDrawerOpen } from '../../documents/editor/EditorContext';
import { fetchTemplates, type TemplateListItem } from '../../api/templates';
import { fetchFolders, type TemplateFolder } from '../../api/folders';

import SamplesDrawerContent, { SAMPLES_DRAWER_WIDTH } from './SamplesDrawerContent';
import { useIsMobileNav } from './useMobileNav';

export { SAMPLES_DRAWER_WIDTH };

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const isMobileNav = useIsMobileNav();

  useLayoutEffect(() => {
    if (isMobileNav) {
      closeSamplesDrawer();
    } else {
      openSamplesDrawer();
    }
  }, [isMobileNav]);

  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [folders, setFolders] = useState<TemplateFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      const data = await fetchTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
      console.error('Failed to load templates:', err);
    }
  };

  const loadFolders = async () => {
    try {
      const data = await fetchFolders();
      setFolders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load folders');
      console.error('Failed to load folders:', err);
    }
  };

  const loadAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([loadTemplates(), loadFolders()]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (samplesDrawerOpen) {
      void loadAll();
    }
  }, [samplesDrawerOpen]);

  return (
    <Drawer
      variant={isMobileNav ? 'temporary' : 'persistent'}
      anchor="left"
      open={samplesDrawerOpen}
      onClose={closeSamplesDrawer}
      ModalProps={{ keepMounted: false }}
      PaperProps={{
        sx: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          width: SAMPLES_DRAWER_WIDTH,
          maxWidth: '85vw',
        },
      }}
      sx={
        isMobileNav
          ? undefined
          : {
              width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
              flexShrink: 0,
            }
      }
    >
      <SamplesDrawerContent
        templates={templates}
        folders={folders}
        isLoading={isLoading}
        error={error}
        onTemplateListChange={() => void loadTemplates()}
        onFolderListChange={() => void loadFolders()}
      />
    </Drawer>
  );
}
