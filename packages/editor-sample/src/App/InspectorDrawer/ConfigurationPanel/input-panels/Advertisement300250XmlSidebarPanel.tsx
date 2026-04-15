import React, { useState } from 'react';

import { TextField } from '@mui/material';
import { Advertisement300250XmlProps, Advertisement300250XmlPropsDefaults, Advertisement300250XmlPropsSchema } from '@usewaypoint/block-advertisement-300-250-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type Advertisement300250XmlSidebarPanelProps = {
  data: Advertisement300250XmlProps;
  setData: (v: Advertisement300250XmlProps) => void;
};

export default function Advertisement300250XmlSidebarPanel({ data, setData }: Advertisement300250XmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = Advertisement300250XmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? Advertisement300250XmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? Advertisement300250XmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Advertisement 300x250 XML Block">
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
      <MultiStylePropertyPanel
        names={['padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}

