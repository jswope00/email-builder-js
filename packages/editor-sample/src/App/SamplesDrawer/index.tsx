import React, { useEffect, useState } from 'react';

import { CircularProgress, Divider, Drawer, Stack, Typography } from '@mui/material';

import { useSamplesDrawerOpen } from '../../documents/editor/EditorContext';
import { fetchTemplates, type TemplateListItem } from '../../api/templates';

import SidebarButton from './SidebarButton';
import TemplateRow from './TemplateRow';

export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
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
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} justifyContent="space-between" height="100%">
        <Stack spacing={2} sx={{ '& > .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
            RheumNow Email Builder
          </Typography>

          <Stack alignItems="flex-start">
            <SidebarButton href="#">Empty</SidebarButton>
            
            {isLoading && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1, py: 0.5 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Loading...
                </Typography>
              </Stack>
            )}

            {error && (
              <Typography variant="caption" color="error" sx={{ px: 1, py: 0.5 }}>
                {error}
              </Typography>
            )}

            {!isLoading && !error && templates.length > 0 && (
              <>
                <Typography variant="overline" sx={{ px: 1, pt: 1, pb: 0.5, fontSize: '0.7rem' }}>
                  Templates
                </Typography>
                <Stack spacing={0.5} sx={{ width: '100%' }}>
                  {templates.map((template) => (
                    <TemplateRow
                      key={template.id}
                      template={template}
                      onTemplateDeleted={loadTemplates}
                      onTemplateDuplicated={loadTemplates}
                      onTemplateUpdated={loadTemplates}
                    />
                  ))}
                </Stack>
              </>
            )}

            {!isLoading && !error && templates.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                No templates found
              </Typography>
            )}
          </Stack>

          <Divider />


        </Stack>

      </Stack>
    </Drawer>
  );
}
