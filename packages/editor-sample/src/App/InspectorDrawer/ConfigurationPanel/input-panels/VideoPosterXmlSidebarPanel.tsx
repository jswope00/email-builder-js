import React, { useState } from 'react';

import {
  VideoPosterXmlProps,
  VideoPosterXmlPropsDefaults,
  VideoPosterXmlPropsSchema,
} from '@usewaypoint/block-video-poster-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type VideoPosterXmlSidebarPanelProps = {
  data: VideoPosterXmlProps;
  setData: (v: VideoPosterXmlProps) => void;
};

export default function VideoPosterXmlSidebarPanel({ data, setData }: VideoPosterXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = VideoPosterXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? VideoPosterXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? VideoPosterXmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Video Poster XML Block">
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
