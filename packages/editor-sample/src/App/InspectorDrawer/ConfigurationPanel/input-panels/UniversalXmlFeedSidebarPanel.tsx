import React, { useRef, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

import {
  BLOCK_TYPE_OPTIONS,
  FIELD_TYPE_OPTIONS,
  getBlockTitleByType,
  parseXmlToFieldNames,
  parseXmlToItems,
  UniversalXmlFeedProps,
  UniversalXmlFeedPropsDefaults,
  UniversalXmlFeedPropsSchema,
} from '@nattusia/block-xml-feed';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type UniversalXmlFeedSidebarPanelProps = {
  data: UniversalXmlFeedProps;
  setData: (v: UniversalXmlFeedProps) => void;
};

export default function UniversalXmlFeedSidebarPanel({
  data,
  setData,
}: UniversalXmlFeedSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);
  const [loading, setLoading] = useState(false);
  const [parseLoading, setParseLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [loadedFieldNames, setLoadedFieldNames] = useState<string[]>([]);
  const urlInputRef = useRef('');

  const safeData: UniversalXmlFeedProps = {
    style: data?.style ?? null,
    props: data?.props ?? {
      blockType: UniversalXmlFeedPropsDefaults.blockType,
      url: UniversalXmlFeedPropsDefaults.url,
      displayBlockTitle: UniversalXmlFeedPropsDefaults.displayBlockTitle,
      numberOfItems: UniversalXmlFeedPropsDefaults.numberOfItems,
      fieldOrder: UniversalXmlFeedPropsDefaults.fieldOrder,
      fieldMapping: UniversalXmlFeedPropsDefaults.fieldMapping,
    },
  };

  const updateData = (d: unknown) => {
    const res = UniversalXmlFeedPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const blockType = safeData.props?.blockType ?? UniversalXmlFeedPropsDefaults.blockType;
  const url = safeData.props?.url ?? UniversalXmlFeedPropsDefaults.url;
  const displayBlockTitle = safeData.props?.displayBlockTitle ?? UniversalXmlFeedPropsDefaults.displayBlockTitle;
  const numberOfItems = safeData.props?.numberOfItems ?? UniversalXmlFeedPropsDefaults.numberOfItems;
  const fieldMapping = safeData.props?.fieldMapping ?? UniversalXmlFeedPropsDefaults.fieldMapping;

  urlInputRef.current = url ?? '';

  const handleLoad = async () => {
    const urlToFetch = (urlInputRef.current || url || '').trim();
    if (!urlToFetch) {
      setLoadError('Enter a URL first.');
      return;
    }
    setLoadError(null);
    setLoading(true);
    try {
      const response = await fetch(urlToFetch);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const names = parseXmlToFieldNames(text);
      setLoadedFieldNames(names);
      // Build mapping in XML order (names order), preserve existing types
      const nextMapping = {} as Record<string, string>;
      names.forEach((name) => {
        nextMapping[name] = fieldMapping[name] ?? 'text';
      });
      updateData({
        ...safeData,
        props: { ...safeData.props, fieldOrder: names, fieldMapping: nextMapping },
      });
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleParseAndShow = async () => {
    const urlToFetch = (urlInputRef.current || url || '').trim();
    if (!urlToFetch) {
      setParseError('Enter a URL first.');
      return;
    }
    setParseError(null);
    setParseLoading(true);
    try {
      const response = await fetch(urlToFetch);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const allItems = parseXmlToItems(text);
      const num = numberOfItems ?? 0;
      const itemsToStore = num > 0 ? allItems.slice(0, num) : allItems;
      updateData({
        ...safeData,
        props: { ...safeData.props, url: urlToFetch, previewItems: itemsToStore },
      });
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to parse XML.');
    } finally {
      setParseLoading(false);
    }
  };

  const tableRows = loadedFieldNames.length > 0 ? loadedFieldNames : Object.keys(fieldMapping ?? {});
  const canParseAndShow = (urlInputRef.current || url || '').trim().length > 0;

  return (
    <BaseSidebarPanel title="Universal XML Feed Block">
      <TextField
        select
        fullWidth
        variant="standard"
        label="Block type"
        value={blockType ?? ''}
        onChange={(ev) => {
          const newBlockType = ev.target.value;
          updateData({
            ...safeData,
            props: {
              ...safeData.props,
              blockType: newBlockType,
              title: getBlockTitleByType(newBlockType) || undefined,
            },
          });
        }}
      >
        {BLOCK_TYPE_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      <FormControlLabel
        control={
          <Checkbox
            checked={displayBlockTitle ?? true}
            onChange={(e) => {
              updateData({
                ...safeData,
                props: { ...safeData.props, displayBlockTitle: e.target.checked },
              });
            }}
          />
        }
        label="Display Block Title"
        sx={{ mb: 1 }}
      />

      <TextField
        type="number"
        label="Items"
        fullWidth
        size="small"
        variant="standard"
        value={numberOfItems ?? 0}
        inputProps={{ min: 0, step: 1 }}
        helperText="0 = show all"
        onChange={(e) => {
          const v = Math.max(0, parseInt(String(e.target.value), 10) || 0);
          updateData({ ...safeData, props: { ...safeData.props, numberOfItems: v } });
        }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
        <TextInput
          label="URL"
          placeholder="https://example.com/feed.xml"
          defaultValue={url ?? ''}
          onChange={(v) => {
            urlInputRef.current = v;
            updateData({ ...safeData, props: { ...safeData.props, url: v } });
          }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={handleLoad}
          disabled={loading}
          sx={{ mt: 2, minWidth: 90 }}
        >
          {loading ? 'Loading…' : 'Load'}
        </Button>
      </Box>
      {loadError && (
        <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>{loadError}</Box>
      )}

      {tableRows.length > 0 && (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small" padding="none">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Field name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows.map((name) => (
                <TableRow key={name}>
                  <TableCell sx={{ fontFamily: 'monospace' }}>{name}</TableCell>
                  <TableCell>
                    <TextField
                      select
                      size="small"
                      variant="standard"
                      value={fieldMapping?.[name] ?? 'text'}
                      onChange={(ev) => {
                        const next = { ...(fieldMapping ?? {}), [name]: ev.target.value };
                        updateData({
                          ...safeData,
                          props: { ...safeData.props, fieldMapping: next },
                        });
                      }}
                      sx={{ minWidth: 100 }}
                    >
                      {FIELD_TYPE_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Button
        variant="contained"
        size="medium"
        onClick={handleParseAndShow}
        disabled={!canParseAndShow || parseLoading}
        fullWidth
      >
        {parseLoading ? 'Parsing…' : 'Parse & show'}
      </Button>
      {parseError && (
        <Box sx={{ color: 'error.main', fontSize: '0.875rem' }}>{parseError}</Box>
      )}

      <MultiStylePropertyPanel
        names={['padding']}
        value={safeData.style}
        onChange={(style) => updateData({ ...safeData, style })}
      />
    </BaseSidebarPanel>
  );
}
