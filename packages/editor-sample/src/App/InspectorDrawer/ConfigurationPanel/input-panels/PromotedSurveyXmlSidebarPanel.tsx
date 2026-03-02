import React, { useState } from 'react';

import {
  PromotedSurveyXmlProps,
  PromotedSurveyXmlPropsDefaults,
  PromotedSurveyXmlPropsSchema,
} from '@nattusia/block-email-survey-xml';

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
  // Normalize so we always have props (like VideoXmlSidebarPanel / DailyDownloadXmlSidebarPanel)
  const safeData: PromotedSurveyXmlProps = {
    style: data?.style ?? null,
    props: data?.props ?? { url: PromotedSurveyXmlPropsDefaults.url, numberOfItems: PromotedSurveyXmlPropsDefaults.numberOfItems },
  };

  const updateData = (d: unknown) => {
    const res = PromotedSurveyXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const url = safeData.props?.url ?? PromotedSurveyXmlPropsDefaults.url;
  const numberOfItems = safeData.props?.numberOfItems ?? PromotedSurveyXmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Promoted Survey XML Block">
      <TextInput
        label="XML URL"
        placeholder="https://example.com/survey.xml"
        defaultValue={url ?? ''}
        onChange={(v) => updateData({ ...safeData, props: { ...safeData.props, url: v } })}
      />
      <TextInput
        label="Number of items"
        defaultValue={String(numberOfItems ?? PromotedSurveyXmlPropsDefaults.numberOfItems)}
        onChange={(v) => {
          const num = parseInt(v, 10);
          if (!isNaN(num)) {
            updateData({ ...safeData, props: { ...safeData.props, numberOfItems: num } });
          }
        }}
      />
      <MultiStylePropertyPanel
        names={['padding']}
        value={safeData.style}
        onChange={(style) => updateData({ ...safeData, style })}
      />
    </BaseSidebarPanel>
  );
}
