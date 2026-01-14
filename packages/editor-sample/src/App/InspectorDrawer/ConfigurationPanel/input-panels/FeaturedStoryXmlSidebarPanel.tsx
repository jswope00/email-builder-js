import React, { useState } from 'react';

import { FeaturedStoryXmlProps, FeaturedStoryXmlPropsDefaults, FeaturedStoryXmlPropsSchema } from '@usewaypoint/block-featured-story-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type FeaturedStoryXmlSidebarPanelProps = {
  data: FeaturedStoryXmlProps;
  setData: (v: FeaturedStoryXmlProps) => void;
};

export default function FeaturedStoryXmlSidebarPanel({ data, setData }: FeaturedStoryXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = FeaturedStoryXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const url = data.props?.url ?? FeaturedStoryXmlPropsDefaults.url;
  const title = data.props?.title ?? FeaturedStoryXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? FeaturedStoryXmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Featured Story XML Block">
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

