import React, { useState } from 'react';

import { TextField } from '@mui/material';
import { ConferenceAdvertisement300250XmlProps, ConferenceAdvertisement300250XmlPropsDefaults, ConferenceAdvertisement300250XmlPropsSchema } from '@usewaypoint/block-conference-advertisement-300-250-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type ConferenceAdvertisement300250XmlSidebarPanelProps = {
  data: ConferenceAdvertisement300250XmlProps;
  setData: (v: ConferenceAdvertisement300250XmlProps) => void;
};

export default function ConferenceAdvertisement300250XmlSidebarPanel({ data, setData }: ConferenceAdvertisement300250XmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ConferenceAdvertisement300250XmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? ConferenceAdvertisement300250XmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? ConferenceAdvertisement300250XmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Conference Advertisement 300x250 XML Block">
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
