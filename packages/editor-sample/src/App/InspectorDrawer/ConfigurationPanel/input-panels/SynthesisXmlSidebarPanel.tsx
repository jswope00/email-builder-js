import React, { useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  emptySynthesisDigestItem,
  emptySynthesisTheme,
  hasSynthesisContent,
  SYNTHESIS_XML_FEED_URLS,
  SynthesisContentType,
  SynthesisDigest,
  SynthesisTheme,
  SynthesisXmlProps,
  SynthesisXmlPropsDefaults,
  SynthesisXmlPropsSchema,
} from '@usewaypoint/block-synthesis-xml';

import { generateSynthesis } from '../../../../api/synthesis';
import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type SynthesisXmlSidebarPanelProps = {
  data: SynthesisXmlProps;
  setData: (v: SynthesisXmlProps) => void;
};

type DateFilterFields = {
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
};

const CONTENT_TYPE_OPTIONS: Array<{ value: SynthesisContentType; label: string }> = [
  { value: 'article', label: 'Article' },
  { value: 'video', label: 'Video' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'tweet', label: 'Tweet' },
];

function sectionLabel(text: string) {
  return (
    <Typography
      variant="caption"
      sx={{
        color: 'text.secondary',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        mt: 1,
        display: 'block',
      }}
    >
      {text}
    </Typography>
  );
}

