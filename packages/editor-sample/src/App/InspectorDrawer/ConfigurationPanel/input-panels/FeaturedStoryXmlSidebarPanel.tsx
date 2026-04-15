import React, { useState } from 'react';

import { TextField } from '@mui/material';
import { FeaturedStoryXmlProps, FeaturedStoryXmlPropsDefaults, FeaturedStoryXmlPropsSchema } from '@usewaypoint/block-featured-story-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type FeaturedStoryXmlSidebarPanelProps = {
  data: FeaturedStoryXmlProps;
  setData: (v: FeaturedStoryXmlProps) => void;
};

type DateFilterFields = {
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
};

export default function FeaturedStoryXmlSidebarPanel({ data, setData }: FeaturedStoryXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = FeaturedStoryXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? FeaturedStoryXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? FeaturedStoryXmlPropsDefaults.numberOfItems;
  const dateFilterProps = (data.props ?? {}) as DateFilterFields;
  const createdStartDate = dateFilterProps.createdStartDate ?? '';
  const createdEndDate = dateFilterProps.createdEndDate ?? '';
  const createdRelativeDays = dateFilterProps.createdRelativeDays;

  return (
    <BaseSidebarPanel title="Featured Story XML Block">
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
      <TextField
        fullWidth
        size="small"
        type="date"
        label="Created start date"
        value={createdStartDate}
        InputLabelProps={{ shrink: true }}
        onChange={(ev) =>
          updateData({
            ...data,
            props: { ...data.props, createdStartDate: ev.target.value || null },
          })
        }
      />
      <TextField
        fullWidth
        size="small"
        type="date"
        label="Created end date"
        value={createdEndDate}
        InputLabelProps={{ shrink: true }}
        onChange={(ev) =>
          updateData({
            ...data,
            props: { ...data.props, createdEndDate: ev.target.value || null },
          })
        }
      />
      <TextField
        fullWidth
        size="small"
        type="number"
        label="Relative days (Today - N)"
        value={typeof createdRelativeDays === 'number' ? createdRelativeDays : ''}
        InputProps={{ inputProps: { min: 0, step: 1 } }}
        onChange={(ev) => {
          const raw = ev.target.value.trim();
          if (raw === '') {
            updateData({ ...data, props: { ...data.props, createdRelativeDays: null } });
            return;
          }
          if (/^\d+$/.test(raw)) {
            updateData({ ...data, props: { ...data.props, createdRelativeDays: parseInt(raw, 10) } });
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

