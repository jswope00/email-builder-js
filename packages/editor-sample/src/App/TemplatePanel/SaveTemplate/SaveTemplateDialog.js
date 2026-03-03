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
import { useDocument } from '../../../documents/editor/EditorContext';
import { createTemplate, updateTemplate } from '../../../api/templates';
export default function SaveTemplateDialog({ open, onClose, onSaved, existingTemplate, }) {
    const document = useDocument();
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    // Initialize form when dialog opens
    useEffect(() => {
        if (open) {
            if (existingTemplate) {
                setName(existingTemplate.name);
                setSlug(existingTemplate.slug);
                setDescription(existingTemplate.description || '');
            }
            else {
                setName('');
                setSlug('');
                setDescription('');
            }
            setError(null);
        }
    }, [open, existingTemplate]);
    // Auto-generate slug from name
    useEffect(() => {
        if (!existingTemplate && name) {
            const generatedSlug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setSlug(generatedSlug);
        }
    }, [name, existingTemplate]);
    const handleSave = () => __awaiter(this, void 0, void 0, function* () {
        if (!name.trim() || !slug.trim()) {
            setError('Name and slug are required');
            return;
        }
        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(slug)) {
            setError('Slug must contain only lowercase letters, numbers, and hyphens');
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            if (existingTemplate) {
                // Update existing template
                yield updateTemplate(existingTemplate.slug, {
                    name: name.trim(),
                    slug: slug.trim(),
                    description: description.trim() || null,
                    configuration: document,
                });
            }
            else {
                // Create new template
                yield createTemplate({
                    name: name.trim(),
                    slug: slug.trim(),
                    description: description.trim() || null,
                    configuration: document,
                });
            }
            onSaved === null || onSaved === void 0 ? void 0 : onSaved();
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save template');
        }
        finally {
            setIsSaving(false);
        }
    });
    const handleClose = () => {
        if (!isSaving) {
            onClose();
        }
    };
    return (React.createElement(Dialog, { open: open, onClose: handleClose, maxWidth: "sm", fullWidth: true },
        React.createElement(DialogTitle, null, existingTemplate ? 'Update Template' : 'Save Template'),
        React.createElement(DialogContent, null,
            React.createElement(Stack, { spacing: 2, sx: { mt: 1 } },
                error && React.createElement(Alert, { severity: "error" }, error),
                React.createElement(TextField, { label: "Template Name", value: name, onChange: (e) => setName(e.target.value), fullWidth: true, required: true, disabled: isSaving, autoFocus: true }),
                React.createElement(TextField, { label: "Slug", value: slug, onChange: (e) => setSlug(e.target.value), fullWidth: true, required: true, disabled: isSaving || !!existingTemplate, helperText: existingTemplate
                        ? 'Slug cannot be changed after creation'
                        : 'URL-friendly identifier (auto-generated from name)' }),
                React.createElement(TextField, { label: "Description", value: description, onChange: (e) => setDescription(e.target.value), fullWidth: true, multiline: true, rows: 3, disabled: isSaving }))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: handleClose, disabled: isSaving }, "Cancel"),
            React.createElement(Button, { onClick: handleSave, variant: "contained", disabled: isSaving || !name.trim() || !slug.trim() }, isSaving ? (React.createElement(React.Fragment, null,
                React.createElement(CircularProgress, { size: 16, sx: { mr: 1 } }),
                "Saving...")) : existingTemplate ? ('Update') : ('Save')))));
}
//# sourceMappingURL=SaveTemplateDialog.js.map