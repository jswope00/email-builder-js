import React, { createContext, useContext } from 'react';
import { z } from 'zod';

import { XmlDataProvider } from './XmlDataContext';

import { Advertisement300250Xml, Advertisement300250XmlPropsSchema } from '@usewaypoint/block-advertisement-300-250-xml';
import { Advertisement72890Xml, Advertisement72890XmlPropsSchema } from '@usewaypoint/block-advertisement-728-90-xml';
import { Avatar, AvatarPropsSchema } from '@usewaypoint/block-avatar';
import { BlogXml, BlogXmlPropsSchema } from '@usewaypoint/block-blog-xml';
import { Button, ButtonPropsSchema } from '@usewaypoint/block-button';
import { DailyDownloadXml, DailyDownloadXmlPropsSchema } from '@usewaypoint/block-daily-download-xml';
import { Divider, DividerPropsSchema } from '@usewaypoint/block-divider';
import { FeaturedStoryXml, FeaturedStoryXmlPropsSchema } from '@usewaypoint/block-featured-story-xml';
import { Heading, HeadingPropsSchema } from '@usewaypoint/block-heading';
import { Html, HtmlPropsSchema } from '@usewaypoint/block-html';
import { Image, ImagePropsSchema } from '@usewaypoint/block-image';
import { NewsPanelXml, NewsPanelXmlPropsSchema } from '@usewaypoint/block-news-panel-xml';
import { Spacer, SpacerPropsSchema } from '@usewaypoint/block-spacer';
import { Text, TextPropsSchema } from '@usewaypoint/block-text';
import { TherapeuticUpdateXml, TherapeuticUpdateXmlPropsSchema } from '@usewaypoint/block-therapeutic-update-xml';
import { VideoXml, VideoXmlPropsSchema } from '@usewaypoint/block-video-xml';
import {
  buildBlockComponent,
  buildBlockConfigurationDictionary,
  buildBlockConfigurationSchema,
} from '@usewaypoint/document-core';

import ColumnsContainerPropsSchema from '../blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import ColumnsContainerReader from '../blocks/ColumnsContainer/ColumnsContainerReader';
import { ContainerPropsSchema } from '../blocks/Container/ContainerPropsSchema';
import ContainerReader from '../blocks/Container/ContainerReader';
import { EmailLayoutPropsSchema } from '../blocks/EmailLayout/EmailLayoutPropsSchema';
import EmailLayoutReader from '../blocks/EmailLayout/EmailLayoutReader';

const ReaderContext = createContext<TReaderDocument>({});

function useReaderDocument() {
  return useContext(ReaderContext);
}

const READER_DICTIONARY = buildBlockConfigurationDictionary({
  ColumnsContainer: {
    schema: ColumnsContainerPropsSchema,
    Component: ColumnsContainerReader,
  },
  Container: {
    schema: ContainerPropsSchema,
    Component: ContainerReader,
  },
  EmailLayout: {
    schema: EmailLayoutPropsSchema,
    Component: EmailLayoutReader,
  },
  //
  Avatar: {
    schema: AvatarPropsSchema,
    Component: Avatar,
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: Button,
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: Divider,
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: Heading,
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: Html,
  },
  Image: {
    schema: ImagePropsSchema,
    Component: Image,
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: Spacer,
  },
  Text: {
    schema: TextPropsSchema,
    Component: Text,
  },
  VideoXml: {
    schema: VideoXmlPropsSchema,
    Component: VideoXml,
  },
  TherapeuticUpdateXml: {
    schema: TherapeuticUpdateXmlPropsSchema,
    Component: TherapeuticUpdateXml,
  },
  FeaturedStoryXml: {
    schema: FeaturedStoryXmlPropsSchema,
    Component: FeaturedStoryXml,
  },
  NewsPanelXml: {
    schema: NewsPanelXmlPropsSchema,
    Component: NewsPanelXml,
  },
  BlogXml: {
    schema: BlogXmlPropsSchema,
    Component: BlogXml,
  },
  Advertisement72890Xml: {
    schema: Advertisement72890XmlPropsSchema,
    Component: Advertisement72890Xml,
  },
  Advertisement300250Xml: {
    schema: Advertisement300250XmlPropsSchema,
    Component: Advertisement300250Xml,
  },
  DailyDownloadXml: {
    schema: DailyDownloadXmlPropsSchema,
    Component: DailyDownloadXml,
  },
});

export const ReaderBlockSchema = buildBlockConfigurationSchema(READER_DICTIONARY);
export type TReaderBlock = z.infer<typeof ReaderBlockSchema>;

export const ReaderDocumentSchema = z.record(z.string(), ReaderBlockSchema);
export type TReaderDocument = Record<string, TReaderBlock>;

const BaseReaderBlock = buildBlockComponent(READER_DICTIONARY);

export type TReaderBlockProps = { id: string };
export function ReaderBlock({ id }: TReaderBlockProps) {
  const document = useReaderDocument();
  return <BaseReaderBlock {...document[id]} />;
}

export type TReaderProps = {
  document: Record<string, z.infer<typeof ReaderBlockSchema>>;
  rootBlockId: string;
  xmlData?: Record<string, string>;
};
export default function Reader({ document, rootBlockId, xmlData = {} }: TReaderProps) {
  return (
    <ReaderContext.Provider value={document}>
      <XmlDataProvider data={xmlData}>
        <ReaderBlock id={rootBlockId} />
      </XmlDataProvider>
    </ReaderContext.Provider>
  );
}
