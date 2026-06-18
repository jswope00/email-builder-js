import React from 'react';

import { AppBar, Stack, Toolbar, Typography } from '@mui/material';

import ToggleSamplesPanelButton from './ToggleSamplesPanelButton';
import { MOBILE_NAV_BAR_HEIGHT } from './useMobileNav';

export default function MobileNavBar() {
  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={0}
      sx={{
        height: MOBILE_NAV_BAR_HEIGHT,
        borderBottom: 1,
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: MOBILE_NAV_BAR_HEIGHT, px: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} width="100%">
          <ToggleSamplesPanelButton />
          <Typography variant="subtitle1" component="p" noWrap sx={{ fontWeight: 600 }}>
            RheumNow Email Builder
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
