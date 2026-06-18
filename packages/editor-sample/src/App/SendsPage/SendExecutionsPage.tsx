import React, { useCallback, useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { DateTime } from 'luxon';

import {
  fetchSendExecutions,
  type SendExecutionListItem,
  type SendExecutionStatus,
  type SendExecutionTrigger,
} from '../../api/sends';

const DISPLAY_TZ = 'America/New_York';

function formatInstantEst(iso: string | null): string {
  if (!iso) return '—';
  const dt = DateTime.fromISO(iso, { zone: 'utc' });
  if (!dt.isValid) return '—';
  return dt.setZone(DISPLAY_TZ).toFormat("MMM d, yyyy '·' h:mm a z");
}

function triggerLabel(trigger: SendExecutionTrigger): string {
  return trigger === 'manual' ? 'Manual' : 'Scheduled';
}

function modeLabel(mode: SendExecutionListItem['mode']): string {
  return mode === 'live' ? 'Live' : 'Test';
}

function statusChipColor(
  status: SendExecutionStatus
): 'success' | 'error' | 'warning' | 'info' | 'default' {
  switch (status) {
    case 'sent':
      return 'success';
    case 'failed':
      return 'error';
    case 'skipped':
      return 'warning';
    case 'started':
      return 'info';
    default:
      return 'default';
  }
}

function statusLabel(status: SendExecutionStatus): string {
  switch (status) {
    case 'sent':
      return 'Sent';
    case 'failed':
      return 'Failed';
    case 'skipped':
      return 'Skipped';
    case 'started':
      return 'In progress';
    default:
      return status;
  }
}

export default function SendExecutionsPage({ isCompact = false }: { isCompact?: boolean }) {
  const [executions, setExecutions] = useState<SendExecutionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggerFilter, setTriggerFilter] = useState<'all' | SendExecutionTrigger>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | SendExecutionStatus>('all');

  const loadExecutions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchSendExecutions({
        limit: 200,
        triggerType: triggerFilter === 'all' ? undefined : triggerFilter,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setExecutions(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load execution log');
    } finally {
      setLoading(false);
    }
  }, [triggerFilter, statusFilter]);

  useEffect(() => {
    loadExecutions();
  }, [loadExecutions]);

  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ fontSize: { xs: '1.35rem', sm: '1.5rem' }, fontWeight: 600 }}
        >
          Send execution log
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Trigger</InputLabel>
            <Select
              label="Trigger"
              value={triggerFilter}
              onChange={(e) => setTriggerFilter(e.target.value as 'all' | SendExecutionTrigger)}
            >
              <MenuItem value="all">All triggers</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | SendExecutionStatus)}
            >
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="sent">Sent</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="skipped">Skipped</MenuItem>
              <MenuItem value="started">In progress</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
            onClick={loadExecutions}
            disabled={loading}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        Recent send attempts from manual actions and automated schedules. Times shown in Eastern Time.
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading && executions.length === 0 ? (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 4 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Loading…</Typography>
        </Stack>
      ) : executions.length === 0 ? (
        <Alert severity="info">No executions recorded yet.</Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ overflowX: 'auto' }}>
          <Table size={isCompact ? 'medium' : 'small'} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Started</TableCell>
                <TableCell>Send</TableCell>
                <TableCell>Trigger</TableCell>
                <TableCell>Mode</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Campaign ID</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {executions.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatInstantEst(row.startedAt)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {row.sendName}
                    </Typography>
                    {row.completedAt && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Completed {formatInstantEst(row.completedAt)}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{triggerLabel(row.triggerType)}</TableCell>
                  <TableCell>{modeLabel(row.mode)}</TableCell>
                  <TableCell>
                    <Chip label={statusLabel(row.status)} size="small" color={statusChipColor(row.status)} />
                  </TableCell>
                  <TableCell>
                    {row.mailchimpCampaignId ? (
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {row.mailchimpCampaignId}
                      </Typography>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 240 }}>
                    {row.errorMessage ? (
                      <Tooltip title={row.errorMessage}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {row.errorMessage}
                        </Typography>
                      </Tooltip>
                    ) : row.triggerType === 'scheduled' && row.intendedRunAt ? (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Slot: {formatInstantEst(row.intendedRunAt)}
                      </Typography>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && executions.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary">
            Showing up to {executions.length} most recent execution{executions.length === 1 ? '' : 's'}.
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
