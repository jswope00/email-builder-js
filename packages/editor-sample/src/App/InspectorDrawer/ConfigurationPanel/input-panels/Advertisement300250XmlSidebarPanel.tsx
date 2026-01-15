import React, { useState } from 'react';

import { Advertisement300250XmlProps, Advertisement300250XmlPropsDefaults, Advertisement300250XmlPropsSchema } from '@usewaypoint/block-advertisement-300-250-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
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

  const url = data.props?.url ?? Advertisement300250XmlPropsDefaults.url;
  const title = data.props?.title ?? Advertisement300250XmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? Advertisement300250XmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Advertisement 300x250 XML Block">
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

