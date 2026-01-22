import React, { useState } from 'react';

import { DailyDownloadXmlProps, DailyDownloadXmlPropsDefaults, DailyDownloadXmlPropsSchema } from '@usewaypoint/block-daily-download-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type DailyDownloadXmlSidebarPanelProps = {
  data: DailyDownloadXmlProps;
  setData: (v: DailyDownloadXmlProps) => void;
};

export default function DailyDownloadXmlSidebarPanel({ data, setData }: DailyDownloadXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = DailyDownloadXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const url = data.props?.url ?? DailyDownloadXmlPropsDefaults.url;
  const title = data.props?.title ?? DailyDownloadXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? DailyDownloadXmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Daily Download XML Block">
      <TextInput
        label="Title (optional)"
        defaultValue={title}
        onChange={(v) => updateData({ ...data, props: { ...data.props, title: v } })}
      />
      <TextInput
        label="XML URL"
        defaultValue={url}
        onChange={(v) => updateData({ ...data, props: { ...data.props, url: v } })}
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
