import React from 'react';

import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { filterDashboardTagTerms, type RheumnowTermRow } from '@usewaypoint/rheumnow-xml-topic';

import { useRheumnowTermsRows } from './useRheumnowTermsRows';

type RheumnowDashboardTagSelectProps = {
  value: number | null | undefined;
  onChange: (dashboardTagTid: number | null) => void;
};

export default function RheumnowDashboardTagSelect({ value, onChange }: RheumnowDashboardTagSelectProps) {
  const { rows, loading, error } = useRheumnowTermsRows();
  const tags: RheumnowTermRow[] = rows
    ? filterDashboardTagTerms(rows).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      )
    : [];

  const selectValue = value == null ? '' : String(value);

  if (loading) {
    return (
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.5 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading dashboard tags…
        </Typography>
      </Stack>
    );
  }

  return (
    <FormControl fullWidth size="small" error={Boolean(error)}>
      <InputLabel id="rheumnow-dashboard-tag-label">Dashboard tag</InputLabel>
      <Select
        labelId="rheumnow-dashboard-tag-label"
        label="Dashboard tag"
        value={selectValue}
        onChange={(e) => {
          const v = e.target.value;
          if (v === '') {
            onChange(null);
          } else {
            onChange(Number(v));
          }
        }}
      >
        <MenuItem value="">All dashboard tags</MenuItem>
        {tags.map((t) => (
          <MenuItem key={t.tid} value={String(t.tid)}>
            {t.name}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
