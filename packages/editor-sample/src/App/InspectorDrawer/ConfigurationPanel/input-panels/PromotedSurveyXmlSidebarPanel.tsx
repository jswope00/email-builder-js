import React, { useState } from 'react';

import {
  PromotedSurveyXmlProps,
  PromotedSurveyXmlPropsDefaults,
  PromotedSurveyXmlPropsSchema,
} from '@usewaypoint/block-email-survey-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type PromotedSurveyXmlSidebarPanelProps = {
  data: PromotedSurveyXmlProps;
  setData: (v: PromotedSurveyXmlProps) => void;
};

export default function PromotedSurveyXmlSidebarPanel({
  data,
  setData,
}: PromotedSurveyXmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = PromotedSurveyXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const url = data.props?.url ?? PromotedSurveyXmlPropsDefaults.url;
  const numberOfItems = data.props?.numberOfItems ?? PromotedSurveyXmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Promoted Survey XML Block">
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
