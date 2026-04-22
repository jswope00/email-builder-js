import React, { useState } from 'react';

import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Advertisement72890XmlProps, Advertisement72890XmlPropsDefaults, Advertisement72890XmlPropsSchema } from '@usewaypoint/block-advertisement-728-90-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type Advertisement72890XmlSidebarPanelProps = {
  data: Advertisement72890XmlProps;
  setData: (v: Advertisement72890XmlProps) => void;
};

export default function Advertisement72890XmlSidebarPanel({ data, setData }: Advertisement72890XmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = Advertisement72890XmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? Advertisement72890XmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? Advertisement72890XmlPropsDefaults.numberOfItems;
  const restrictToNoTopicAdvertisements =
    (data.props as { restrictToNoTopicAdvertisements?: boolean | null } | undefined)
      ?.restrictToNoTopicAdvertisements === true;

  return (
    <BaseSidebarPanel title="Advertisement 728x90 XML Block">
      <TextInput
        label="Title (optional)"
        defaultValue={title}
        onChange={(v) => updateData({ ...data, props: { ...data.props, title: v } })}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={restrictToNoTopicAdvertisements}
            onChange={(e) =>
              updateData({
                ...data,
                props: { ...data.props, restrictToNoTopicAdvertisements: e.target.checked } as Advertisement72890XmlProps['props'],
              })
            }
          />
        }
        label="Restrict to Advertisements with no Topic Specified"
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

