import React, { createContext, useContext } from 'react';
import { z } from 'zod';
import { XmlDataProvider } from './XmlDataContext';
import { Advertisement300250Xml, Advertisement300250XmlPropsSchema } from '@usewaypoint/block-advertisement-300-250-xml';
import { ConferenceAdvertisement300250Xml, ConferenceAdvertisement300250XmlPropsSchema } from '@usewaypoint/block-conference-advertisement-300-250-xml';
import { Advertisement72890Xml, Advertisement72890XmlPropsSchema } from '@usewaypoint/block-advertisement-728-90-xml';
import { Avatar, AvatarPropsSchema } from '@usewaypoint/block-avatar';
import { BlogXml, BlogXmlPropsSchema } from '@usewaypoint/block-blog-xml';
import { Button, ButtonPropsSchema } from '@usewaypoint/block-button';
import { DailyDownloadXml, DailyDownloadXmlPropsSchema } from '@usewaypoint/block-daily-download-xml';
import { PromotedSurveyXml, PromotedSurveyXmlPropsSchema } from '@nattusia/block-email-survey-xml';
import { UniversalXmlFeed, UniversalXmlFeedPropsSchema } from '@nattusia/block-xml-feed';
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
import { buildBlockComponent, buildBlockConfigurationDictionary, buildBlockConfigurationSchema, } from '@usewaypoint/document-core';
import ColumnsContainerPropsSchema from '../blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import ColumnsContainerReader from '../blocks/ColumnsContainer/ColumnsContainerReader';
import { ContainerPropsSchema } from '../blocks/Container/ContainerPropsSchema';
import ContainerReader from '../blocks/Container/ContainerReader';
import { EmailLayoutPropsSchema } from '../blocks/EmailLayout/EmailLayoutPropsSchema';
import EmailLayoutReader from '../blocks/EmailLayout/EmailLayoutReader';
const ReaderContext = createContext({});
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
    ConferenceAdvertisement300250Xml: {
        schema: ConferenceAdvertisement300250XmlPropsSchema,
        Component: ConferenceAdvertisement300250Xml,
    },
    DailyDownloadXml: {
        schema: DailyDownloadXmlPropsSchema,
        Component: DailyDownloadXml,
    },
    PromotedSurveyXml: {
        schema: PromotedSurveyXmlPropsSchema,
        Component: PromotedSurveyXml,
    },
    UniversalXmlFeed: {
        schema: UniversalXmlFeedPropsSchema,
        Component: UniversalXmlFeed,
    },
});
export const ReaderBlockSchema = buildBlockConfigurationSchema(READER_DICTIONARY);
export const ReaderDocumentSchema = z.record(z.string(), ReaderBlockSchema);
const BaseReaderBlock = buildBlockComponent(READER_DICTIONARY);
export function ReaderBlock({ id }) {
    const document = useReaderDocument();
    return React.createElement(BaseReaderBlock, Object.assign({}, document[id]));
}
export default function Reader({ document, rootBlockId, xmlData = {} }) {
    return (React.createElement(ReaderContext.Provider, { value: document },
        React.createElement(XmlDataProvider, { data: xmlData },
            React.createElement(ReaderBlock, { id: rootBlockId }))));
}
//# sourceMappingURL=core.js.map