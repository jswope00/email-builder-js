import React, { useState } from 'react';

import { Advertisement72890XmlProps, Advertisement72890XmlPropsDefaults, Advertisement72890XmlPropsSchema } from '@usewaypoint/block-advertisement-728-90-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
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

  const url = data.props?.url ?? Advertisement72890XmlPropsDefaults.url;
  const title = data.props?.title ?? Advertisement72890XmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? Advertisement72890XmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Advertisement 728x90 XML Block">
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

