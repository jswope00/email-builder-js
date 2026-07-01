import React, { useState } from 'react';
import { z } from 'zod';

import { TextField } from '@mui/material';
import {
  GEMS_XML_FEED_URL,
  GemsXmlProps,
  GemsXmlPropsDefaults,
  GemsXmlPropsSchema,
} from '@usewaypoint/block-gems-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type GemsXmlSidebarPanelProps = {
  data: GemsXmlProps;
  setData: (v: GemsXmlProps) => void;
};

export default function GemsXmlSidebarPanel({ data, setData }: GemsXmlSidebarPanelProps) {
  const [, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = GemsXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? GemsXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? GemsXmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Gems XML Block" subtitle={GEMS_XML_FEED_URL}>
      <TextInput
        label="Section title (optional)"
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
