import React, { useEffect, useState } from 'react';

import { Box, Button, CircularProgress, Drawer, Stack, Typography } from '@mui/material';
import { EditOutlined, MailOutline, SendOutlined } from '@mui/icons-material';

import { useSamplesDrawerOpen, setCurrentView } from '../../documents/editor/EditorContext';
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
      PaperProps={{
        sx: {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack
        py={1}
        px={2}
        width={SAMPLES_DRAWER_WIDTH}
        height="100%"
        minHeight={0}
        spacing={2}
        sx={{ '& .MuiButton-root': { width: '100%', justifyContent: 'flex-start' } }}
      >
        <Stack
          spacing={2}
          flex={1}
          minHeight={0}
          width="100%"
          overflow="auto"
          alignItems="flex-start"
        >
          <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
            RheumNow Email Builder
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="medium"
            startIcon={<SendOutlined />}
            onClick={() => setCurrentView('sends')}
            sx={{ py: 1.25, fontWeight: 600 }}
          >
            Sends &amp; schedules
          </Button>

          <Stack spacing={1} alignItems="flex-start" width="100%">
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ px: 1, pt: 0.5 }}>
              <EditOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="overline" color="primary" sx={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                Templates
              </Typography>
            </Stack>

            <SidebarButton href="#">New Template</SidebarButton>

            {isLoading && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1, py: 0.5 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Loading templates…
                </Typography>
              </Stack>
            )}

            {error && (
              <Typography variant="caption" color="error" sx={{ px: 1, py: 0.5 }}>
                {error}
              </Typography>
            )}

            {!isLoading && !error && templates.length > 0 && (
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
            )}

            {!isLoading && !error && templates.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                No saved templates yet
              </Typography>
            )}
          </Stack>
        </Stack>

        <Box
          flexShrink={0}
          sx={{
            p: 1.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'action.selected' : 'grey.50',
          }}
        >
          <Stack spacing={1} alignItems="flex-start">
            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ px: 0.25 }}>
              <MailOutline sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
                Mailchimp
              </Typography>
            </Stack>

            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => setCurrentView('mailchimp')}
              sx={{ mt: 0.5 }}
            >
              Lists &amp; campaigns
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Drawer>
  );
}
