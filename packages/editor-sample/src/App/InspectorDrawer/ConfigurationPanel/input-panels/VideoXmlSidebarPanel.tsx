import React, { useState } from 'react';

import { TextField } from '@mui/material';
import { VideoXmlProps, VideoXmlPropsDefaults, VideoXmlPropsSchema } from '@usewaypoint/block-video-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type VideoXmlSidebarPanelProps = {
  data: VideoXmlProps;
  setData: (v: VideoXmlProps) => void;
};

type DateFilterFields = {
  createdStartDate?: string | null;
  createdEndDate?: string | null;
  createdRelativeDays?: number | null;
};

export default function VideoXmlSidebarPanel({ data, setData }: VideoXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = VideoXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? VideoXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? VideoXmlPropsDefaults.numberOfItems;
  const dateFilterProps = (data.props ?? {}) as DateFilterFields;
  const createdStartDate = dateFilterProps.createdStartDate ?? '';
  const createdEndDate = dateFilterProps.createdEndDate ?? '';
  const createdRelativeDays = dateFilterProps.createdRelativeDays;

  return (
    <BaseSidebarPanel title="Video XML Block">
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
      <TextField
        fullWidth
        size="small"
        type="number"
        label="Number of items"
        value={numberOfItems}
        InputProps={{ inputProps: { min: 1, step: 1 } }}
        onChange={(ev) => {
          const raw = ev.target.value.trim();
          if (/^\d+$/.test(raw)) {
            const num = parseInt(raw, 10);
            if (num >= 1) {
              updateData({ ...data, props: { ...data.props, numberOfItems: num } });
            }
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

