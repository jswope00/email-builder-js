import React, { useEffect, useState } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
import { ExpandMore } from '@mui/icons-material';

import {
  BLOCK_TYPE_OPTIONS,
  FIELD_TYPE_OPTIONS,
  getBlockTitleByType,
  getEndpointByType,
  parseXmlToFieldNames,
  parseXmlToItems,
  UniversalXmlFeedProps,
  UniversalXmlFeedPropsDefaults,
  UniversalXmlFeedPropsSchema,
} from '@nattusia/block-xml-feed';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

/** Default field type when loading fields from XML. All other fields default to 'html'. */
const DEFAULT_FIELD_TYPE_BY_NAME: Record<string, string> = {
  view_node: 'contentLink',
  title: 'title',
  field_media_image: 'imageWithContentLink',
  created: 'date',
  field_author_attribution: 'author',
  field_addtional_authors: 'author',
  type: 'doNotShow',
  field_article_type: 'doNotShow',
};

function getDefaultFieldTypeForName(fieldName: string): string {
  return DEFAULT_FIELD_TYPE_BY_NAME[fieldName] ?? 'html';
}

/** Endpoints for Campaign (conference) and Topic term lists. */
const CAMPAIGN_TERMS_URL = 'https://rheumnow.com/admin/terms/dashboard_tags';
const TOPIC_TERMS_URL = 'https://rheumnow.com/admin/terms/topic';

type TermOption = { tid: string; name: string };

