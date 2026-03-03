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
import { Button, CircularProgress, Divider, Drawer, Stack, Typography } from '@mui/material';
import { MailOutline } from '@mui/icons-material';
import { useSamplesDrawerOpen, setCurrentView } from '../../documents/editor/EditorContext';
import { fetchTemplates } from '../../api/templates';
import SidebarButton from './SidebarButton';
import TemplateRow from './TemplateRow';
export const SAMPLES_DRAWER_WIDTH = 240;
export default function SamplesDrawer() {
    const samplesDrawerOpen = useSamplesDrawerOpen();
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const loadTemplates = () => __awaiter(this, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const data = yield fetchTemplates();
            setTemplates(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load templates');
            console.error('Failed to load templates:', err);
        }
        finally {
            setIsLoading(false);
        }
    });
    useEffect(() => {
        if (samplesDrawerOpen) {
            loadTemplates();
        }
    }, [samplesDrawerOpen]);
    return (React.createElement(Drawer, { variant: "persistent", anchor: "left", open: samplesDrawerOpen, sx: {
            width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
        } },
        React.createElement(Stack, { spacing: 3, py: 1, px: 2, width: SAMPLES_DRAWER_WIDTH, justifyContent: "space-between", height: "100%" },
            React.createElement(Stack, { spacing: 2, sx: { '& > .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } } },
                React.createElement(Typography, { variant: "h6", component: "h1", sx: { p: 0.75 } }, "RheumNow Email Builder"),
                React.createElement(Stack, { alignItems: "flex-start" },
                    React.createElement(SidebarButton, { href: "#" }, "Empty"),
                    React.createElement(Button, { size: "small", startIcon: React.createElement(MailOutline, null), onClick: () => setCurrentView('mailchimp'), sx: { width: '100%', justifyContent: 'flex-start' } }, "Mailchimp"),
                    isLoading && (React.createElement(Stack, { direction: "row", spacing: 1, alignItems: "center", sx: { px: 1, py: 0.5 } },
                        React.createElement(CircularProgress, { size: 16 }),
                        React.createElement(Typography, { variant: "caption", color: "text.secondary" }, "Loading..."))),
                    error && (React.createElement(Typography, { variant: "caption", color: "error", sx: { px: 1, py: 0.5 } }, error)),
                    !isLoading && !error && templates.length > 0 && (React.createElement(React.Fragment, null,
                        React.createElement(Typography, { variant: "overline", sx: { px: 1, pt: 1, pb: 0.5, fontSize: '0.7rem' } }, "Templates"),
                        React.createElement(Stack, { spacing: 0.5, sx: { width: '100%' } }, templates.map((template) => (React.createElement(TemplateRow, { key: template.id, template: template, onTemplateDeleted: loadTemplates, onTemplateDuplicated: loadTemplates, onTemplateUpdated: loadTemplates })))))),
                    !isLoading && !error && templates.length === 0 && (React.createElement(Typography, { variant: "caption", color: "text.secondary", sx: { px: 1, py: 0.5 } }, "No templates found"))),
                React.createElement(Divider, null)))));
}
//# sourceMappingURL=index.js.map