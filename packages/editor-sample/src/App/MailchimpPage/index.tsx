import React, { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import { ExpandMore, People, Campaign, Segment as SegmentIcon } from '@mui/icons-material';

import { fetchAudiences, fetchSegments, fetchCampaigns, type Audience, type Segment, type Campaign } from '../../api/mailchimp';

interface AudienceWithData extends Audience {
  segments?: Segment[];
  campaigns?: Campaign[];
  loadingSegments?: boolean;
  loadingCampaigns?: boolean;
  segmentsError?: string;
  campaignsError?: string;
}

export default function MailchimpPage() {
  const [audiences, setAudiences] = useState<AudienceWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAudiences = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAudiences();
      setAudiences(data.map((audience) => ({ ...audience, segments: [], campaigns: [] })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audiences');
      console.error('Failed to load audiences:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSegments = async (audienceId: string) => {
    const audience = audiences.find((a) => a.id === audienceId);
    if (!audience) return;

    setAudiences((prev) =>
      prev.map((a) => (a.id === audienceId ? { ...a, loadingSegments: true, segmentsError: undefined } : a))
    );

    try {
      const segments = await fetchSegments(audienceId);
      setAudiences((prev) =>
        prev.map((a) => (a.id === audienceId ? { ...a, segments, loadingSegments: false } : a))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load segments';
      setAudiences((prev) =>
        prev.map((a) =>
          a.id === audienceId
            ? { ...a, loadingSegments: false, segmentsError: errorMessage }
            : a
        )
      );
    }
  };

  const loadCampaigns = async (audienceId: string) => {
    const audience = audiences.find((a) => a.id === audienceId);
    if (!audience) return;

    setAudiences((prev) =>
      prev.map((a) => (a.id === audienceId ? { ...a, loadingCampaigns: true, campaignsError: undefined } : a))
    );

    try {
      const campaigns = await fetchCampaigns(audienceId, 10);
      setAudiences((prev) =>
        prev.map((a) => (a.id === audienceId ? { ...a, campaigns, loadingCampaigns: false } : a))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaigns';
      setAudiences((prev) =>
        prev.map((a) =>
          a.id === audienceId
            ? { ...a, loadingCampaigns: false, campaignsError: errorMessage }
            : a
        )
      );
    }
  };

  const handleAccordionChange = (audienceId: string, expanded: boolean) => {
    const audience = audiences.find((a) => a.id === audienceId);
    if (!audience) return;

    if (expanded) {
      // Load segments and campaigns when accordion is expanded
      if (!audience.segments || audience.segments.length === 0) {
        loadSegments(audienceId);
      }
      if (!audience.campaigns || audience.campaigns.length === 0) {
        loadCampaigns(audienceId);
      }
    }
  };

  useEffect(() => {
    loadAudiences();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sent':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'saving':
      case 'paused':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'auto', p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Mailchimp Integration
        </Typography>

        {isLoading && (
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ py: 4 }}>
            <CircularProgress size={24} />
            <Typography>Loading audiences...</Typography>
          </Stack>
        )}

        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!isLoading && !error && audiences.length === 0 && (
          <Alert severity="info">No audiences found in your Mailchimp account.</Alert>
        )}

        {!isLoading &&
          !error &&
          audiences.map((audience) => (
            <Accordion
              key={audience.id}
              onChange={(_, expanded) => handleAccordionChange(audience.id, expanded)}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                  <People color="primary" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{audience.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {audience.member_count.toLocaleString()} members • Created {formatDate(audience.created_at)}
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Segments Section */}
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <SegmentIcon color="primary" />
                      <Typography variant="h6">Segments</Typography>
                    </Stack>
                    {audience.loadingSegments && (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 2 }}>
                        <CircularProgress size={16} />
                        <Typography variant="caption">Loading segments...</Typography>
                      </Stack>
                    )}
                    {audience.segmentsError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {audience.segmentsError}
                      </Alert>
                    )}
                    {!audience.loadingSegments && !audience.segmentsError && audience.segments && (
                      <>
                        {audience.segments.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            No segments found for this audience.
                          </Typography>
                        ) : (
                          <Stack spacing={1}>
                            {audience.segments.map((segment) => (
                              <Card key={segment.id} variant="outlined">
                                <CardContent>
                                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                      <Typography variant="subtitle1">{segment.name}</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {segment.member_count.toLocaleString()} members • Type: {segment.type}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </CardContent>
                              </Card>
                            ))}
                          </Stack>
                        )}
                      </>
                    )}
                  </Box>

                  {/* Campaigns Section */}
                  <Box>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <Campaign color="primary" />
                      <Typography variant="h6">Recent Campaigns</Typography>
                    </Stack>
                    {audience.loadingCampaigns && (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 2 }}>
                        <CircularProgress size={16} />
                        <Typography variant="caption">Loading campaigns...</Typography>
                      </Stack>
                    )}
                    {audience.campaignsError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {audience.campaignsError}
                      </Alert>
                    )}
                    {!audience.loadingCampaigns && !audience.campaignsError && audience.campaigns && (
                      <>
                        {audience.campaigns.length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            No campaigns found for this audience.
                          </Typography>
                        ) : (
                          <Stack spacing={1}>
                            {audience.campaigns.map((campaign) => (
                              <Card key={campaign.id} variant="outlined">
                                <CardContent>
                                  <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle1">{campaign.name}</Typography>
                                        {campaign.subject && (
                                          <Typography variant="body2" color="text.secondary">
                                            Subject: {campaign.subject}
                                          </Typography>
                                        )}
                                      </Box>
                                      <Chip
                                        label={campaign.status}
                                        color={getStatusColor(campaign.status) as any}
                                        size="small"
                                      />
                                    </Stack>
                                    <Stack direction="row" spacing={2}>
                                      {campaign.send_time && (
                                        <Typography variant="caption" color="text.secondary">
                                          Sent: {formatDate(campaign.send_time)}
                                        </Typography>
                                      )}
                                      {campaign.recipients && (
                                        <Typography variant="caption" color="text.secondary">
                                          Recipients: {campaign.recipients.recipient_count.toLocaleString()}
                                        </Typography>
                                      )}
                                    </Stack>
                                  </Stack>
                                </CardContent>
                              </Card>
                            ))}
                          </Stack>
                        )}
                      </>
                    )}
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
      </Stack>
    </Box>
  );
}
