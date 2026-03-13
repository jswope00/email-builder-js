import React from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { TEditorBlock } from '../../../documents/editor/core';
import { setDocument, useDocument, useSelectedBlockId } from '../../../documents/editor/EditorContext';

import TemplateSlicesSection from './TemplateSlicesSection';
import Advertisement300250XmlSidebarPanel from './input-panels/Advertisement300250XmlSidebarPanel';
import ConferenceAdvertisement300250XmlSidebarPanel from './input-panels/ConferenceAdvertisement300250XmlSidebarPanel';
import Advertisement72890XmlSidebarPanel from './input-panels/Advertisement72890XmlSidebarPanel';
import AvatarSidebarPanel from './input-panels/AvatarSidebarPanel';
import BlogXmlSidebarPanel from './input-panels/BlogXmlSidebarPanel';
import DailyDownloadXmlSidebarPanel from './input-panels/DailyDownloadXmlSidebarPanel';
import ButtonSidebarPanel from './input-panels/ButtonSidebarPanel';
import ColumnsContainerSidebarPanel from './input-panels/ColumnsContainerSidebarPanel';
import ContainerSidebarPanel from './input-panels/ContainerSidebarPanel';
import DividerSidebarPanel from './input-panels/DividerSidebarPanel';
import EmailLayoutSidebarPanel from './input-panels/EmailLayoutSidebarPanel';
import HeadingSidebarPanel from './input-panels/HeadingSidebarPanel';
import HtmlSidebarPanel from './input-panels/HtmlSidebarPanel';
import ImageSidebarPanel from './input-panels/ImageSidebarPanel';
import SpacerSidebarPanel from './input-panels/SpacerSidebarPanel';
import TextSidebarPanel from './input-panels/TextSidebarPanel';
import FeaturedStoryXmlSidebarPanel from './input-panels/FeaturedStoryXmlSidebarPanel';
import NewsPanelXmlSidebarPanel from './input-panels/NewsPanelXmlSidebarPanel';
import PromotedSurveyXmlSidebarPanel from './input-panels/PromotedSurveyXmlSidebarPanel';
import { XmlFeedSidebarPanel } from '@nattusia/block-xml-feed';
import TherapeuticUpdateXmlSidebarPanel from './input-panels/TherapeuticUpdateXmlSidebarPanel';
import VideoXmlSidebarPanel from './input-panels/VideoXmlSidebarPanel';

function renderMessage(val: string) {
  return (
    <Box sx={{ m: 3, p: 1, border: '1px dashed', borderColor: 'divider' }}>
      <Typography color="text.secondary">{val}</Typography>
    </Box>
  );
}

export default function ConfigurationPanel() {
  const document = useDocument();
  const selectedBlockId = useSelectedBlockId();

  let blockContent: React.ReactNode;
  if (!selectedBlockId) {
    blockContent = renderMessage('Click on a block to inspect.');
  } else {
    const block = document[selectedBlockId];
    if (!block) {
      blockContent = renderMessage(`Block with id ${selectedBlockId} was not found. Click on a block to reset.`);
    } else {
      const setBlock = (conf: TEditorBlock) => setDocument({ [selectedBlockId]: conf });
      const { data, type } = block;
      switch (type) {
        case 'Avatar':
          blockContent = <AvatarSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'Button':
          blockContent = <ButtonSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'ColumnsContainer':
          blockContent = (
            <ColumnsContainerSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        case 'Container':
          blockContent = <ContainerSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'Divider':
          blockContent = <DividerSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'Heading':
          blockContent = <HeadingSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'Html':
          blockContent = <HtmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'Image':
          blockContent = <ImageSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'EmailLayout':
          blockContent = <EmailLayoutSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'Spacer':
          blockContent = <SpacerSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'Text':
          blockContent = <TextSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'VideoXml':
          blockContent = <VideoXmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'TherapeuticUpdateXml':
          blockContent = (
            <TherapeuticUpdateXmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        case 'FeaturedStoryXml':
          blockContent = (
            <FeaturedStoryXmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        case 'NewsPanelXml':
          blockContent = (
            <NewsPanelXmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        case 'BlogXml':
          blockContent = <BlogXmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />;
          break;
        case 'Advertisement72890Xml':
          blockContent = (
            <Advertisement72890XmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        case 'Advertisement300250Xml':
          blockContent = (
            <Advertisement300250XmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        case 'ConferenceAdvertisement300250Xml':
          blockContent = (
            <ConferenceAdvertisement300250XmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        case 'DailyDownloadXml':
          blockContent = (
            <DailyDownloadXmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        case 'PromotedSurveyXml':
          blockContent = (
            <PromotedSurveyXmlSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        case 'UniversalXmlFeed':
          blockContent = (
            <XmlFeedSidebarPanel  data={data} setData={(d) => setBlock({ type, data: d })} />
          );
          break;
        default:
          blockContent = <pre>{JSON.stringify(block, null, '  ')}</pre>;
      }
    }
  }

  return (
    <Stack>
      <TemplateSlicesSection />
      <Box key={selectedBlockId ?? 'none'} sx={{ flex: 1 }}>{blockContent}</Box>
    </Stack>
  );
}
