import React, { useState } from 'react';

import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';

import {
  NewsPanelItemTypeFilter,
  NewsPanelXmlProps,
  NewsPanelXmlPropsDefaults,
  NewsPanelXmlPropsSchema,
} from '@usewaypoint/block-news-panel-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type NewsPanelXmlSidebarPanelProps = {
  data: NewsPanelXmlProps;
  setData: (v: NewsPanelXmlProps) => void;
};

export default function NewsPanelXmlSidebarPanel({ data, setData }: NewsPanelXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = NewsPanelXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? NewsPanelXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? NewsPanelXmlPropsDefaults.numberOfItems;
  const itemTypeFilter: NewsPanelItemTypeFilter =
    data.props?.itemTypeFilter ?? NewsPanelXmlPropsDefaults.itemTypeFilter;
  const hideImages = data.props?.hideImages ?? NewsPanelXmlPropsDefaults.hideImages;

  return (
    <BaseSidebarPanel title="News Panel XML Block">
      <TextInput
        label="Title (optional)"
        defaultValue={title}
        onChange={(v) => updateData({ ...data, props: { ...data.props, title: v } })}
      />
      <RheumnowTopicSelect
        value={data.props?.topicTid ?? null}
        onChange={(topicTid) =>
          updateData({ ...data, props: { ...data.props, topicTid: topicTid ?? null } })
        }
      />
      <RheumnowDashboardTagSelect
        value={data.props?.dashboardTagTid ?? null}
        onChange={(dashboardTagTid) =>
          updateData({ ...data, props: { ...data.props, dashboardTagTid: dashboardTagTid ?? null } })
        }
      />
      <FormControl fullWidth size="small">
        <InputLabel id="news-panel-xml-item-type-filter-label">Item types</InputLabel>
        <Select
          labelId="news-panel-xml-item-type-filter-label"
          label="Item types"
          value={itemTypeFilter}
          onChange={(e) => {
            const v = e.target.value as NewsPanelItemTypeFilter;
            updateData({ ...data, props: { ...data.props, itemTypeFilter: v } });
          }}
        >
          <MenuItem value="all">Articles and tweets</MenuItem>
          <MenuItem value="Article">Articles only</MenuItem>
          <MenuItem value="Tweet">Tweets only</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={hideImages}
            onChange={(e) =>
              updateData({ ...data, props: { ...data.props, hideImages: e.target.checked } })
            }
          />
        }
        label="Hide images (save vertical space)"
      />
      <TextInput
        label="Number of items"
        defaultValue={numberOfItems.toString()}
        onChange={(v) => {
            const num = parseInt(v, 10);
            if (!isNaN(num)) {
                updateData({ ...data, props: { ...data.props, numberOfItems: num } });
            }
        }}
      />
      <MultiStylePropertyPanel
        names={['padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}

