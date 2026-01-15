import React, { useState } from 'react';

import { NewsPanelXmlProps, NewsPanelXmlPropsDefaults, NewsPanelXmlPropsSchema } from '@usewaypoint/block-news-panel-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
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

  const url = data.props?.url ?? NewsPanelXmlPropsDefaults.url;
  const title = data.props?.title ?? NewsPanelXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? NewsPanelXmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="News Panel XML Block">
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

