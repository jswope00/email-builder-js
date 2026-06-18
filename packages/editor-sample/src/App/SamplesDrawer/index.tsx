import React, { useEffect, useLayoutEffect, useState } from 'react';

import { Drawer } from '@mui/material';

import { closeSamplesDrawer, openSamplesDrawer, useSamplesDrawerOpen } from '../../documents/editor/EditorContext';
import { fetchTemplates, type TemplateListItem } from '../../api/templates';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
      console.error('Failed to load templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (samplesDrawerOpen) {
      loadTemplates();
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
        isLoading={isLoading}
        error={error}
        onTemplateListChange={loadTemplates}
      />
    </Drawer>
  );
}
