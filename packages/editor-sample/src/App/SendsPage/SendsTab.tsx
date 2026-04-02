import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  buildFeaturedStoryFeedUrl,
  getFirstFeaturedStoryTitleFromXml,
} from '@usewaypoint/block-featured-story-xml';
import {
  expandHeadingWildcards,
  HEADING_DATE_WILDCARD,
  HEADING_FEATURED_STORY_TITLE_WILDCARD,
} from '@usewaypoint/block-heading';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add, DeleteOutline, Edit, ExpandMore, MoreVert, PlayArrow, PreviewOutlined } from '@mui/icons-material';
import { DateTime } from 'luxon';

import {
  loadTemplateFromHash,
  setCurrentView,
  setSelectedMainTab,
} from '../../documents/editor/EditorContext';
import { fetchTemplate, fetchTemplates, type TemplateListItem } from '../../api/templates';
import { fetchAudiences, fetchSegments, type Audience, type Segment } from '../../api/mailchimp';
import {
  createSend,
  deleteSchedule,
  deleteSend,
  executeSend,
  fetchSends,
  patchScheduleActive,
  patchSendActive,
  updateSend,
  type EmailSendListItem,
  type SchedulePayload,
  type ScheduleKind,
  type ScheduleType,
  type SendPayload,
  type SendScheduleDTO,
} from '../../api/sends';

const DEFAULT_FROM = {
  fromName: 'Dr. Jack Cush',
  fromEmail: 'jackcush@rheumnow.com',
  replyTo: 'jackcush@rheumnow.com',
};

function timezones(): string[] {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] };
  if (typeof intl.supportedValuesOf === 'function') {
    try {
      return intl.supportedValuesOf('timeZone');
    } catch {
      /* fall through */
    }
  }
  return ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'UTC'];
}

const WEEKDAYS: { value: number; label: string }[] = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 7, label: 'Sun' },
];

/** Display zone for all schedule times in the list UI */
const DISPLAY_TZ = 'America/New_York';

function formatInstantEst(iso: string | null): string {
  if (!iso) return '—';
  const dt = DateTime.fromISO(iso, { zone: 'utc' });
  if (!dt.isValid) return '—';
  return dt.setZone(DISPLAY_TZ).toFormat("MMM d, yyyy '·' h:mm a z");
}

function formatRecurringTimeInEst(recurringTimeLocal: string | null, scheduleTimezone: string): string {
  if (!recurringTimeLocal) return '—';
  const parts = recurringTimeLocal.split(':');
  const h = parseInt(parts[0] ?? '0', 10);
  const m = parseInt(parts[1] ?? '0', 10);
  const base = DateTime.now().setZone(scheduleTimezone).set({ hour: h, minute: m, second: 0, millisecond: 0 });
  if (!base.isValid) return '—';
  return base.setZone(DISPLAY_TZ).toFormat("h:mm a z");
}

function formatWeekdayList(nums: number[] | null): string {
  if (!nums?.length) return '—';
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted
    .map((n) => WEEKDAYS.find((w) => w.value === n)?.label ?? String(n))
    .join(', ');
}

function scheduleKindLabel(k: ScheduleKind): string {
  return k === 'live' ? 'Live' : 'Test';
}

function scheduleTypeLabel(t: ScheduleType): string {
  return t === 'one_off' ? 'One-off' : 'Recurring';
}

