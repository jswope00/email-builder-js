import React, { useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import {
  getBlockTitleByType,
  getEndpointByType,
  getPlugin,
  getPluginsList,
} from '../plugins/registry';
import { parseXmlToFieldNames, parseXmlToItems } from '../parseXml';
import {
  getDefaultFieldTypeForName,
  UniversalXmlFeedPropsDefaults,
  UniversalXmlFeedPropsSchema,
  type UniversalXmlFeedProps,
} from '../schema';

export type XmlFeedSidebarPanelProps = {
  data: UniversalXmlFeedProps;
  setData: (v: UniversalXmlFeedProps) => void;
};

export default function XmlFeedSidebarPanel({ data, setData }: XmlFeedSidebarPanelProps) {
  const [loading, setLoading] = useState(false);

  const safeData: UniversalXmlFeedProps = {
    style: data?.style ?? null,
    props: data?.props ?? {
      blockType: UniversalXmlFeedPropsDefaults.blockType,
      url: UniversalXmlFeedPropsDefaults.url,
      displayBlockTitle: UniversalXmlFeedPropsDefaults.displayBlockTitle,
      campaignTermIds: UniversalXmlFeedPropsDefaults.campaignTermIds,
      topicTermIds: UniversalXmlFeedPropsDefaults.topicTermIds,
      numberOfItems: UniversalXmlFeedPropsDefaults.numberOfItems,
      fieldOrder: UniversalXmlFeedPropsDefaults.fieldOrder,
      fieldMapping: UniversalXmlFeedPropsDefaults.fieldMapping,
      fieldWeights: UniversalXmlFeedPropsDefaults.fieldWeights,
      feedSlices: UniversalXmlFeedPropsDefaults.feedSlices,
      activeSliceIndex: UniversalXmlFeedPropsDefaults.activeSliceIndex,
    },
  };

  const updateData = (d: unknown) => {
    const res = UniversalXmlFeedPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
    }
  };

  const blockType = safeData.props?.blockType ?? UniversalXmlFeedPropsDefaults.blockType;
  const numberOfItems = safeData.props?.numberOfItems ?? UniversalXmlFeedPropsDefaults.numberOfItems;

  const handleBlockTypeChange = async (newBlockType: string) => {
    const plugin = newBlockType ? getPlugin(newBlockType) : undefined;
    const defaultShowBlockTitle = plugin?.defaultShowBlockTitle ?? true;
    const nextData = {
      ...safeData,
      props: {
        ...safeData.props,
        blockType: newBlockType || undefined,
        title: newBlockType ? getBlockTitleByType(newBlockType) || undefined : undefined,
        displayBlockTitle: defaultShowBlockTitle,
      },
    };
    updateData(nextData);

    if (!newBlockType) return;

    const endpoint = getEndpointByType(newBlockType);
    if (!endpoint.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const text = await response.text();
      const names = parseXmlToFieldNames(text);
      const allItems = parseXmlToItems(text);
      const plugin = getPlugin(newBlockType);
      const nextMapping: Record<string, string> = {};
      const nextWeights: Record<string, number> = {};
      names.forEach((name) => {
        const entry = plugin?.defaultFieldMapping[name];
        nextMapping[name] = entry?.type ?? getDefaultFieldTypeForName(name);
        nextWeights[name] = entry?.weight ?? 999;
      });
      updateData({
        ...nextData,
        props: {
          ...nextData.props,
          url: endpoint,
          previewItems: allItems,
          fieldOrder: names,
          fieldMapping: nextMapping,
          fieldWeights: nextWeights,
          feedSlices: null,
          activeSliceIndex: 0,
        },
      });
    } catch {
      // keep blockType/title, no preview
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async () => {
    if (!blockType) return;
    const endpoint = getEndpointByType(blockType);
    if (!endpoint.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const text = await response.text();
      const allItems = parseXmlToItems(text);
      updateData({
        ...safeData,
        props: {
          ...safeData.props,
          url: endpoint,
          previewItems: allItems,
        },
      });
    } catch {
      // keep current data
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Configure XML Feed
      </Typography>
      <Stack spacing={2}>
        <TextField
          select
          fullWidth
          variant="standard"
          label="Block type"
          value={blockType ?? ''}
          disabled={loading}
          onChange={(ev) => handleBlockTypeChange(ev.target.value)}
          SelectProps={{
            displayEmpty: true,
            renderValue: (v) => (v === '' ? 'Select the feed type' : (getPluginsList().find((p) => p.machineName === v)?.name ?? v)),
          }}
        >
          <MenuItem value="">Select the feed type</MenuItem>
          {getPluginsList().map((plugin) => (
            <MenuItem key={plugin.machineName} value={plugin.machineName}>
              {plugin.name}
            </MenuItem>
          ))}
        </TextField>
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
            updateData({
              ...safeData,
              props: { ...safeData.props, numberOfItems: v },
            });
          }}
        />
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={handleRenew}
          disabled={!blockType || loading}
        >
          Renew
        </Button>
        {loading && (
          <Typography variant="body2" color="text.secondary">
            Loading feed…
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
