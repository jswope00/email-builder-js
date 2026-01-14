import React, { useState } from 'react';

import { TherapeuticUpdateXmlProps, TherapeuticUpdateXmlPropsDefaults, TherapeuticUpdateXmlPropsSchema } from '@usewaypoint/block-therapeutic-update-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type TherapeuticUpdateXmlSidebarPanelProps = {
  data: TherapeuticUpdateXmlProps;
  setData: (v: TherapeuticUpdateXmlProps) => void;
};

export default function TherapeuticUpdateXmlSidebarPanel({ data, setData }: TherapeuticUpdateXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = TherapeuticUpdateXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const url = data.props?.url ?? TherapeuticUpdateXmlPropsDefaults.url;
  const title = data.props?.title ?? TherapeuticUpdateXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? TherapeuticUpdateXmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Therapeutic Update XML Block">
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

