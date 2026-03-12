import React, { useState } from 'react';
import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material';
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

  const handleBlockTypeChange = async (newBlockType: string) => {
    const nextData = {
      ...safeData,
      props: {
        ...safeData.props,
        blockType: newBlockType || undefined,
        title: newBlockType ? getBlockTitleByType(newBlockType) || undefined : undefined,
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
      const items = parseXmlToItems(text);
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
          previewItems: items,
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
        {loading && (
          <Typography variant="body2" color="text.secondary">
            Loading feed…
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
