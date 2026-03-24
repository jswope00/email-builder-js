import React from 'react';

import { Box, useMediaQuery, useTheme } from '@mui/material';

import SendsTab from './SendsTab';

/**
 * Standalone sends & schedules surface — optimized for phone use (safe areas, padding, list layout in SendsTab).
 */
export default function SendsPage() {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        overflow: 'auto',
        boxSizing: 'border-box',
        px: { xs: 1.5, sm: 2, md: 3 },
        pt: { xs: 2, sm: 3 },
        pb: { xs: 'max(24px, env(safe-area-inset-bottom, 0px))', sm: 4 },
      }}
    >
      <SendsTab isCompact={isCompact} />
    </Box>
  );
}
