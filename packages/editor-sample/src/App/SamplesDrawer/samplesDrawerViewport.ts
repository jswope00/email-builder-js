import theme from '../../theme';

export const MOBILE_NAV_MIN_WIDTH = theme.breakpoints.values.md;

export function getIsDesktopNav() {
  return typeof window !== 'undefined' && window.matchMedia(`(min-width: ${MOBILE_NAV_MIN_WIDTH}px)`).matches;
}