export default function SynthesisXmlSidebarPanel({ data, setData }: SynthesisXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateInfo, setGenerateInfo] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const updateData = (d: unknown) => {
    const res = SynthesisXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const updateProp = (key: string, value: unknown) =>
    updateData({ ...data, props: { ...data.props, [key]: value } });

  const title = data.props?.title ?? SynthesisXmlPropsDefaults.title;
  const dateFilterProps = (data.props ?? {}) as DateFilterFields;
  const createdStartDate = dateFilterProps.createdStartDate ?? '';
  const createdEndDate = dateFilterProps.createdEndDate ?? '';
  const createdRelativeDays = dateFilterProps.createdRelativeDays;

  const includeVideos = data.props?.includeVideos ?? SynthesisXmlPropsDefaults.includeVideos;
  const includeArticles = data.props?.includeArticles ?? SynthesisXmlPropsDefaults.includeArticles;
  const includeTweets = data.props?.includeTweets ?? SynthesisXmlPropsDefaults.includeTweets;
  const includePodcasts = data.props?.includePodcasts ?? SynthesisXmlPropsDefaults.includePodcasts;
  const specialInstructions =
    data.props?.specialInstructions ?? SynthesisXmlPropsDefaults.specialInstructions;

  const digest: SynthesisDigest = data.props?.digest ?? { themes: [] };
  const themes = digest.themes ?? [];
  const hasExistingContent = hasSynthesisContent(data.props);

  const setDigest = (next: SynthesisDigest) => {
    updateData({
      ...data,
      props: {
        ...data.props,
        digest: next,
        // Clear legacy HTML once structured content is in play.
        generatedHtml: null,
      },
    });
  };

  const updateTheme = (themeIndex: number, patch: Partial<SynthesisTheme>) => {
    const nextThemes = themes.map((theme, i) => (i === themeIndex ? { ...theme, ...patch } : theme));
    setDigest({ themes: nextThemes });
  };

  const updateThemeItem = (
    themeIndex: number,
    itemIndex: number,
    patch: Partial<SynthesisTheme['items'][number]>
  ) => {
    const theme = themes[themeIndex];
    if (!theme) return;
    const nextItems = (theme.items ?? []).map((item, i) => (i === itemIndex ? { ...item, ...patch } : item));
    updateTheme(themeIndex, { items: nextItems });
  };

  const runGenerate = async () => {
    setConfirmOpen(false);
    setGenerating(true);
    setGenerateError(null);
    setGenerateInfo(null);
    try {
      const result = await generateSynthesis({
        topicTid: data.props?.topicTid ?? null,
        dashboardTagTid: data.props?.dashboardTagTid ?? null,
        createdStartDate: data.props?.createdStartDate ?? null,
        createdEndDate: data.props?.createdEndDate ?? null,
        createdRelativeDays: data.props?.createdRelativeDays ?? null,
        includeVideos,
        includeArticles,
        includeTweets,
        includePodcasts,
        specialInstructions: specialInstructions.trim() ? specialInstructions : null,
      });
      setDigest(result.digest);
      setEditorOpen(true);
      setGenerateInfo(
        `Generated ${result.digest.themes.length} theme${result.digest.themes.length === 1 ? '' : 's'} from ${result.itemCount} items (videos ${result.itemsByType.video}, articles ${result.itemsByType.article}, tweets ${result.itemsByType.tweet}, podcasts ${result.itemsByType.podcast}).`
      );
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to generate synthesis');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateClick = () => {
    if (hasExistingContent) {
      setConfirmOpen(true);
      return;
    }
    void runGenerate();
  };

  return (
    <BaseSidebarPanel
      title="AI Synthesis Block"
      subtitle={
        <Stack spacing={0.25}>
          {SYNTHESIS_XML_FEED_URLS.map((url) => (
            <Typography
              key={url}
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', wordBreak: 'break-all' }}
            >
              {url}
            </Typography>
          ))}
        </Stack>
      }
    >
      <TextInput label="Title (optional)" defaultValue={title} onChange={(v) => updateProp('title', v)} />

      <RheumnowTopicSelect
        value={data.props?.topicTid ?? null}
        onChange={(topicTid) => updateProp('topicTid', topicTid ?? null)}
      />
      <RheumnowDashboardTagSelect
        value={data.props?.dashboardTagTid ?? null}
        onChange={(dashboardTagTid) => updateProp('dashboardTagTid', dashboardTagTid ?? null)}
      />
      <TextField
        fullWidth
        size="small"
        type="date"
        label="Created start date"
        value={createdStartDate}
        InputLabelProps={{ shrink: true }}
        onChange={(ev) => updateProp('createdStartDate', ev.target.value || null)}
      />
      <TextField
        fullWidth
        size="small"
        type="date"
        label="Created end date"
        value={createdEndDate}
        InputLabelProps={{ shrink: true }}
        onChange={(ev) => updateProp('createdEndDate', ev.target.value || null)}
      />
      <TextField
        fullWidth
        size="small"
        type="number"
        label="Relative days (Today − N)"
        value={typeof createdRelativeDays === 'number' ? createdRelativeDays : ''}
        InputProps={{ inputProps: { min: 0, step: 1 } }}
        onChange={(ev) => {
          const raw = ev.target.value.trim();
          if (raw === '') {
            updateProp('createdRelativeDays', null);
            return;
          }
          if (/^\d+$/.test(raw)) updateProp('createdRelativeDays', parseInt(raw, 10));
        }}
      />

      {sectionLabel('Special Instructions')}
      <TextInput
        label="Special instructions (optional)"
        rows={4}
        defaultValue={specialInstructions}
        onChange={(v) => updateProp('specialInstructions', v)}
        helperText="Included with the AI prompt when generating. e.g. emphasize biosimilars, skip tweets."
      />

      {sectionLabel('Item Types')}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={includeVideos}
              onChange={(ev) => updateProp('includeVideos', ev.target.checked)}
              size="small"
            />
          }
          label="Videos"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeArticles}
              onChange={(ev) => updateProp('includeArticles', ev.target.checked)}
              size="small"
            />
          }
          label="Articles"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includeTweets}
              onChange={(ev) => updateProp('includeTweets', ev.target.checked)}
              size="small"
            />
          }
          label="Tweets"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={includePodcasts}
              onChange={(ev) => updateProp('includePodcasts', ev.target.checked)}
              size="small"
            />
          }
          label="Podcasts"
        />
      </FormGroup>

      <Stack spacing={1} sx={{ mt: 1 }}>
        <Button
          variant="contained"
          startIcon={<AutoAwesomeIcon />}
          onClick={handleGenerateClick}
          disabled={generating}
        >
          {generating ? 'Generating…' : hasExistingContent ? 'Regenerate' : 'Generate'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => setEditorOpen(true)}
        >
          Edit content
        </Button>
      </Stack>

      {generateError ? (
        <Alert severity="error" onClose={() => setGenerateError(null)}>
          {generateError}
        </Alert>
      ) : null}
      {generateInfo ? (
        <Alert severity="success" onClose={() => setGenerateInfo(null)}>
          {generateInfo}
        </Alert>
      ) : null}

      {sectionLabel('Digest')}
      <Typography variant="body2" color="text.secondary">
        {themes.length === 0
          ? 'No themes yet. Generate to create an editable digest.'
          : `${themes.length} theme${themes.length === 1 ? '' : 's'} · ${themes.reduce(
              (sum, t) => sum + (t.items?.length ?? 0),
              0
            )} items. Use Edit content to revise headings, hooks, articles, and conclusions.`}
      </Typography>

      <MultiStylePropertyPanel
        names={['padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Overwrite existing synthesis?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This block already has generated content. Generating again will overwrite the current
            digest, including any manual edits.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={() => void runGenerate()} color="error" variant="contained" autoFocus>
            Overwrite
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle>Edit synthesis content</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Edit plain-language fields below. The email HTML is rebuilt automatically — no markup
            needed.
          </Typography>

          {themes.length === 0 ? (
            <Alert severity="info">No themes yet. Generate a digest or add a theme manually.</Alert>
          ) : null}

          <Stack spacing={1}>
            {themes.map((theme, themeIndex) => (
              <Accordion key={themeIndex} defaultExpanded={themeIndex === 0} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%', pr: 1 }}
                  >
                    <Typography fontWeight={600} noWrap sx={{ maxWidth: '85%' }}>
                      {theme.heading || `Theme ${themeIndex + 1}`}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="Remove theme"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setDigest({ themes: themes.filter((_, i) => i !== themeIndex) });
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Theme heading"
                      value={theme.heading}
                      onChange={(ev) => updateTheme(themeIndex, { heading: ev.target.value })}
                      helperText='e.g. "I. THE JAK INHIBITOR RECKONING"'
                    />
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Hook"
                      value={theme.hook}
                      onChange={(ev) => updateTheme(themeIndex, { hook: ev.target.value })}
                      helperText="2–3 sentences of editorial framing"
                    />

                    <Divider />
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2">Articles / media</Typography>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() =>
                          updateTheme(themeIndex, {
                            items: [...(theme.items ?? []), emptySynthesisDigestItem()],
                          })
                        }
                      >
                        Add item
                      </Button>
                    </Stack>

                    <Stack spacing={2}>
                      {(theme.items ?? []).map((item, itemIndex) => (
                        <Box
                          key={itemIndex}
                          sx={{
                            p: 1.5,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                          }}
                        >
                          <Stack spacing={1.5}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Typography variant="caption" color="text.secondary">
                                Item {itemIndex + 1}
                              </Typography>
                              <IconButton
                                size="small"
                                aria-label="Remove item"
                                onClick={() =>
                                  updateTheme(themeIndex, {
                                    items: (theme.items ?? []).filter((_, i) => i !== itemIndex),
                                  })
                                }
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                            <TextField
                              fullWidth
                              size="small"
                              label="Title"
                              value={item.title}
                              onChange={(ev) =>
                                updateThemeItem(themeIndex, itemIndex, { title: ev.target.value })
                              }
                            />
                            <TextField
                              fullWidth
                              size="small"
                              label="URL (optional)"
                              value={item.url ?? ''}
                              onChange={(ev) =>
                                updateThemeItem(themeIndex, itemIndex, {
                                  url: ev.target.value || '',
                                })
                              }
                            />
                            <FormControl fullWidth size="small">
                              <InputLabel id={`content-type-${themeIndex}-${itemIndex}`}>
                                Content type
                              </InputLabel>
                              <Select
                                labelId={`content-type-${themeIndex}-${itemIndex}`}
                                label="Content type"
                                value={item.contentType ?? 'article'}
                                onChange={(ev) =>
                                  updateThemeItem(themeIndex, itemIndex, {
                                    contentType: ev.target.value as SynthesisContentType,
                                  })
                                }
                              >
                                {CONTENT_TYPE_OPTIONS.map((opt) => (
                                  <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>

                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Conclusions"
                      value={theme.conclusions}
                      onChange={(ev) => updateTheme(themeIndex, { conclusions: ev.target.value })}
                      helperText="The “so what” for this theme"
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>

          <Button
            sx={{ mt: 2 }}
            startIcon={<AddIcon />}
            onClick={() => setDigest({ themes: [...themes, emptySynthesisTheme(themes.length)] })}
          >
            Add theme
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditorOpen(false)} variant="contained">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </BaseSidebarPanel>
  );
}
