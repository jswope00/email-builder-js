import React from 'react';
import { AccountCircleOutlined, ArticleOutlined, CampaignOutlined, Crop32Outlined, DownloadOutlined, HMobiledataOutlined, HorizontalRuleOutlined, HtmlOutlined, ImageOutlined, LibraryAddOutlined, MedicalServicesOutlined, NotesOutlined, OndemandVideoOutlined, PollOutlined, SmartButtonOutlined, ViewColumnOutlined, } from '@mui/icons-material';
export const BUTTONS = [
    {
        label: 'Heading',
        icon: React.createElement(HMobiledataOutlined, null),
        block: () => ({
            type: 'Heading',
            data: {
                props: { text: 'Hello friend' },
                style: {
                    padding: { top: 16, bottom: 16, left: 24, right: 24 },
                },
            },
        }),
    },
    {
        label: 'Text',
        icon: React.createElement(NotesOutlined, null),
        block: () => ({
            type: 'Text',
            data: {
                props: { text: 'My new text block' },
                style: {
                    padding: { top: 16, bottom: 16, left: 24, right: 24 },
                    fontWeight: 'normal',
                },
            },
        }),
    },
    {
        label: 'Button',
        icon: React.createElement(SmartButtonOutlined, null),
        block: () => ({
            type: 'Button',
            data: {
                props: {
                    text: 'Button',
                    url: 'https://www.usewaypoint.com',
                },
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
            },
        }),
    },
    {
        label: 'Image',
        icon: React.createElement(ImageOutlined, null),
        block: () => ({
            type: 'Image',
            data: {
                props: {
                    url: 'https://assets.usewaypoint.com/sample-image.jpg',
                    alt: 'Sample product',
                    contentAlignment: 'middle',
                    linkHref: null,
                },
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
            },
        }),
    },
    {
        label: 'Avatar',
        icon: React.createElement(AccountCircleOutlined, null),
        block: () => ({
            type: 'Avatar',
            data: {
                props: {
                    imageUrl: 'https://ui-avatars.com/api/?size=128',
                    shape: 'circle',
                },
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
            },
        }),
    },
    {
        label: 'Divider',
        icon: React.createElement(HorizontalRuleOutlined, null),
        block: () => ({
            type: 'Divider',
            data: {
                style: { padding: { top: 16, right: 0, bottom: 16, left: 0 } },
                props: {
                    lineColor: '#CCCCCC',
                },
            },
        }),
    },
    {
        label: 'Spacer',
        icon: React.createElement(Crop32Outlined, null),
        block: () => ({
            type: 'Spacer',
            data: {},
        }),
    },
    {
        label: 'Html',
        icon: React.createElement(HtmlOutlined, null),
        block: () => ({
            type: 'Html',
            data: {
                props: { contents: '<strong>Hello world</strong>' },
                style: {
                    fontSize: 16,
                    textAlign: null,
                    padding: { top: 16, bottom: 16, left: 24, right: 24 },
                },
            },
        }),
    },
    {
        label: 'Video XML',
        icon: React.createElement(OndemandVideoOutlined, null),
        block: () => ({
            type: 'VideoXml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    url: '',
                    numberOfItems: 3,
                },
            },
        }),
    },
    {
        label: 'Therapeutic Update XML',
        icon: React.createElement(MedicalServicesOutlined, null),
        block: () => ({
            type: 'TherapeuticUpdateXml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    url: '',
                    numberOfItems: 3,
                },
            },
        }),
    },
    {
        label: 'Featured Story XML',
        icon: React.createElement(LibraryAddOutlined, null),
        block: () => ({
            type: 'FeaturedStoryXml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    url: '',
                    numberOfItems: 3,
                },
            },
        }),
    },
    {
        label: 'News Panel XML',
        icon: React.createElement(LibraryAddOutlined, null),
        block: () => ({
            type: 'NewsPanelXml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
            },
        }),
    },
    {
        label: 'Blog XML',
        icon: React.createElement(ArticleOutlined, null),
        block: () => ({
            type: 'BlogXml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    url: '',
                    numberOfItems: 3,
                },
            },
        }),
    },
    {
        label: 'Advertisement 728x90 XML',
        icon: React.createElement(CampaignOutlined, null),
        block: () => ({
            type: 'Advertisement72890Xml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    url: '',
                    numberOfItems: 3,
                },
            },
        }),
    },
    {
        label: 'Advertisement 300x250 XML',
        icon: React.createElement(CampaignOutlined, null),
        block: () => ({
            type: 'Advertisement300250Xml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    url: '',
                    numberOfItems: 3,
                },
            },
        }),
    },
    {
        label: 'Conference Advertisement 300x250 XML',
        icon: React.createElement(CampaignOutlined, null),
        block: () => ({
            type: 'ConferenceAdvertisement300250Xml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    url: '',
                    numberOfItems: 3,
                },
            },
        }),
    },
    {
        label: 'Daily Download XML',
        icon: React.createElement(DownloadOutlined, null),
        block: () => ({
            type: 'DailyDownloadXml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    url: '',
                    numberOfItems: 3,
                },
            },
        }),
    },
    {
        label: 'Promoted Survey XML',
        icon: React.createElement(PollOutlined, null),
        block: () => ({
            type: 'PromotedSurveyXml',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    url: '',
                    numberOfItems: 3,
                },
            },
        }),
    },
    {
        label: 'Universal XML Feed',
        icon: React.createElement(ArticleOutlined, null),
        block: () => ({
            type: 'UniversalXmlFeed',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
                props: {
                    blockType: 'PromotedSurveyXml',
                    url: '',
                    fieldMapping: {},
                },
            },
        }),
    },
    {
        label: 'Columns',
        icon: React.createElement(ViewColumnOutlined, null),
        block: () => ({
            type: 'ColumnsContainer',
            data: {
                props: {
                    columnsGap: 16,
                    columnsCount: 3,
                    columns: [{ childrenIds: [] }, { childrenIds: [] }, { childrenIds: [] }],
                },
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
            },
        }),
    },
    {
        label: 'Container',
        icon: React.createElement(LibraryAddOutlined, null),
        block: () => ({
            type: 'Container',
            data: {
                style: { padding: { top: 16, bottom: 16, left: 24, right: 24 } },
            },
        }),
    },
    // { label: 'ProgressBar', icon: <ProgressBarOutlined />, block: () => ({}) },
    // { label: 'LoopContainer', icon: <ViewListOutlined />, block: () => ({}) },
];
//# sourceMappingURL=buttons.js.map