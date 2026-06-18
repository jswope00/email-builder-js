import { useMediaQuery, useTheme } from '@mui/material';

import { closeSamplesDrawer, openSamplesDrawer } from '../../documents/editor/EditorContext';

export { MOBILE_NAV_MIN_WIDTH, getIsDesktopNav } from './samplesDrawerViewport';

export const MOBILE_NAV_BAR_HEIGHT = 48;

export function useIsMobileNav() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
}

export function useCloseSamplesDrawerOnMobile() {
  const isMobileNav = useIsMobileNav();
  return () => {
    if (isMobileNav) {
      closeSamplesDrawer();
    }
  };
}
