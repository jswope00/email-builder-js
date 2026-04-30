import React, { useState } from 'react';

import { TextField, Typography } from '@mui/material';
import { CoverageXmlProps, CoverageXmlPropsDefaults, CoverageXmlPropsSchema } from '@usewaypoint/block-coverage-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type CoverageXmlSidebarPanelProps = {
  data: CoverageXmlProps;
  setData: (v: CoverageXmlProps) => void;
};

type DateFilterFields = {
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
};

export default function CoverageXmlSidebarPanel({ data, setData }: CoverageXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = CoverageXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const updateProp = (key: string, value: unknown) =>
    updateData({ ...data, props: { ...data.props, [key]: value } });

  const title = data.props?.title ?? CoverageXmlPropsDefaults.title;
  const dateFilterProps = (data.props ?? {}) as DateFilterFields;
  const createdStartDate = dateFilterProps.createdStartDate ?? '';
  const createdEndDate = dateFilterProps.createdEndDate ?? '';
  const createdRelativeDays = dateFilterProps.createdRelativeDays;

  return (
    <BaseSidebarPanel title="Coverage XML Block">

      {/* ── Content ─────────────────────────────────────────── */}
      <TextInput
        label="Title (optional)"
        defaultValue={title}
        onChange={(v) => updateProp('title', v)}
      />

      {/* ── Filters ─────────────────────────────────────────── */}
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
          if (raw === '') { updateProp('createdRelativeDays', null); return; }
          if (/^\d+$/.test(raw)) updateProp('createdRelativeDays', parseInt(raw, 10));
        }}
      />

      {/* ── Tile appearance ─────────────────────────────────── */}
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mt: 1, display: 'block' }}>
        Tile Style
      </Typography>
      <TextInput
        label="Background color"
        defaultValue={data.props?.tileBackgroundColor ?? ''}
        onChange={(v) => updateProp('tileBackgroundColor', v || null)}
      />
      <TextInput
        label="Text color"
        defaultValue={data.props?.tileTextColor ?? ''}
        onChange={(v) => updateProp('tileTextColor', v || null)}
      />
      <TextInput
        label="Border color"
        defaultValue={data.props?.tileBorderColor ?? ''}
        onChange={(v) => updateProp('tileBorderColor', v || null)}
      />
      <TextField
        fullWidth
        size="small"
        type="number"
        label="Border width (px)"
        value={typeof data.props?.tileBorderWidth === 'number' ? data.props.tileBorderWidth : ''}
        InputProps={{ inputProps: { min: 0, step: 1 } }}
        onChange={(ev) => {
          const raw = ev.target.value.trim();
          if (raw === '') { updateProp('tileBorderWidth', null); return; }
          const n = parseFloat(raw);
          if (Number.isFinite(n) && n >= 0) updateProp('tileBorderWidth', n);
        }}
      />

      {/* ── Icon image overrides ─────────────────────────────── */}
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', mt: 1, display: 'block' }}>
        Icon Image Overrides
      </Typography>
      <TextInput
        label="Videos image URL"
        defaultValue={data.props?.videoImageUrl ?? ''}
        onChange={(v) => updateProp('videoImageUrl', v || null)}
      />
      <TextInput
        label="Articles image URL"
        defaultValue={data.props?.articleImageUrl ?? ''}
        onChange={(v) => updateProp('articleImageUrl', v || null)}
      />
      <TextInput
        label="Tweets image URL"
        defaultValue={data.props?.tweetImageUrl ?? ''}
        onChange={(v) => updateProp('tweetImageUrl', v || null)}
      />
      <TextInput
        label="Podcasts image URL"
        defaultValue={data.props?.podcastImageUrl ?? ''}
        onChange={(v) => updateProp('podcastImageUrl', v || null)}
      />

      {/* ── Layout ──────────────────────────────────────────── */}
      <MultiStylePropertyPanel
        names={['padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
