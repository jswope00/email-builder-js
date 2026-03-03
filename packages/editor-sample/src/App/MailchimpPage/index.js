var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, CircularProgress, Stack, Typography, Chip, Alert, } from '@mui/material';
import { ExpandMore, People, Campaign, Segment as SegmentIcon } from '@mui/icons-material';
import { fetchAudiences, fetchSegments, fetchCampaigns } from '../../api/mailchimp';
export default function MailchimpPage() {
    const [audiences, setAudiences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const loadAudiences = () => __awaiter(this, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const data = yield fetchAudiences();
            setAudiences(data.map((audience) => (Object.assign(Object.assign({}, audience), { segments: [], campaigns: [] }))));
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load audiences');
            console.error('Failed to load audiences:', err);
        }
        finally {
            setIsLoading(false);
        }
    });
    const loadSegments = (audienceId) => __awaiter(this, void 0, void 0, function* () {
        const audience = audiences.find((a) => a.id === audienceId);
        if (!audience)
            return;
        setAudiences((prev) => prev.map((a) => (a.id === audienceId ? Object.assign(Object.assign({}, a), { loadingSegments: true, segmentsError: undefined }) : a)));
        try {
            const segments = yield fetchSegments(audienceId);
            setAudiences((prev) => prev.map((a) => (a.id === audienceId ? Object.assign(Object.assign({}, a), { segments, loadingSegments: false }) : a)));
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load segments';
            setAudiences((prev) => prev.map((a) => a.id === audienceId
                ? Object.assign(Object.assign({}, a), { loadingSegments: false, segmentsError: errorMessage }) : a));
        }
    });
    const loadCampaigns = (audienceId) => __awaiter(this, void 0, void 0, function* () {
        const audience = audiences.find((a) => a.id === audienceId);
        if (!audience)
            return;
        setAudiences((prev) => prev.map((a) => (a.id === audienceId ? Object.assign(Object.assign({}, a), { loadingCampaigns: true, campaignsError: undefined }) : a)));
        try {
            const campaigns = yield fetchCampaigns(audienceId, 10);
            setAudiences((prev) => prev.map((a) => (a.id === audienceId ? Object.assign(Object.assign({}, a), { campaigns, loadingCampaigns: false }) : a)));
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load campaigns';
            setAudiences((prev) => prev.map((a) => a.id === audienceId
                ? Object.assign(Object.assign({}, a), { loadingCampaigns: false, campaignsError: errorMessage }) : a));
        }
    });
    const handleAccordionChange = (audienceId, expanded) => {
        const audience = audiences.find((a) => a.id === audienceId);
        if (!audience)
            return;
        if (expanded) {
            // Load segments and campaigns when accordion is expanded
            if (!audience.segments || audience.segments.length === 0) {
                loadSegments(audienceId);
            }
            if (!audience.campaigns || audience.campaigns.length === 0) {
                loadCampaigns(audienceId);
            }
        }
    };
    useEffect(() => {
        loadAudiences();
    }, []);
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        }
        catch (_a) {
            return dateString;
        }
    };
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'sent':
                return 'success';
            case 'scheduled':
                return 'info';
            case 'saving':
            case 'paused':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };
    return (React.createElement(Box, { sx: { height: '100vh', overflow: 'auto', p: 3 } },
        React.createElement(Stack, { spacing: 3 },
            React.createElement(Typography, { variant: "h4", component: "h1" }, "Mailchimp Integration"),
            isLoading && (React.createElement(Stack, { direction: "row", spacing: 2, alignItems: "center", justifyContent: "center", sx: { py: 4 } },
                React.createElement(CircularProgress, { size: 24 }),
                React.createElement(Typography, null, "Loading audiences..."))),
            error && (React.createElement(Alert, { severity: "error", onClose: () => setError(null) }, error)),
            !isLoading && !error && audiences.length === 0 && (React.createElement(Alert, { severity: "info" }, "No audiences found in your Mailchimp account.")),
            !isLoading &&
                !error &&
                audiences.map((audience) => (React.createElement(Accordion, { key: audience.id, onChange: (_, expanded) => handleAccordionChange(audience.id, expanded) },
                    React.createElement(AccordionSummary, { expandIcon: React.createElement(ExpandMore, null) },
                        React.createElement(Stack, { direction: "row", spacing: 2, alignItems: "center", sx: { width: '100%' } },
                            React.createElement(People, { color: "primary" }),
                            React.createElement(Box, { sx: { flex: 1 } },
                                React.createElement(Typography, { variant: "h6" }, audience.name),
                                React.createElement(Typography, { variant: "caption", color: "text.secondary" },
                                    audience.member_count.toLocaleString(),
                                    " members \u2022 Created ",
                                    formatDate(audience.created_at))))),
                    React.createElement(AccordionDetails, null,
                        React.createElement(Stack, { spacing: 3 },
                            React.createElement(Box, null,
                                React.createElement(Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { mb: 2 } },
                                    React.createElement(SegmentIcon, { color: "primary" }),
                                    React.createElement(Typography, { variant: "h6" }, "Segments")),
                                audience.loadingSegments && (React.createElement(Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { py: 2 } },
                                    React.createElement(CircularProgress, { size: 16 }),
                                    React.createElement(Typography, { variant: "caption" }, "Loading segments..."))),
                                audience.segmentsError && (React.createElement(Alert, { severity: "error", sx: { mb: 2 } }, audience.segmentsError)),
                                !audience.loadingSegments && !audience.segmentsError && audience.segments && (React.createElement(React.Fragment, null, audience.segments.length === 0 ? (React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "No segments found for this audience.")) : (React.createElement(Stack, { spacing: 1 }, audience.segments.map((segment) => (React.createElement(Card, { key: segment.id, variant: "outlined" },
                                    React.createElement(CardContent, null,
                                        React.createElement(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center" },
                                            React.createElement(Box, null,
                                                React.createElement(Typography, { variant: "subtitle1" }, segment.name),
                                                React.createElement(Typography, { variant: "caption", color: "text.secondary" },
                                                    segment.member_count.toLocaleString(),
                                                    " members \u2022 Type: ",
                                                    segment.type)))))))))))),
                            React.createElement(Box, null,
                                React.createElement(Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { mb: 2 } },
                                    React.createElement(Campaign, { color: "primary" }),
                                    React.createElement(Typography, { variant: "h6" }, "Recent Campaigns")),
                                audience.loadingCampaigns && (React.createElement(Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { py: 2 } },
                                    React.createElement(CircularProgress, { size: 16 }),
                                    React.createElement(Typography, { variant: "caption" }, "Loading campaigns..."))),
                                audience.campaignsError && (React.createElement(Alert, { severity: "error", sx: { mb: 2 } }, audience.campaignsError)),
                                !audience.loadingCampaigns && !audience.campaignsError && audience.campaigns && (React.createElement(React.Fragment, null, audience.campaigns.length === 0 ? (React.createElement(Typography, { variant: "body2", color: "text.secondary" }, "No campaigns found for this audience.")) : (React.createElement(Stack, { spacing: 1 }, audience.campaigns.map((campaign) => (React.createElement(Card, { key: campaign.id, variant: "outlined" },
                                    React.createElement(CardContent, null,
                                        React.createElement(Stack, { spacing: 1 },
                                            React.createElement(Stack, { direction: "row", justifyContent: "space-between", alignItems: "flex-start" },
                                                React.createElement(Box, { sx: { flex: 1 } },
                                                    React.createElement(Typography, { variant: "subtitle1" }, campaign.name),
                                                    campaign.subject && (React.createElement(Typography, { variant: "body2", color: "text.secondary" },
                                                        "Subject: ",
                                                        campaign.subject))),
                                                React.createElement(Chip, { label: campaign.status, color: getStatusColor(campaign.status), size: "small" })),
                                            React.createElement(Stack, { direction: "row", spacing: 2 },
                                                campaign.send_time && (React.createElement(Typography, { variant: "caption", color: "text.secondary" },
                                                    "Sent: ",
                                                    formatDate(campaign.send_time))),
                                                campaign.recipients && (React.createElement(Typography, { variant: "caption", color: "text.secondary" },
                                                    "Recipients: ",
                                                    campaign.recipients.recipient_count.toLocaleString())))))))))))))))))))));
}
//# sourceMappingURL=index.js.map