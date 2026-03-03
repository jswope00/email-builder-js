import React, { useState, useEffect } from 'react';
import { SendOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { fetchTemplate } from '../../../api/templates';
import SendToMailchimpDialog from './SendToMailchimpDialog';
export default function SendToMailchimp() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [templateName, setTemplateName] = useState('Email Template');
    // Get template name from URL or default
    useEffect(() => {
        const getTemplateName = () => {
            const hash = window.location.hash;
            if (hash.startsWith('#template/')) {
                const slug = hash.replace('#template/', '');
                fetchTemplate(slug)
                    .then((template) => {
                    setTemplateName(template.name);
                })
                    .catch(() => {
                    setTemplateName('Email Template');
                });
            }
            else {
                setTemplateName('Email Template');
            }
        };
        getTemplateName();
        // Listen for hash changes
        const handleHashChange = () => {
            getTemplateName();
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);
    const handleSent = () => {
        // Could show a success message or refresh
        setDialogOpen(false);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Tooltip, { title: "Send to Mailchimp" },
            React.createElement(IconButton, { onClick: () => setDialogOpen(true) },
                React.createElement(SendOutlined, { fontSize: "small" }))),
        React.createElement(SendToMailchimpDialog, { open: dialogOpen, onClose: () => setDialogOpen(false), onSent: handleSent, templateName: templateName })));
}
//# sourceMappingURL=index.js.map