import React, { useEffect, useRef, useState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  List,
  ListItemButton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { MailOutline } from '@mui/icons-material';

import {
  setCurrentView,
  setDocument,
  setSamplesDrawerTab,
  useDocument,
  useSelectedBlockId,
  useSelectedSamplesDrawerTab,
  useSamplesDrawerOpen,
} from '../../documents/editor/EditorContext';
import { fetchTemplates, type TemplateListItem } from '../../api/templates';

import SidebarButton from './SidebarButton';
import TemplateRow from './TemplateRow';

export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const document = useDocument();
  const selectedBlockId = useSelectedBlockId();
  const selectedSamplesDrawerTab = useSelectedSamplesDrawerTab();
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const block = selectedBlockId ? document[selectedBlockId] : null;
  const isUniversalXmlFeed = block?.type === 'UniversalXmlFeed';
  const blockProps = (block?.data as { props?: { feedSlices?: { label: string; items: unknown[] }[]; activeSliceIndex?: number; campaignTermIds?: string[]; topicTermIds?: string[] } })?.props;
  const feedSlices = blockProps?.feedSlices;
  const activeSliceIndex = blockProps?.activeSliceIndex ?? 0;
  const campaignTermIds = blockProps?.campaignTermIds ?? [];
  const topicTermIds = blockProps?.topicTermIds ?? [];
  const sliceCount =
    campaignTermIds.length > 0 && topicTermIds.length > 0
      ? campaignTermIds.length * topicTermIds.length
      : campaignTermIds.length > 0
        ? campaignTermIds.length
        : topicTermIds.length > 0
          ? topicTermIds.length
          : 0;
  const showFeedSectionsTab = Boolean(isUniversalXmlFeed && sliceCount > 1);
  const prevShowFeedSectionsTab = useRef(false);
  useEffect(() => {
    if (showFeedSectionsTab && !prevShowFeedSectionsTab.current) {
      setSamplesDrawerTab('feed-sections');
    }
    prevShowFeedSectionsTab.current = showFeedSectionsTab;
  }, [showFeedSectionsTab]);

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

  const handleSliceClick = (index: number) => {
    if (!selectedBlockId || !block) return;
    const data = block.data as { props?: Record<string, unknown> };
    setDocument({
      [selectedBlockId]: {
        ...block,
        data: {
          ...data,
          props: { ...data?.props, activeSliceIndex: index },
        },
      },
    });
  };

  const templatesContent = (
    <Stack alignItems="flex-start">
      <SidebarButton href="#">Empty</SidebarButton>
      <Button
        size="small"
        startIcon={<MailOutline />}
        onClick={() => setCurrentView('mailchimp')}
        sx={{ width: '100%', justifyContent: 'flex-start' }}
      >
        Mailchimp
      </Button>

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
  );

  const sectionCount = feedSlices && feedSlices.length > 1 ? feedSlices.length : sliceCount;
  const feedSectionsContent =
    sectionCount > 1 ? (
      <Box sx={{ maxHeight: '100%', overflow: 'auto', py: 0.5 }}>
        <List dense disablePadding>
          {Array.from({ length: sectionCount }, (_, index) => (
            <ListItemButton
              key={index}
              selected={activeSliceIndex === index}
              onClick={() => handleSliceClick(index)}
              sx={{ py: 0.5 }}
            >
              <Typography variant="body2" noWrap sx={{ width: '100%' }}>
                {feedSlices && feedSlices[index] ? (feedSlices[index].label || `Section ${index + 1}`) : `Section ${index + 1}`}
              </Typography>
            </ListItemButton>
          ))}
        </List>
      </Box>
    ) : null;

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={0} width={SAMPLES_DRAWER_WIDTH} height="100%" overflow="hidden">
        <Typography variant="h6" component="h1" sx={{ p: 0.75, flexShrink: 0 }}>
          RheumNow Email Builder
        </Typography>

        {showFeedSectionsTab ? (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
              <Tabs
                value={selectedSamplesDrawerTab}
                onChange={(_, v: 'templates' | 'feed-sections') => setSamplesDrawerTab(v)}
                variant="fullWidth"
              >
                <Tab value="templates" label="Templates" />
                <Tab value="feed-sections" label="Sections" />
              </Tabs>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 1 }}>
              {selectedSamplesDrawerTab === 'templates' && (
                <Stack spacing={2} sx={{ '& > .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
                  {templatesContent}
                </Stack>
              )}
              {selectedSamplesDrawerTab === 'feed-sections' && feedSectionsContent}
            </Box>
          </>
        ) : (
          <Stack spacing={2} py={1} px={2} sx={{ flex: 1, overflow: 'auto', '& > .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
            {templatesContent}
          </Stack>
        )}

        <Divider />
      </Stack>
    </Drawer>
  );
}