function ScheduleDetailPanel({
  s,
  onEdit,
  onDelete,
  onToggleActive,
  disabled,
  toggleDisabled,
}: {
  s: SendScheduleDTO;
  onEdit?: (scheduleId: string) => void;
  onDelete?: (scheduleId: string) => void;
  onToggleActive?: (scheduleId: string, active: boolean) => void;
  disabled?: boolean;
  toggleDisabled?: boolean;
}) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchor);
  const isRecurring = s.scheduleType === 'recurring';
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'action.hover' : 'grey.50'),
      }}
    >
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2">
          <Box component="span" color="text.secondary" sx={{ display: 'inline-block', minWidth: 112 }}>
            Kind
          </Box>
          {scheduleKindLabel(s.scheduleKind)}
        </Typography>
        <Typography variant="body2">
          <Box component="span" color="text.secondary" sx={{ display: 'inline-block', minWidth: 112 }}>
            Type
          </Box>
          {scheduleTypeLabel(s.scheduleType)}
        </Typography>
        {isRecurring ? (
          <>
            <Typography variant="body2">
              <Box component="span" color="text.secondary" sx={{ display: 'inline-block', minWidth: 112 }}>
                Weekdays
              </Box>
              {formatWeekdayList(s.recurringWeekdays)}
            </Typography>
            <Typography variant="body2">
              <Box component="span" color="text.secondary" sx={{ display: 'inline-block', minWidth: 112 }}>
                Recurring time (EST)
              </Box>
              {formatRecurringTimeInEst(s.recurringTimeLocal, s.timezone)}
            </Typography>
          </>
        ) : (
          <Typography variant="body2">
            <Box component="span" color="text.secondary" sx={{ display: 'inline-block', minWidth: 112 }}>
              One-off (EST)
            </Box>
            {formatInstantEst(s.oneOffAt)}
          </Typography>
        )}
        <Typography variant="body2">
          <Box component="span" color="text.secondary" sx={{ display: 'inline-block', minWidth: 112 }}>
            Next run (EST)
          </Box>
          {formatInstantEst(s.nextRunAt)}
        </Typography>
        <Typography variant="body2">
          <Box component="span" color="text.secondary" sx={{ display: 'inline-block', minWidth: 112 }}>
            Last run (EST)
          </Box>
          {formatInstantEst(s.lastRunAt)}
        </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
          {onToggleActive && (
            <Tooltip title="Schedule active">
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={s.isActive}
                    onChange={(_, v) => onToggleActive(s.id, v)}
                    disabled={toggleDisabled}
                  />
                }
                label=""
                sx={{ mr: 0 }}
              />
            </Tooltip>
          )}
          {(onEdit || onDelete) && (
            <>
              <IconButton
                size="small"
                aria-label="Schedule actions"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                disabled={disabled}
              >
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu anchorEl={menuAnchor} open={menuOpen} onClose={() => setMenuAnchor(null)}>
                {onEdit && (
                  <MenuItem
                    onClick={() => {
                      onEdit(s.id);
                      setMenuAnchor(null);
                    }}
                  >
                    <ListItemIcon>
                      <Edit fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Edit schedule</ListItemText>
                  </MenuItem>
                )}
                {onDelete && (
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null);
                      onDelete(s.id);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <ListItemIcon>
                      <DeleteOutline fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText>Delete schedule</ListItemText>
                  </MenuItem>
                )}
              </Menu>
            </>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}

type SendListCardProps = {
  row: EmailSendListItem;
  isCompact: boolean;
  actionBusy: string | null;
  scheduleActionsDisabled: boolean;
  sendToggleBusy: boolean;
  scheduleToggleKey: string | null;
  onExecute: (id: string, mode: 'live' | 'test') => void;
  onEdit: (row: EmailSendListItem) => void;
  onDelete: (id: string) => void;
  onToggleSendActive: (sendId: string, active: boolean) => void;
  onScheduleAdd: (sendId: string) => void;
  onScheduleEdit: (sendId: string, scheduleId: string) => void;
  onScheduleDelete: (sendId: string, scheduleId: string) => void;
  onToggleScheduleActive: (sendId: string, scheduleId: string, active: boolean) => void;
  onPreviewTemplate: (row: EmailSendListItem) => void;
};

