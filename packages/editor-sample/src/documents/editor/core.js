import React from 'react';
import { z } from 'zod';
import { Advertisement300250Xml, Advertisement300250XmlPropsSchema } from '@usewaypoint/block-advertisement-300-250-xml';
import { ConferenceAdvertisement300250Xml, ConferenceAdvertisement300250XmlPropsSchema } from '@usewaypoint/block-conference-advertisement-300-250-xml';
import { Advertisement72890Xml, Advertisement72890XmlPropsSchema } from '@usewaypoint/block-advertisement-728-90-xml';
import { Avatar, AvatarPropsSchema } from '@usewaypoint/block-avatar';
import { BlogXml, BlogXmlPropsSchema } from '@usewaypoint/block-blog-xml';
import { DailyDownloadXml, DailyDownloadXmlPropsSchema } from '@usewaypoint/block-daily-download-xml';
import { PromotedSurveyXml, PromotedSurveyXmlPropsSchema } from '@nattusia/block-email-survey-xml';
import { UniversalXmlFeed, UniversalXmlFeedPropsSchema } from '@nattusia/block-xml-feed';
import { Button, ButtonPropsSchema } from '@usewaypoint/block-button';
import { Divider, DividerPropsSchema } from '@usewaypoint/block-divider';
import { Heading, HeadingPropsSchema } from '@usewaypoint/block-heading';
import { Html, HtmlPropsSchema } from '@usewaypoint/block-html';
import { Image, ImagePropsSchema } from '@usewaypoint/block-image';
import { Spacer, SpacerPropsSchema } from '@usewaypoint/block-spacer';
import { Text, TextPropsSchema } from '@usewaypoint/block-text';
import { FeaturedStoryXml, FeaturedStoryXmlPropsSchema } from '@usewaypoint/block-featured-story-xml';
import { NewsPanelXml, NewsPanelXmlPropsSchema } from '@usewaypoint/block-news-panel-xml';
import { TherapeuticUpdateXml, TherapeuticUpdateXmlPropsSchema } from '@usewaypoint/block-therapeutic-update-xml';
import { VideoXml, VideoXmlPropsSchema } from '@usewaypoint/block-video-xml';
import { buildBlockComponent, buildBlockConfigurationDictionary, buildBlockConfigurationSchema, } from '@usewaypoint/document-core';
import ColumnsContainerEditor from '../blocks/ColumnsContainer/ColumnsContainerEditor';
import ColumnsContainerPropsSchema from '../blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import ContainerEditor from '../blocks/Container/ContainerEditor';
import ContainerPropsSchema from '../blocks/Container/ContainerPropsSchema';
import EmailLayoutEditor from '../blocks/EmailLayout/EmailLayoutEditor';
import EmailLayoutPropsSchema from '../blocks/EmailLayout/EmailLayoutPropsSchema';
import EditorBlockWrapper from '../blocks/helpers/block-wrappers/EditorBlockWrapper';
const EDITOR_DICTIONARY = buildBlockConfigurationDictionary({
    Avatar: {
        schema: AvatarPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(Avatar, Object.assign({}, props)))),
    },
    Button: {
        schema: ButtonPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(Button, Object.assign({}, props)))),
    },
    Container: {
        schema: ContainerPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(ContainerEditor, Object.assign({}, props)))),
    },
    ColumnsContainer: {
        schema: ColumnsContainerPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(ColumnsContainerEditor, Object.assign({}, props)))),
    },
    Heading: {
        schema: HeadingPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(Heading, Object.assign({}, props)))),
    },
    Html: {
        schema: HtmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(Html, Object.assign({}, props)))),
    },
    Image: {
        schema: ImagePropsSchema,
        Component: (data) => {
            var _a, _b;
            const props = Object.assign(Object.assign({}, data), { props: Object.assign(Object.assign({}, data.props), { url: (_b = (_a = data.props) === null || _a === void 0 ? void 0 : _a.url) !== null && _b !== void 0 ? _b : 'https://placehold.co/600x400@2x/F8F8F8/CCC?text=Your%20image' }) });
            return (React.createElement(EditorBlockWrapper, null,
                React.createElement(Image, Object.assign({}, props))));
        },
    },
    Text: {
        schema: TextPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(Text, Object.assign({}, props)))),
    },
    EmailLayout: {
        schema: EmailLayoutPropsSchema,
        Component: (p) => React.createElement(EmailLayoutEditor, Object.assign({}, p)),
    },
    Spacer: {
        schema: SpacerPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(Spacer, Object.assign({}, props)))),
    },
    Divider: {
        schema: DividerPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(Divider, Object.assign({}, props)))),
    },
    VideoXml: {
        schema: VideoXmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(VideoXml, Object.assign({}, props)))),
    },
    TherapeuticUpdateXml: {
        schema: TherapeuticUpdateXmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(TherapeuticUpdateXml, Object.assign({}, props)))),
    },
    FeaturedStoryXml: {
        schema: FeaturedStoryXmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(FeaturedStoryXml, Object.assign({}, props)))),
    },
    NewsPanelXml: {
        schema: NewsPanelXmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(NewsPanelXml, Object.assign({}, props)))),
    },
    BlogXml: {
        schema: BlogXmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(BlogXml, Object.assign({}, props)))),
    },
    Advertisement72890Xml: {
        schema: Advertisement72890XmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(Advertisement72890Xml, Object.assign({}, props)))),
    },
    Advertisement300250Xml: {
        schema: Advertisement300250XmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(Advertisement300250Xml, Object.assign({}, props)))),
    },
    ConferenceAdvertisement300250Xml: {
        schema: ConferenceAdvertisement300250XmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(ConferenceAdvertisement300250Xml, Object.assign({}, props)))),
    },
    DailyDownloadXml: {
        schema: DailyDownloadXmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(DailyDownloadXml, Object.assign({}, props)))),
    },
    PromotedSurveyXml: {
        schema: PromotedSurveyXmlPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(PromotedSurveyXml, Object.assign({}, props)))),
    },
    UniversalXmlFeed: {
        schema: UniversalXmlFeedPropsSchema,
        Component: (props) => (React.createElement(EditorBlockWrapper, null,
            React.createElement(UniversalXmlFeed, Object.assign({}, props)))),
    },
});
export const EditorBlock = buildBlockComponent(EDITOR_DICTIONARY);
export const EditorBlockSchema = buildBlockConfigurationSchema(EDITOR_DICTIONARY);
export const EditorConfigurationSchema = z.record(z.string(), EditorBlockSchema);
//# sourceMappingURL=core.js.map