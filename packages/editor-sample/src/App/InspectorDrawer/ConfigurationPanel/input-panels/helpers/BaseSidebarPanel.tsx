import React from 'react';

import { Box, Stack, Typography } from '@mui/material';

type SidebarPanelProps = {
  title: string;
  /** Shown under the title (e.g. XML feed base URL). String uses caption styling; pass a React node for custom layout. */
  subtitle?: React.ReactNode;
  children: React.ReactNode;
};
export default function BaseSidebarPanel({ title, subtitle, children }: SidebarPanelProps) {
  return (
    <Box p={2}>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ display: 'block' }}>
          {title}
        </Typography>
        {subtitle != null &&
          (typeof subtitle === 'string' ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', wordBreak: 'break-all' }}>
              {subtitle}
            </Typography>
          ) : (
            subtitle
          ))}
      </Stack>
      <Stack spacing={5} mb={3}>
        {children}
      </Stack>
    </Box>
  );
}
