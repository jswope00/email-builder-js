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
import { filterTopicTerms, type RheumnowTermRow } from '@usewaypoint/rheumnow-xml-topic';

import { useRheumnowTermsRows } from './useRheumnowTermsRows';

type RheumnowTopicSelectProps = {
  value: number | null | undefined;
  onChange: (topicTid: number | null) => void;
};

export default function RheumnowTopicSelect({ value, onChange }: RheumnowTopicSelectProps) {
  const { rows, loading, error } = useRheumnowTermsRows();
  const topics: RheumnowTermRow[] = rows
    ? filterTopicTerms(rows).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      )
    : [];

  const selectValue = value == null ? '' : String(value);

  if (loading) {
    return (
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ py: 0.5 }}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading topics…
        </Typography>
      </Stack>
    );
  }

  return (
    <FormControl fullWidth size="small" error={Boolean(error)}>
      <InputLabel id="rheumnow-topic-label">Topic</InputLabel>
      <Select
        labelId="rheumnow-topic-label"
        label="Topic"
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
        <MenuItem value="">All topics</MenuItem>
        {topics.map((t) => (
          <MenuItem key={t.tid} value={String(t.tid)}>
            {t.name}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
