import React, { useState } from 'react';

import { ConferenceAdvertisement300250XmlProps, ConferenceAdvertisement300250XmlPropsDefaults, ConferenceAdvertisement300250XmlPropsSchema } from '@usewaypoint/block-conference-advertisement-300-250-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
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

  const url = data.props?.url ?? ConferenceAdvertisement300250XmlPropsDefaults.url;
  const title = data.props?.title ?? ConferenceAdvertisement300250XmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? ConferenceAdvertisement300250XmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Conference Advertisement 300x250 XML Block">
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