function SendListCard({
  row,
  isCompact,
  actionBusy,
  scheduleActionsDisabled,
  sendToggleBusy,
  scheduleToggleKey,
  onExecute,
  onEdit,
  onDelete,
  onToggleSendActive,
  onScheduleAdd,
  onScheduleEdit,
  onScheduleDelete,
  onToggleScheduleActive,
  onPreviewTemplate,
}: SendListCardProps) {
  const [sendMenuAnchor, setSendMenuAnchor] = useState<null | HTMLElement>(null);
  const sendMenuOpen = Boolean(sendMenuAnchor);
  /** Controlled so refetches after schedule toggle don’t reset collapse state */
  const [schedulesAccordionOpen, setSchedulesAccordionOpen] = useState(false);
  const sendBtnSize = isCompact ? 'large' : 'small';
  const sendBtnFullWidth = isCompact;

  return (
    <Card
      variant="outlined"
      sx={{
        opacity: row.isActive ? 1 : 0.72,
        borderRadius: 2,
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'flex-start' }}
            gap={1.5}
          >
            <Stack
              direction={isCompact ? 'column' : 'row'}
              spacing={1}
              alignItems={isCompact ? 'stretch' : 'center'}
              flexWrap="wrap"
              useFlexGap
              sx={{ flex: 1, minWidth: 0 }}
            >
              <Tooltip title="Open this send’s template in Preview">
                <span style={isCompact ? { display: 'block' } : undefined}>
                  <Button
                    fullWidth={sendBtnFullWidth}
                    size={sendBtnSize}
                    variant="outlined"
                    color="inherit"
                    onClick={() => onPreviewTemplate(row)}
                    startIcon={<PreviewOutlined fontSize={isCompact ? 'medium' : 'small'} />}
                  >
                    Preview
                  </Button>
                </span>
              </Tooltip>
              <Tooltip
                title={
                  !row.testSubject || !row.testListId
                    ? 'Set test subject and test audience in Edit to enable'
                    : 'Send a test to your test segment'
                }
              >
                <span style={isCompact ? { display: 'block' } : undefined}>
                  <Button
                    fullWidth={sendBtnFullWidth}
                    size={sendBtnSize}
                    variant="outlined"
                    onClick={() => onExecute(row.id, 'test')}
                    disabled={
                      !row.isActive ||
                      !row.testSubject ||
                      !row.testListId ||
                      actionBusy === `${row.id}-test`
                    }
                    startIcon={
                      actionBusy === `${row.id}-test` ? (
                        <CircularProgress size={isCompact ? 22 : 14} />
                      ) : (
                        <PlayArrow fontSize={isCompact ? 'medium' : 'small'} />
                      )
                    }
                  >
                    Send test
                  </Button>
                </span>
              </Tooltip>
              <Button
                fullWidth={sendBtnFullWidth}
                size={sendBtnSize}
                variant="contained"
                color="secondary"
                onClick={() => onExecute(row.id, 'live')}
                disabled={!row.isActive || actionBusy === `${row.id}-live`}
                startIcon={
                  actionBusy === `${row.id}-live` ? (
                    <CircularProgress size={isCompact ? 22 : 14} color="inherit" />
                  ) : (
                    <PlayArrow fontSize={isCompact ? 'medium' : 'small'} />
                  )
                }
              >
                Send live
              </Button>
            </Stack>
            <Stack
              direction="row"
              spacing={isCompact ? 1 : 0.5}
              alignItems="center"
              justifyContent={{ xs: 'stretch', sm: 'flex-end' }}
              sx={{ flexShrink: 0 }}
            >
              <Tooltip title="Send active (off = paused)">
                <FormControlLabel
                  control={
                    <Switch
                      size={isCompact ? 'medium' : 'small'}
                      checked={row.isActive}
                      onChange={(_, v) => onToggleSendActive(row.id, v)}
                      disabled={sendToggleBusy || actionBusy === row.id}
                    />
                  }
                  label="Active"
                  labelPlacement="start"
                  sx={{ mr: 0, ml: 0 }}
                />
              </Tooltip>
              <IconButton
                size="small"
                aria-label="Send actions"
                onClick={(e) => setSendMenuAnchor(e.currentTarget)}
                disabled={actionBusy === row.id}
              >
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu anchorEl={sendMenuAnchor} open={sendMenuOpen} onClose={() => setSendMenuAnchor(null)}>
                <MenuItem
                  onClick={() => {
                    onEdit(row);
                    setSendMenuAnchor(null);
                  }}
                >
                  <ListItemIcon>
                    <Edit fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit send</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSendMenuAnchor(null);
                    onDelete(row.id);
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <ListItemIcon>
                    <DeleteOutline fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText>Delete send</ListItemText>
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={0.5}>
            <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="h6" component="h2" sx={{ fontSize: isCompact ? '1.1rem' : '1.2rem', fontWeight: 700 }}>
                {row.name}
              </Typography>
              {!row.isActive && <Chip label="Inactive" size="small" />}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Template: {row.templateName}
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              Subject: {row.subject}
            </Typography>
          </Stack>

          <Accordion
            expanded={schedulesAccordionOpen}
            onChange={(_, expanded) => setSchedulesAccordionOpen(expanded)}
            elevation={0}
            disableGutters
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                sx={{ width: '100%', pr: 0.5 }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  Schedules
                  <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.75, fontWeight: 400 }}>
                    (times in Eastern Time)
                  </Typography>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {row.schedules.length === 0
                    ? 'None'
                    : `${row.schedules.length} schedule${row.schedules.length === 1 ? '' : 's'}`}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 2, px: 2 }}>
              <Stack spacing={1.5}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => onScheduleAdd(row.id)}
                  disabled={!row.isActive || scheduleActionsDisabled}
                >
                  Add schedule
                </Button>
                {row.schedules.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No schedules yet. Use Add schedule to create one.
                  </Typography>
                ) : (
                  <Stack spacing={1.25}>
                    {row.schedules.map((s) => (
                      <ScheduleDetailPanel
                        key={s.id}
                        s={s}
                        onToggleActive={(sid, active) => onToggleScheduleActive(row.id, sid, active)}
                        toggleDisabled={
                          !row.isActive ||
                          scheduleActionsDisabled ||
                          scheduleToggleKey === `${row.id}:${s.id}`
                        }
                        onEdit={(id) => onScheduleEdit(row.id, id)}
                        onDelete={(id) => onScheduleDelete(row.id, id)}
                        disabled={!row.isActive || scheduleActionsDisabled}
                      />
                    ))}
                  </Stack>
                )}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </CardContent>
    </Card>
  );
}

type DraftSchedule =
  | {
      key: string;
      scheduleKind: ScheduleKind;
      scheduleType: 'one_off';
      isActive: boolean;
      timezone: string;
      oneOffDate: string;
      oneOffTime: string;
    }
  | {
      key: string;
      scheduleKind: ScheduleKind;
      scheduleType: 'recurring';
      isActive: boolean;
      timezone: string;
      recurringWeekdays: number[];
      recurringTimeLocal: string;
    };

