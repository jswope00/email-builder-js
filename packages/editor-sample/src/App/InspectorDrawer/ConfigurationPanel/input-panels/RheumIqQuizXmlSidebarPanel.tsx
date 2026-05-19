import React, { useState } from 'react';
import { z } from 'zod';

import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import {
  RHEUMIQ_QUIZ_XML_FEED_URL,
  RheumIqQuizXmlProps,
  RheumIqQuizXmlPropsDefaults,
  RheumIqQuizXmlPropsSchema,
} from '@usewaypoint/block-rheumiq-quiz-xml';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RheumnowDashboardTagSelect from './helpers/RheumnowDashboardTagSelect';
import RheumnowTopicSelect from './helpers/RheumnowTopicSelect';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type RheumIqQuizXmlSidebarPanelProps = {
  data: RheumIqQuizXmlProps;
  setData: (v: RheumIqQuizXmlProps) => void;
};

export default function RheumIqQuizXmlSidebarPanel({ data, setData }: RheumIqQuizXmlSidebarPanelProps) {
  const [, setErrors] = useState<z.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = RheumIqQuizXmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const title = data.props?.title ?? RheumIqQuizXmlPropsDefaults.title;
  const numberOfItems = data.props?.numberOfItems ?? RheumIqQuizXmlPropsDefaults.numberOfItems;
  const showQuizTitle = data.props?.showQuizTitle ?? RheumIqQuizXmlPropsDefaults.showQuizTitle;
  const showQuestions = data.props?.showQuestions ?? RheumIqQuizXmlPropsDefaults.showQuestions;
  const showSponsoredText =
    data.props?.showSponsoredText ?? RheumIqQuizXmlPropsDefaults.showSponsoredText;
  const showQuizLink = data.props?.showQuizLink ?? RheumIqQuizXmlPropsDefaults.showQuizLink;
  const quizLinkText = data.props?.quizLinkText ?? RheumIqQuizXmlPropsDefaults.quizLinkText;

  return (
    <BaseSidebarPanel title="RheumIQ Quiz XML Block" subtitle={RHEUMIQ_QUIZ_XML_FEED_URL}>
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
      <TextField
        fullWidth
        size="small"
        type="number"
        label="Number of items"
        value={numberOfItems}
        InputProps={{ inputProps: { min: 1, step: 1 } }}
        onChange={(ev) => {
          const raw = ev.target.value.trim();
          if (/^\d+$/.test(raw)) {
            const num = parseInt(raw, 10);
            if (num >= 1) {
              updateData({ ...data, props: { ...data.props, numberOfItems: num } });
            }
          }
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showQuizTitle}
            onChange={(e) =>
              updateData({ ...data, props: { ...data.props, showQuizTitle: e.target.checked } })
            }
          />
        }
        label="Show quiz title"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showQuestions}
            onChange={(e) =>
              updateData({ ...data, props: { ...data.props, showQuestions: e.target.checked } })
            }
          />
        }
        label="Show questions"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showSponsoredText}
            onChange={(e) =>
              updateData({ ...data, props: { ...data.props, showSponsoredText: e.target.checked } })
            }
          />
        }
        label="Show sponsored text"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={showQuizLink}
            onChange={(e) =>
              updateData({ ...data, props: { ...data.props, showQuizLink: e.target.checked } })
            }
          />
        }
        label="Show quiz link"
      />
      <TextInput
        label="Quiz link text"
        defaultValue={quizLinkText}
        onChange={(v) => updateData({ ...data, props: { ...data.props, quizLinkText: v } })}
      />
      <MultiStylePropertyPanel
        names={['padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
