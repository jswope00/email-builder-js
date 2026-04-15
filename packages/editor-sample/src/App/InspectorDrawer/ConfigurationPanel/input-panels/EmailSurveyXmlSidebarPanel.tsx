import React, { useState } from 'react';
import { z } from 'zod';

import {
  EmailSurveyXmlProps,
  EmailSurveyXmlPropsDefaults,
  EmailSurveyXmlPropsSchema,
} from '@usewaypoint/block-email-survey-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type EmailSurveyXmlSidebarPanelProps = {
  data: EmailSurveyXmlProps;
  setData: (v: EmailSurveyXmlProps) => void;
};

export default function EmailSurveyXmlSidebarPanel({ data, setData }: EmailSurveyXmlSidebarPanelProps) {
  const [, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = EmailSurveyXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? EmailSurveyXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? EmailSurveyXmlPropsDefaults.numberOfItems;

  return (
    <BaseSidebarPanel title="Email Survey XML Block">
      <TextInput
        label="Section title (optional)"
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