/** Parse XML response with <item><tid>...</tid><name>...</name></item> into term options. */
function parseTermsFromXml(xmlText: string): TermOption[] {
  const options: TermOption[] = [];
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const items = doc.querySelectorAll('item');
    items.forEach((item) => {
      const tid = item.querySelector('tid')?.textContent?.trim() ?? '';
      const name = item.querySelector('name')?.textContent?.trim() ?? '';
      if (tid) options.push({ tid, name: name || tid });
    });
  } catch {
    // ignore
  }
  return options;
}

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
  const [campaignOptions, setCampaignOptions] = useState<TermOption[]>([]);
  const [topicOptions, setTopicOptions] = useState<TermOption[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [campRes, topicRes] = await Promise.all([
          fetch(CAMPAIGN_TERMS_URL),
          fetch(TOPIC_TERMS_URL),
        ]);
        if (cancelled) return;
        const campaignText = campRes.ok ? await campRes.text() : '';
        const topicText = topicRes.ok ? await topicRes.text() : '';
        if (cancelled) return;
        setCampaignOptions(parseTermsFromXml(campaignText));
        setTopicOptions(parseTermsFromXml(topicText));
      } catch {
        if (!cancelled) {
          setCampaignOptions([]);
          setTopicOptions([]);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
      feedSlices: UniversalXmlFeedPropsDefaults.feedSlices,
      activeSliceIndex: UniversalXmlFeedPropsDefaults.activeSliceIndex,
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
  const displayBlockTitle = safeData.props?.displayBlockTitle ?? UniversalXmlFeedPropsDefaults.displayBlockTitle;
  const campaignTermIds = safeData.props?.campaignTermIds ?? UniversalXmlFeedPropsDefaults.campaignTermIds ?? [];
  const topicTermIds = safeData.props?.topicTermIds ?? UniversalXmlFeedPropsDefaults.topicTermIds ?? [];
  const numberOfItems = safeData.props?.numberOfItems ?? UniversalXmlFeedPropsDefaults.numberOfItems;
  const fieldMapping = safeData.props?.fieldMapping ?? UniversalXmlFeedPropsDefaults.fieldMapping;
  const endpoint = getEndpointByType(blockType);

  /** Build one fetch URL with optional dashboard_tag and topic params. */
  const buildFetchUrlForParams = (campaignTid: string | null, topicTid: string | null): string => {
    const base = endpoint.trim();
    if (!base) return '';
    const params: string[] = [];
    if (campaignTid) params.push(`dashboard_tag=${encodeURIComponent(campaignTid)}`);
    if (topicTid) params.push(`topic=${encodeURIComponent(topicTid)}`);
    return params.length > 0 ? `${base}?${params.join('&')}` : base;
  };

  /** Slice specs for multi-fetch: only when we have more than one slice (2+ terms or 2+ pairs). */
  const getSliceSpecs = (): { label: string; url: string }[] => {
    const base = endpoint.trim();
    if (!base) return [];
    const hasCampaign = campaignTermIds.length > 0;
    const hasTopic = topicTermIds.length > 0;
    if (hasCampaign && hasTopic) {
      const pairs: { label: string; url: string }[] = [];
      campaignTermIds.forEach((cid) => {
        topicTermIds.forEach((tid) => {
          const cName = campaignOptions.find((o) => o.tid === cid)?.name ?? cid;
          const tName = topicOptions.find((o) => o.tid === tid)?.name ?? tid;
          pairs.push({
            label: `${cName} / ${tName}`,
            url: buildFetchUrlForParams(cid, tid),
          });
        });
      });
      return pairs;
    }
    if (hasCampaign) {
      return campaignTermIds.map((cid) => ({
        label: campaignOptions.find((o) => o.tid === cid)?.name ?? cid,
        url: buildFetchUrlForParams(cid, null),
      }));
    }
    if (hasTopic) {
      return topicTermIds.map((tid) => ({
        label: topicOptions.find((o) => o.tid === tid)?.name ?? tid,
        url: buildFetchUrlForParams(null, tid),
      }));
    }
    return [{ label: '', url: base }];
  };

  /** Single URL for Load / single-slice Parse & show (first slice only). */
  const buildFetchUrl = (): string => buildFetchUrlForParams(
    campaignTermIds.length > 0 ? campaignTermIds[0] : null,
    topicTermIds.length > 0 ? topicTermIds[0] : null,
  );

  const handleLoad = async () => {
    const urlToFetch = buildFetchUrl();
    if (!urlToFetch) {
      setLoadError('No endpoint for this block type.');
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
      // Build mapping in XML order (names order), use default types when loading
      const nextMapping = {} as Record<string, string>;
      names.forEach((name) => {
        nextMapping[name] = fieldMapping[name] ?? getDefaultFieldTypeForName(name);
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
    const sliceSpecs = getSliceSpecs();
    if (sliceSpecs.length === 0 || !sliceSpecs[0].url) {
      setParseError('No endpoint for this block type.');
      return;
    }
    setParseError(null);
    setParseLoading(true);
    try {
      const num = numberOfItems ?? 0;
      if (sliceSpecs.length <= 1) {
        const urlToFetch = sliceSpecs[0].url;
        const response = await fetch(urlToFetch);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        const allItems = parseXmlToItems(text);
        const itemsToStore = num > 0 ? allItems.slice(0, num) : allItems;
        updateData({
          ...safeData,
          props: {
            ...safeData.props,
            url: urlToFetch,
            previewItems: itemsToStore,
            feedSlices: null,
            activeSliceIndex: 0,
          },
        });
      } else {
        const responses = await Promise.all(sliceSpecs.map((s) => fetch(s.url)));
        const texts = await Promise.all(responses.map((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`)))));
        const allParsed = texts.map((text) => parseXmlToItems(text));
        const feedSlices = sliceSpecs.map((spec, i) => {
          const items = num > 0 ? allParsed[i].slice(0, num) : allParsed[i];
          return { label: spec.label || `Section ${i + 1}`, items };
        });
        const currentIndex = safeData.props?.activeSliceIndex ?? 0;
        const validIndex = currentIndex >= 0 && currentIndex < feedSlices.length ? currentIndex : 0;
        updateData({
          ...safeData,
          props: {
            ...safeData.props,
            url: sliceSpecs[0].url,
            previewItems: feedSlices[validIndex].items,
            feedSlices,
            activeSliceIndex: validIndex,
          },
        });
      }
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to parse XML.');
    } finally {
      setParseLoading(false);
    }
  };

  const tableRows = loadedFieldNames.length > 0 ? loadedFieldNames : Object.keys(fieldMapping ?? {});
  const canParseAndShow = endpoint.trim().length > 0;

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
              blockType: newBlockType || undefined,
              title: newBlockType ? getBlockTitleByType(newBlockType) || undefined : undefined,
            },
          });
        }}
      >
        <MenuItem value="">
          Select the feed type
        </MenuItem>
        {BLOCK_TYPE_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>

      {blockType && endpoint && (
        <Box sx={{ mb: 1 }}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary', wordBreak: 'break-all' }}>
            Endpoint: {endpoint}
          </Box>
          <Button
            variant="contained"
            size="medium"
            fullWidth
            onClick={handleLoad}
            disabled={loading || !endpoint.trim()}
            sx={{ mt: 1 }}
          >
            {loading ? 'Loading…' : 'Load'}
          </Button>
          {loadError && (
            <Box sx={{ color: 'error.main', fontSize: '0.875rem', mt: 0.5 }}>{loadError}</Box>
          )}
        </Box>
      )}

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

      <Accordion disableGutters sx={{ boxShadow: 'none', '&::before': { display: 'none' }, mb: 0.5 }}>
        <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
          <Box component="span" sx={{ fontSize: '0.875rem' }}>
            Campaign (conference){campaignTermIds.length > 0 ? ` (${campaignTermIds.length})` : ''}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={campaignOptions.length > 0 && campaignTermIds.length === campaignOptions.length}
                indeterminate={campaignTermIds.length > 0 && campaignTermIds.length < campaignOptions.length}
                onChange={(e) => {
                  const next = e.target.checked ? campaignOptions.map((o) => o.tid) : [];
                  updateData({ ...safeData, props: { ...safeData.props, campaignTermIds: next } });
                }}
              />
            }
            label="Select all"
            sx={{ display: 'block', mb: 0.5 }}
          />
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {campaignOptions.map((opt) => (
              <FormControlLabel
                key={opt.tid}
                control={
                  <Checkbox
                    checked={campaignTermIds.includes(opt.tid)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...campaignTermIds, opt.tid]
                        : campaignTermIds.filter((id) => id !== opt.tid);
                      updateData({ ...safeData, props: { ...safeData.props, campaignTermIds: next } });
                    }}
                  />
                }
                label={opt.name}
                sx={{ display: 'block', ml: 0.5 }}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion disableGutters sx={{ boxShadow: 'none', '&::before': { display: 'none' }, mb: 1 }}>
        <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
          <Box component="span" sx={{ fontSize: '0.875rem' }}>
            Topic{topicTermIds.length > 0 ? ` (${topicTermIds.length})` : ''}
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0, pb: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={topicOptions.length > 0 && topicTermIds.length === topicOptions.length}
                indeterminate={topicTermIds.length > 0 && topicTermIds.length < topicOptions.length}
                onChange={(e) => {
                  const next = e.target.checked ? topicOptions.map((o) => o.tid) : [];
                  updateData({ ...safeData, props: { ...safeData.props, topicTermIds: next } });
                }}
              />
            }
            label="Select all"
            sx={{ display: 'block', mb: 0.5 }}
          />
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {topicOptions.map((opt) => (
              <FormControlLabel
                key={opt.tid}
                control={
                  <Checkbox
                    checked={topicTermIds.includes(opt.tid)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...topicTermIds, opt.tid]
                        : topicTermIds.filter((id) => id !== opt.tid);
                      updateData({ ...safeData, props: { ...safeData.props, topicTermIds: next } });
                    }}
                  />
                }
                label={opt.name}
                sx={{ display: 'block', ml: 0.5 }}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

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
