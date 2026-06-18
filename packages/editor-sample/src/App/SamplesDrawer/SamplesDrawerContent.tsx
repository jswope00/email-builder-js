import React from 'react';

import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { EditOutlined, SendOutlined, SettingsOutlined } from '@mui/icons-material';

import { setCurrentView } from '../../documents/editor/EditorContext';
import type { TemplateListItem } from '../../api/templates';

import SidebarButton from './SidebarButton';
import TemplateRow from './TemplateRow';
import { useCloseSamplesDrawerOnMobile } from './useMobileNav';

export const SAMPLES_DRAWER_WIDTH = 240;

type SamplesDrawerContentProps = {
  templates: TemplateListItem[];
  isLoading: boolean;
  error: string | null;
  onTemplateListChange: () => void;
};

export default function SamplesDrawerContent({
  templates,
  isLoading,
  error,
  onTemplateListChange,
}: SamplesDrawerContentProps) {
  const closeIfMobile = useCloseSamplesDrawerOnMobile();

  const navigateTo = (view: Parameters<typeof setCurrentView>[0]) => {
    setCurrentView(view);
    closeIfMobile();
  };

  return (
    <Stack
      py={1}
      px={2}
      width={SAMPLES_DRAWER_WIDTH}
      height="100%"
      minHeight={0}
      spacing={2}
      sx={{ '& .MuiButton-root': { width: '100%', justifyContent: 'flex-start' } }}
    >
      <Stack spacing={2} flex={1} minHeight={0} width="100%" overflow="auto" alignItems="flex-start">
        <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
          RheumNow Email Builder
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<SendOutlined />}
          onClick={() => navigateTo('sends')}
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

          <SidebarButton href="#" onNavigate={closeIfMobile}>
            New Template
          </SidebarButton>

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
                  onTemplateDeleted={onTemplateListChange}
                  onTemplateDuplicated={onTemplateListChange}
                  onTemplateUpdated={onTemplateListChange}
                  onNavigate={closeIfMobile}
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
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'action.selected' : 'grey.50'),
        }}
      >
        <Stack spacing={1} alignItems="flex-start">
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ px: 0.25 }}>
            <SettingsOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
              Administration
            </Typography>
          </Stack>

          <Button size="small" variant="outlined" color="inherit" onClick={() => navigateTo('sendExecutions')}>
            Execution history
          </Button>

          <Button size="small" variant="outlined" color="inherit" onClick={() => navigateTo('mailchimp')}>
            Lists &amp; campaigns
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
