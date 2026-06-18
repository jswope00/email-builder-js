import React from 'react';

import { Stack, useTheme } from '@mui/material';

import { useInspectorDrawerOpen, useSamplesDrawerOpen, useCurrentView } from '../documents/editor/EditorContext';

import InspectorDrawer, { INSPECTOR_DRAWER_WIDTH } from './InspectorDrawer';
import SamplesDrawer, { SAMPLES_DRAWER_WIDTH } from './SamplesDrawer';
import MobileNavBar from './SamplesDrawer/MobileNavBar';
import { MOBILE_NAV_BAR_HEIGHT, useIsMobileNav } from './SamplesDrawer/useMobileNav';
import TemplatePanel from './TemplatePanel';
import MailchimpPage from './MailchimpPage';
import SendExecutionsPage from './SendExecutionsPage';
import SendsPage from './SendsPage';

function useDrawerTransition(cssProperty: 'margin-left' | 'margin-right', open: boolean) {
  const { transitions } = useTheme();
  return transitions.create(cssProperty, {
    easing: !open ? transitions.easing.sharp : transitions.easing.easeOut,
    duration: !open ? transitions.duration.leavingScreen : transitions.duration.enteringScreen,
  });
}

export default function App() {
  const inspectorDrawerOpen = useInspectorDrawerOpen();
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const currentView = useCurrentView();
  const isMobileNav = useIsMobileNav();
  const showMobileNavBar = isMobileNav;

  const marginLeftTransition = useDrawerTransition('margin-left', samplesDrawerOpen);
  const marginRightTransition = useDrawerTransition('margin-right', inspectorDrawerOpen);

  const contentMarginLeft =
    !isMobileNav && samplesDrawerOpen ? `${SAMPLES_DRAWER_WIDTH}px` : 0;

  return (
    <>
      <InspectorDrawer />
      <SamplesDrawer />
      {showMobileNavBar && <MobileNavBar />}

      <Stack
        sx={{
          marginRight: inspectorDrawerOpen ? `${INSPECTOR_DRAWER_WIDTH}px` : 0,
          marginLeft: contentMarginLeft,
          paddingTop: showMobileNavBar ? `${MOBILE_NAV_BAR_HEIGHT}px` : 0,
          transition: [marginLeftTransition, marginRightTransition].join(', '),
        }}
      >
        {currentView === 'mailchimp' ? (
          <MailchimpPage />
        ) : currentView === 'sends' ? (
          <SendsPage />
        ) : currentView === 'sendExecutions' ? (
          <SendExecutionsPage />
        ) : (
          <TemplatePanel />
        )}
      </Stack>
    </>
  );
}
