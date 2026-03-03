var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, CircularProgress, Stack, } from '@mui/material';
import { fetchTemplate, createTemplate } from '../../api/templates';
export default function DuplicateTemplateDialog({ open, onClose, onSuccess, template, }) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDuplicating, setIsDuplicating] = useState(false);
    const [error, setError] = useState(null);
    // Load template data when dialog opens
    useEffect(() => {
        if (open) {
            setIsLoading(true);
            setError(null);
            fetchTemplate(template.slug)
                .then((fullTemplate) => {
                setName(`${fullTemplate.name} (Copy)`);
                setSlug(`${fullTemplate.slug}-copy`);
                setDescription(fullTemplate.description || '');
            })
                .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load template');
            })
                .finally(() => {
                setIsLoading(false);
            });
        }
    }, [open, template]);
    // Auto-generate slug from name
    useEffect(() => {
        if (name && !isLoading) {
            const generatedSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setSlug(generatedSlug);
        }
    }, [name, isLoading]);
    const handleDuplicate = () => __awaiter(this, void 0, void 0, function* () {
        if (!name.trim() || !slug.trim()) {
            setError('Name and slug are required');
            return;
        }
        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(slug)) {
            setError('Slug must contain only lowercase letters, numbers, and hyphens');
            return;
        }
        setIsDuplicating(true);
        setError(null);
        try {
            // Fetch the full template configuration
            const fullTemplate = yield fetchTemplate(template.slug);
            // Create new template with the configuration
            yield createTemplate({
                name: name.trim(),
                slug: slug.trim(),
                description: description.trim() || null,
                configuration: fullTemplate.configuration,
            });
            onSuccess();
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to duplicate template');
        }
        finally {
            setIsDuplicating(false);
        }
    });
    const handleClose = () => {
        if (!isDuplicating && !isLoading) {
            onClose();
        }
    };
    return (React.createElement(Dialog, { open: open, onClose: handleClose, maxWidth: "sm", fullWidth: true },
        React.createElement(DialogTitle, null, "Duplicate Template"),
        React.createElement(DialogContent, null, isLoading ? (React.createElement(Stack, { spacing: 2, sx: { mt: 1, alignItems: 'center', py: 2 } },
            React.createElement(CircularProgress, { size: 24 }),
            React.createElement("span", null, "Loading template..."))) : (React.createElement(Stack, { spacing: 2, sx: { mt: 1 } },
            error && React.createElement(Alert, { severity: "error" }, error),
            React.createElement(Alert, { severity: "info" },
                "This will create a copy of \"",
                template.name,
                "\". You can modify the name and slug."),
            React.createElement(TextField, { label: "Template Name", value: name, onChange: (e) => setName(e.target.value), fullWidth: true, required: true, disabled: isDuplicating, autoFocus: true }),
            React.createElement(TextField, { label: "Slug", value: slug, onChange: (e) => setSlug(e.target.value), fullWidth: true, required: true, disabled: isDuplicating, helperText: "URL-friendly identifier (auto-generated from name)" }),
            React.createElement(TextField, { label: "Description", value: description, onChange: (e) => setDescription(e.target.value), fullWidth: true, multiline: true, rows: 3, disabled: isDuplicating })))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: handleClose, disabled: isDuplicating || isLoading }, "Cancel"),
            React.createElement(Button, { onClick: handleDuplicate, variant: "contained", disabled: isDuplicating || isLoading || !name.trim() || !slug.trim() }, isDuplicating ? (React.createElement(React.Fragment, null,
                React.createElement(CircularProgress, { size: 16, sx: { mr: 1 } }),
                "Duplicating...")) : ('Duplicate')))));
}
//# sourceMappingURL=DuplicateTemplateDialog.js.map