function newDraftSchedule(): DraftSchedule {
  const tz = 'America/New_York';
  return {
    key: crypto.randomUUID(),
    scheduleKind: 'live',
    scheduleType: 'one_off',
    isActive: true,
    timezone: tz,
    oneOffDate: DateTime.now().setZone(tz).plus({ days: 1 }).toFormat('yyyy-LL-dd'),
    oneOffTime: '08:00',
  };
}

function schedulesToPayload(drafts: DraftSchedule[]): SchedulePayload[] {
  return drafts.map((d) => {
    if (d.scheduleType === 'one_off') {
      const dt = DateTime.fromISO(`${d.oneOffDate}T${d.oneOffTime}`, { zone: d.timezone });
      if (!dt.isValid) {
        throw new Error('Invalid one-off date or time');
      }
      return {
        scheduleKind: d.scheduleKind,
        scheduleType: 'one_off',
        isActive: d.isActive,
        timezone: d.timezone,
        oneOffAt: dt.toUTC().toISO()!,
      };
    }
    if (!d.recurringWeekdays.length) {
      throw new Error('Each recurring schedule needs at least one weekday');
    }
    return {
      scheduleKind: d.scheduleKind,
      scheduleType: 'recurring',
      isActive: d.isActive,
      timezone: d.timezone,
      recurringWeekdays: d.recurringWeekdays,
      recurringTimeLocal: d.recurringTimeLocal || '08:00',
    };
  });
}

function dtoToDrafts(schedules: EmailSendListItem['schedules']): DraftSchedule[] {
  return schedules.map((s) => {
    if (s.scheduleType === 'one_off') {
      const dt = s.oneOffAt ? DateTime.fromISO(s.oneOffAt, { zone: 'utc' }).setZone(s.timezone) : DateTime.now();
      return {
        key: s.id,
        scheduleKind: s.scheduleKind,
        scheduleType: 'one_off',
        isActive: s.isActive,
        timezone: s.timezone,
        oneOffDate: dt.toFormat('yyyy-LL-dd'),
        oneOffTime: dt.toFormat('HH:mm'),
      };
    }
    return {
      key: s.id,
      scheduleKind: s.scheduleKind,
      scheduleType: 'recurring',
      isActive: s.isActive,
      timezone: s.timezone,
      recurringWeekdays: s.recurringWeekdays?.length ? [...s.recurringWeekdays] : [1, 2, 3, 4, 5],
      recurringTimeLocal: s.recurringTimeLocal || '08:00',
    };
  });
}

function buildSendPayload(send: EmailSendListItem, schedules: SchedulePayload[]): SendPayload {
  return {
    name: send.name.trim() || 'Untitled send',
    templateId: send.templateId,
    subject: send.subject,
    listId: send.listId,
    segmentId: send.segmentId,
    fromName: send.fromName,
    fromEmail: send.fromEmail,
    replyTo: send.replyTo,
    testSubject: send.testSubject,
    testListId: send.testListId,
    testSegmentId: send.testSegmentId,
    schedules,
  };
}

/** BFS to find the first FeaturedStoryXml block props in a template configuration. */
function findFirstFeaturedStoryInDoc(
  config: Record<string, { type: string; data?: unknown }>,
  rootId = 'root'
): { topicTid?: number | null; dashboardTagTid?: number | null } | null {
  const queue: string[] = [rootId];
  const visited = new Set<string>();
  while (queue.length > 0) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const block = config[id];
    if (!block) continue;
    if (block.type === 'FeaturedStoryXml') {
      const props = (block.data as { props?: Record<string, unknown> } | undefined)?.props;
      return {
        topicTid: props?.topicTid as number | null | undefined,
        dashboardTagTid: props?.dashboardTagTid as number | null | undefined,
      };
    }
    const data = block.data as Record<string, unknown> | undefined;
    const props = data?.props as Record<string, unknown> | undefined;
    const childIds: string[] = [];
    if (Array.isArray(data?.childrenIds)) {
      for (const c of data.childrenIds as unknown[]) if (typeof c === 'string') childIds.push(c);
    }
    if (Array.isArray(props?.childrenIds)) {
      for (const c of props.childrenIds as unknown[]) if (typeof c === 'string') childIds.push(c);
    }
    const columns = props?.columns as Array<{ childrenIds?: unknown }> | undefined;
    if (columns) {
      for (const col of columns) {
        if (Array.isArray(col?.childrenIds)) {
          for (const c of col.childrenIds as unknown[]) if (typeof c === 'string') childIds.push(c);
        }
      }
    }
    queue.push(...childIds);
  }
  return null;
}

