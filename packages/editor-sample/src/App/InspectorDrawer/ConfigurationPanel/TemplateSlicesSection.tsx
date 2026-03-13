import React, { useEffect, useState } from 'react';

import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

import { fetchDashboardTags, fetchTopics, type TermOption } from '../../../api/terms';

const EMPTY_VALUE = '';

export default function TemplateSlicesSection() {
  const [campaignId, setCampaignId] = useState<string>(EMPTY_VALUE);
  const [topicId, setTopicId] = useState<string>(EMPTY_VALUE);
  const [campaigns, setCampaigns] = useState<TermOption[]>([]);
  const [topics, setTopics] = useState<TermOption[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);

  useEffect(() => {
    setLoadingCampaigns(true);
    fetchDashboardTags()
      .then(setCampaigns)
      .catch(() => setCampaigns([]))
      .finally(() => setLoadingCampaigns(false));
  }, []);

  useEffect(() => {
    setLoadingTopics(true);
    fetchTopics()
      .then(setTopics)
      .catch(() => setTopics([]))
      .finally(() => setLoadingTopics(false));
  }, []);

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Template slices
      </Typography>
      <Stack spacing={2}>
        <FormControl size="small" fullWidth variant="standard">
          <InputLabel id="template-slice-campaign-label">Campaign (conference)</InputLabel>
          <Select
            labelId="template-slice-campaign-label"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            label="Campaign (conference)"
            displayEmpty
            renderValue={(v) => {
              if (v === EMPTY_VALUE) return '';
              return campaigns.find((c) => c.id === v)?.name ?? v;
            }}
          >
            <MenuItem value={EMPTY_VALUE}>
              <em>—</em>
            </MenuItem>
            {loadingCampaigns ? (
              <MenuItem disabled>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Loading…
              </MenuItem>
            ) : (
              campaigns.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <FormControl size="small" fullWidth variant="standard">
          <InputLabel id="template-slice-topic-label">Topic</InputLabel>
          <Select
            labelId="template-slice-topic-label"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            label="Topic"
            displayEmpty
            renderValue={(v) => {
              if (v === EMPTY_VALUE) return '';
              return topics.find((t) => t.id === v)?.name ?? v;
            }}
          >
            <MenuItem value={EMPTY_VALUE}>
              <em>—</em>
            </MenuItem>
            {loadingTopics ? (
              <MenuItem disabled>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Loading…
              </MenuItem>
            ) : (
              topics.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
