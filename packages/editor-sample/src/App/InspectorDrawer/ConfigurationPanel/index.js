import React from 'react';
import { Box, Typography } from '@mui/material';
import { setDocument, useDocument, useSelectedBlockId } from '../../../documents/editor/EditorContext';
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
import UniversalXmlFeedSidebarPanel from './input-panels/UniversalXmlFeedSidebarPanel';
import TherapeuticUpdateXmlSidebarPanel from './input-panels/TherapeuticUpdateXmlSidebarPanel';
import VideoXmlSidebarPanel from './input-panels/VideoXmlSidebarPanel';
function renderMessage(val) {
    return (React.createElement(Box, { sx: { m: 3, p: 1, border: '1px dashed', borderColor: 'divider' } },
        React.createElement(Typography, { color: "text.secondary" }, val)));
}
export default function ConfigurationPanel() {
    const document = useDocument();
    const selectedBlockId = useSelectedBlockId();
    if (!selectedBlockId) {
        return renderMessage('Click on a block to inspect.');
    }
    const block = document[selectedBlockId];
    if (!block) {
        return renderMessage(`Block with id ${selectedBlockId} was not found. Click on a block to reset.`);
    }
    const setBlock = (conf) => setDocument({ [selectedBlockId]: conf });
    const { data, type } = block;
    switch (type) {
        case 'Avatar':
            return React.createElement(AvatarSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'Button':
            return React.createElement(ButtonSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'ColumnsContainer':
            return (React.createElement(ColumnsContainerSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'Container':
            return React.createElement(ContainerSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'Divider':
            return React.createElement(DividerSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'Heading':
            return React.createElement(HeadingSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'Html':
            return React.createElement(HtmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'Image':
            return React.createElement(ImageSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'EmailLayout':
            return React.createElement(EmailLayoutSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'Spacer':
            return React.createElement(SpacerSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'Text':
            return React.createElement(TextSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'VideoXml':
            return React.createElement(VideoXmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) });
        case 'TherapeuticUpdateXml':
            return (React.createElement(TherapeuticUpdateXmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'FeaturedStoryXml':
            return (React.createElement(FeaturedStoryXmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'NewsPanelXml':
            return (React.createElement(NewsPanelXmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'BlogXml':
            return (React.createElement(BlogXmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'Advertisement72890Xml':
            return (React.createElement(Advertisement72890XmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'Advertisement300250Xml':
            return (React.createElement(Advertisement300250XmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'ConferenceAdvertisement300250Xml':
            return (React.createElement(ConferenceAdvertisement300250XmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'DailyDownloadXml':
            return (React.createElement(DailyDownloadXmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'PromotedSurveyXml':
            return (React.createElement(PromotedSurveyXmlSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        case 'UniversalXmlFeed':
            return (React.createElement(UniversalXmlFeedSidebarPanel, { key: selectedBlockId, data: data, setData: (data) => setBlock({ type, data }) }));
        default:
            return React.createElement("pre", null, JSON.stringify(block, null, '  '));
    }
}
//# sourceMappingURL=index.js.map