function ScheduleFormDialog({
  open,
  onClose,
  send,
  mode,
  scheduleId,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  send: EmailSendListItem | null;
  mode: 'add' | 'edit';
  scheduleId: string | null;
  onSaved: () => Promise<void>;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const tzOptions = useMemo(() => timezones(), []);
  const [draft, setDraft] = useState<DraftSchedule | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !send) {
      setDraft(null);
      return;
    }
    setFormError(null);
    if (mode === 'add') {
      setDraft(newDraftSchedule());
    } else if (scheduleId) {
      const d = dtoToDrafts(send.schedules).find((x) => x.key === scheduleId);
      setDraft(d ?? null);
    } else {
      setDraft(null);
    }
  }, [open, send, mode, scheduleId]);

  const updateDraft = (patch: Partial<DraftSchedule>) => {
    setDraft((prev) => (prev ? ({ ...prev, ...patch } as DraftSchedule) : null));
  };

  const handleSubmit = async () => {
    if (!send || !draft) return;
    setFormError(null);
    try {
      const base = dtoToDrafts(send.schedules);
      const nextDrafts: DraftSchedule[] =
        mode === 'add' ? [...base, draft] : base.map((d) => (d.key === draft.key ? draft : d));
      setSaving(true);
      await updateSend(send.id, buildSendPayload(send, schedulesToPayload(nextDrafts)));
      await onSaved();
      onClose();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const testHasConfig = Boolean(send?.testSubject?.trim() && send?.testListId?.trim());

  return (
    <Dialog
      open={open && Boolean(send)}
      onClose={() => !saving && onClose()}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      scroll="paper"
    >
      <DialogTitle sx={{ pb: fullScreen ? 1 : undefined }}>
        {mode === 'add' ? 'Add schedule' : 'Edit schedule'}
        {send && (
          <Typography variant="body2" color="text.secondary" component="span" sx={{ display: 'block', fontWeight: 400, mt: 0.5 }}>
            {send.name}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent dividers={fullScreen}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          {!draft && send && (
            <Alert severity="warning">
              {mode === 'edit' ? 'This schedule could not be loaded.' : 'Could not initialize a new schedule.'}
            </Alert>
          )}
          {draft && (
            <>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Kind</InputLabel>
                  <Select
                    label="Kind"
                    value={draft.scheduleKind}
                    onChange={(e) =>
                      updateDraft({ scheduleKind: e.target.value as ScheduleKind })
                    }
                  >
                    <MenuItem value="live">Live</MenuItem>
                    <MenuItem value="test" disabled={!testHasConfig}>
                      Test
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    value={draft.scheduleType}
                    onChange={(e) => {
                      const t = e.target.value as ScheduleType;
                      if (t === 'one_off') {
                        const tz = draft.timezone;
                        updateDraft({
                          scheduleType: 'one_off',
                          oneOffDate: DateTime.now().setZone(tz).plus({ days: 1 }).toFormat('yyyy-LL-dd'),
                          oneOffTime: '08:00',
                        } as Partial<DraftSchedule>);
                      } else {
                        updateDraft({
                          scheduleType: 'recurring',
                          recurringWeekdays: [1, 2, 3, 4, 5],
                          recurringTimeLocal: '08:00',
                        } as Partial<DraftSchedule>);
                      }
                    }}
                  >
                    <MenuItem value="one_off">One-off</MenuItem>
                    <MenuItem value="recurring">Recurring</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={draft.isActive}
                      onChange={(_, c) => updateDraft({ isActive: c })}
                    />
                  }
                  label="Active"
                />
              </Stack>
              <FormControl fullWidth size="small">
                <InputLabel>Timezone</InputLabel>
                <Select
                  label="Timezone"
                  value={draft.timezone}
                  onChange={(e) => updateDraft({ timezone: e.target.value })}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 280 } } }}
                >
                  {tzOptions.map((z) => (
                    <MenuItem key={z} value={z}>
                      {z}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {draft.scheduleType === 'one_off' ? (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Date"
                    type="date"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={draft.oneOffDate}
                    onChange={(e) => updateDraft({ oneOffDate: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    label="Time"
                    type="time"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    value={draft.oneOffTime}
                    onChange={(e) => updateDraft({ oneOffTime: e.target.value })}
                    fullWidth
                  />
                </Stack>
              ) : (
                <>
                  <Typography variant="caption" color="text.secondary">
                    Weekdays (local)
                  </Typography>
                  <FormGroup row>
                    {WEEKDAYS.map((w) => (
                      <FormControlLabel
                        key={w.value}
                        control={
                          <Checkbox
                            size="small"
                            checked={draft.recurringWeekdays.includes(w.value)}
                            onChange={(_, c) => {
                              const set = new Set(draft.recurringWeekdays);
                              if (c) set.add(w.value);
                              else set.delete(w.value);
                              updateDraft({
                                recurringWeekdays: [...set].sort((a, b) => a - b),
                              });
                            }}
                          />
                        }
                        label={w.label}
                      />
                    ))}
                  </FormGroup>
                  <TextField
                    label="Time (HH:mm)"
                    size="small"
                    value={draft.recurringTimeLocal}
                    onChange={(e) => updateDraft({ recurringTimeLocal: e.target.value })}
                    placeholder="08:00"
                    fullWidth
                  />
                </>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: fullScreen ? 2 : undefined, py: fullScreen ? 2 : undefined, flexShrink: 0 }}>
        <Button onClick={onClose} disabled={saving} size={fullScreen ? 'large' : 'medium'}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={saving || !draft}
          size={fullScreen ? 'large' : 'medium'}
        >
          {saving ? <CircularProgress size={20} /> : 'Save schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function SendsTab({ isCompact = false }: { isCompact?: boolean }) {
  const [sends, setSends] = useState<EmailSendListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionBusy, setActionBusy] = useState<string | null>(null);
  const [scheduleDialog, setScheduleDialog] = useState<{
    sendId: string;
    mode: 'add' | 'edit';
    scheduleId: string | null;
  } | null>(null);
  const [scheduleActionBusy, setScheduleActionBusy] = useState<string | null>(null);
  const [sendToggleBusy, setSendToggleBusy] = useState<string | null>(null);
  const [scheduleToggleKey, setScheduleToggleKey] = useState<string | null>(null);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    const silent = opts?.silent === true;
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const [s, t] = await Promise.all([fetchSends(includeInactive), fetchTemplates()]);
      setSends(s);
      setTemplates(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sends');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [includeInactive]);

  const isFirstLoadRef = useRef(true);
  useEffect(() => {
    // First fetch shows the page spinner; later refetches (e.g. includeInactive) stay mounted so UI state (accordions) persists
    load({ silent: !isFirstLoadRef.current });
    isFirstLoadRef.current = false;
  }, [load]);

  const refreshSends = useCallback(() => load({ silent: true }), [load]);

  const handlePreviewTemplate = useCallback((row: EmailSendListItem) => {
    const hash = `#template/${row.templateSlug}`;
    window.location.hash = hash;
    setCurrentView('editor');
    void loadTemplateFromHash(hash).then(() => {
      setSelectedMainTab('preview');
    });
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (row: EmailSendListItem) => {
    setEditingId(row.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Permanently delete this send and all of its schedules? This cannot be undone.'
      )
    ) {
      return;
    }
    setActionBusy(id);
    try {
      await deleteSend(id);
      if (editingId === id) {
        setDialogOpen(false);
        setEditingId(null);
      }
      if (scheduleDialog?.sendId === id) {
        setScheduleDialog(null);
      }
      await refreshSends();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setActionBusy(null);
    }
  };

  const handleToggleSendActive = async (sendId: string, active: boolean) => {
    setSendToggleBusy(sendId);
    try {
      await patchSendActive(sendId, active);
      await refreshSends();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update send');
    } finally {
      setSendToggleBusy(null);
    }
  };

  const handleToggleScheduleActive = async (sendId: string, scheduleId: string, active: boolean) => {
    const key = `${sendId}:${scheduleId}`;
    setScheduleToggleKey(key);
    try {
      await patchScheduleActive(sendId, scheduleId, active);
      await refreshSends();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update schedule');
    } finally {
      setScheduleToggleKey(null);
    }
  };

  const handleExecute = async (id: string, mode: 'live' | 'test') => {
    const label = mode === 'test' ? 'test' : 'live';
    if (!window.confirm(`Send ${label} campaign now?`)) return;
    setActionBusy(`${id}-${mode}`);
    try {
      await executeSend(id, mode);
      await refreshSends();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Send failed');
    } finally {
      setActionBusy(null);
    }
  };

  const scheduleDialogSend = scheduleDialog ? sends.find((s) => s.id === scheduleDialog.sendId) ?? null : null;

  useEffect(() => {
    if (scheduleDialog && !scheduleDialogSend) {
      setScheduleDialog(null);
    }
  }, [scheduleDialog, scheduleDialogSend]);

  const handleScheduleDelete = async (sendId: string, scheduleId: string) => {
    if (!window.confirm('Permanently delete this schedule? This cannot be undone.')) return;
    setScheduleActionBusy(sendId);
    try {
      await deleteSchedule(sendId, scheduleId);
      if (scheduleDialog?.sendId === sendId && scheduleDialog.scheduleId === scheduleId) {
        setScheduleDialog(null);
      }
      await refreshSends();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete schedule');
    } finally {
      setScheduleActionBusy(null);
    }
  };

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
          Sends &amp; schedules
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={includeInactive}
                onChange={(_, c) => setIncludeInactive(c)}
                size={isCompact ? 'medium' : 'small'}
              />
            }
            label="Show inactive"
            sx={{ mr: 0, ml: isCompact ? 0 : undefined }}
          />
          <Button
            variant="text"
            color="inherit"
            size="small"
            startIcon={<Add fontSize="small" />}
            onClick={openCreate}
            sx={{ textTransform: 'none', fontWeight: 500, color: 'text.secondary' }}
          >
            New send
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 4 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Loading…</Typography>
        </Stack>
      ) : sends.length === 0 ? (
        <Alert severity="info">No saved sends yet. Create one to reuse template, audience, and schedules.</Alert>
      ) : (
        <Stack spacing={2}>
          {sends.map((row) => (
            <SendListCard
              key={row.id}
              row={row}
              isCompact={isCompact}
              actionBusy={actionBusy}
              sendToggleBusy={sendToggleBusy === row.id}
              scheduleToggleKey={scheduleToggleKey}
              scheduleActionsDisabled={
                (scheduleDialog?.sendId === row.id && Boolean(scheduleDialog)) ||
                scheduleActionBusy === row.id ||
                sendToggleBusy === row.id
              }
              onExecute={handleExecute}
              onEdit={openEdit}
              onDelete={handleDelete}
              onToggleSendActive={handleToggleSendActive}
              onScheduleAdd={(sendId) => setScheduleDialog({ sendId, mode: 'add', scheduleId: null })}
              onScheduleEdit={(sendId, sid) => setScheduleDialog({ sendId, mode: 'edit', scheduleId: sid })}
              onScheduleDelete={handleScheduleDelete}
              onToggleScheduleActive={handleToggleScheduleActive}
              onPreviewTemplate={handlePreviewTemplate}
            />
          ))}
        </Stack>
      )}

      <SendFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        editingId={editingId}
        templates={templates}
        initial={editingId ? sends.find((s) => s.id === editingId) ?? null : null}
        onSaved={async () => {
          setDialogOpen(false);
          await refreshSends();
        }}
      />

      <ScheduleFormDialog
        open={Boolean(scheduleDialog && scheduleDialogSend)}
        onClose={() => setScheduleDialog(null)}
        send={scheduleDialogSend}
        mode={scheduleDialog?.mode ?? 'add'}
        scheduleId={scheduleDialog?.scheduleId ?? null}
        onSaved={refreshSends}
      />
    </Stack>
  );
}

function SendFormDialog({
  open,
  onClose,
  editingId,
  templates,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  editingId: string | null;
  templates: TemplateListItem[];
  initial: EmailSendListItem | null;
  onSaved: () => Promise<void>;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [subject, setSubject] = useState('');
  const [listId, setListId] = useState('');
  const [segmentId, setSegmentId] = useState<number | ''>('');
  const [fromName, setFromName] = useState(DEFAULT_FROM.fromName);
  const [fromEmail, setFromEmail] = useState(DEFAULT_FROM.fromEmail);
  const [replyTo, setReplyTo] = useState(DEFAULT_FROM.replyTo);
  const [testSubject, setTestSubject] = useState('');
  const [testListId, setTestListId] = useState('');
  const [testSegmentId, setTestSegmentId] = useState<number | ''>('');
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [testSegments, setTestSegments] = useState<Segment[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [featuredTitlePreview, setFeaturedTitlePreview] = useState<string>('');

  useEffect(() => {
    if (!open) return;
    fetchAudiences().then(setAudiences).catch(() => setAudiences([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setTemplateId(initial.templateId);
      setSubject(initial.subject);
      setListId(initial.listId);
      setSegmentId(initial.segmentId ?? '');
      setFromName(initial.fromName);
      setFromEmail(initial.fromEmail);
      setReplyTo(initial.replyTo);
      setTestSubject(initial.testSubject ?? '');
      setTestListId(initial.testListId ?? '');
      setTestSegmentId(initial.testSegmentId ?? '');
    } else {
      setName('');
      setTemplateId(templates[0]?.id ?? '');
      setSubject('');
      setListId('');
      setSegmentId('');
      setFromName(DEFAULT_FROM.fromName);
      setFromEmail(DEFAULT_FROM.fromEmail);
      setReplyTo(DEFAULT_FROM.replyTo);
      setTestSubject('');
      setTestListId('');
      setTestSegmentId('');
    }
    setFormError(null);
  }, [open, initial, templates]);

  useEffect(() => {
    if (!listId) {
      setSegments([]);
      return;
    }
    fetchSegments(listId).then(setSegments).catch(() => setSegments([]));
  }, [listId]);

  useEffect(() => {
    if (!testListId) {
      setTestSegments([]);
      return;
    }
    fetchSegments(testListId).then(setTestSegments).catch(() => setTestSegments([]));
  }, [testListId]);

  useEffect(() => {
    if (!open || !templateId) {
      setFeaturedTitlePreview('');
      return;
    }
    const slug = templates.find((t) => t.id === templateId)?.slug;
    if (!slug) {
      setFeaturedTitlePreview('');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const tmpl = await fetchTemplate(slug);
        if (cancelled) return;
        const cfg = tmpl.configuration as Record<string, { type: string; data?: unknown }>;
        const featuredBlock = findFirstFeaturedStoryInDoc(cfg, 'root');
        if (!featuredBlock) return;
        const feedUrl = buildFeaturedStoryFeedUrl(featuredBlock.topicTid, featuredBlock.dashboardTagTid);
        const res = await fetch(feedUrl);
        if (cancelled || !res.ok) return;
        const xml = await res.text();
        if (!cancelled) setFeaturedTitlePreview(getFirstFeaturedStoryTitleFromXml(xml));
      } catch {
        // preview is best-effort; leave empty on error
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, templateId, templates]);

  const subjectPreview = useMemo(() => {
    if (!subject.includes(HEADING_DATE_WILDCARD) && !subject.includes(HEADING_FEATURED_STORY_TITLE_WILDCARD)) {
      return null;
    }
    return expandHeadingWildcards(subject, new Date(), { featuredStoryFirstTitle: featuredTitlePreview });
  }, [subject, featuredTitlePreview]);

  const handleSubmit = async () => {
    setFormError(null);
    if (!templateId || !subject.trim() || !listId) {
      setFormError('Template, subject, and audience are required.');
      return;
    }
    try {
      const schedulesPayload =
        editingId && initial
          ? schedulesToPayload(dtoToDrafts(initial.schedules))
          : [];
      const payload = {
        name: name.trim() || 'Untitled send',
        templateId,
        subject: subject.trim(),
        listId,
        segmentId: segmentId === '' ? null : segmentId,
        fromName: fromName.trim(),
        fromEmail: fromEmail.trim(),
        replyTo: replyTo.trim(),
        testSubject: testSubject.trim() || null,
        testListId: testListId.trim() || null,
        testSegmentId: testSegmentId === '' ? null : testSegmentId,
        schedules: schedulesPayload,
      };
      setSaving(true);
      if (editingId) {
        await updateSend(editingId, payload);
      } else {
        await createSend(payload);
      }
      await onSaved();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => !saving && onClose()}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      scroll="paper"
    >
      <DialogTitle sx={{ pb: fullScreen ? 1 : undefined }}>{editingId ? 'Edit send' : 'New send'}</DialogTitle>
      <DialogContent dividers={fullScreen}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="Display name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <FormControl fullWidth required>
            <InputLabel>Template</InputLabel>
            <Select
              value={templateId}
              label="Template"
              onChange={(e) => setTemplateId(e.target.value)}
            >
              {templates.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name} ({t.slug})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            required
            helperText={subjectPreview !== null ? `Preview: ${subjectPreview}` : undefined}
            FormHelperTextProps={subjectPreview !== null ? { sx: { fontStyle: 'italic' } } : undefined}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth required>
              <InputLabel>Audience</InputLabel>
              <Select value={listId} label="Audience" onChange={(e) => setListId(e.target.value)}>
                {audiences.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Segment</InputLabel>
              <Select
                value={segmentId === '' ? '' : segmentId}
                label="Segment"
                onChange={(e) => setSegmentId(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <MenuItem value="">None</MenuItem>
                {segments.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Typography variant="subtitle2" color="text.secondary">
            From / reply
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="From name" value={fromName} onChange={(e) => setFromName(e.target.value)} fullWidth />
            <TextField
              label="From email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              fullWidth
            />
            <TextField label="Reply-to" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} fullWidth />
          </Stack>
          <Typography variant="subtitle2" color="text.secondary">
            Test overrides (optional)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            When set, you can add test schedules and use “Send test”. Test segment requires test audience.
          </Typography>
          <TextField
            label="Test subject"
            value={testSubject}
            onChange={(e) => setTestSubject(e.target.value)}
            fullWidth
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Test audience</InputLabel>
              <Select
                value={testListId}
                label="Test audience"
                onChange={(e) => setTestListId(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {audiences.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth disabled={!testListId}>
              <InputLabel>Test segment</InputLabel>
              <Select
                value={testSegmentId === '' ? '' : testSegmentId}
                label="Test segment"
                onChange={(e) => setTestSegmentId(e.target.value === '' ? '' : Number(e.target.value))}
              >
                <MenuItem value="">None</MenuItem>
                {testSegments.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Add or change schedules in each send’s <strong>Schedules</strong> section on the list.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: fullScreen ? 2 : undefined, py: fullScreen ? 2 : undefined, flexShrink: 0 }}>
        <Button onClick={onClose} disabled={saving} size={fullScreen ? 'large' : 'medium'}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving} size={fullScreen ? 'large' : 'medium'}>
          {saving ? <CircularProgress size={20} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
