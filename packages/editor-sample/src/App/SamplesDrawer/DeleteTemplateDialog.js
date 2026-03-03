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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, CircularProgress, Stack, Typography, } from '@mui/material';
import { deleteTemplate } from '../../api/templates';
const CONFIRMATION_TEXT = 'delete';
export default function DeleteTemplateDialog({ open, onClose, onSuccess, template, }) {
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);
    // Reset form when dialog opens/closes
    useEffect(() => {
        if (open) {
            setConfirmationText('');
            setError(null);
        }
    }, [open]);
    const handleDelete = () => __awaiter(this, void 0, void 0, function* () {
        if (confirmationText.toLowerCase() !== CONFIRMATION_TEXT) {
            setError(`Please type "${CONFIRMATION_TEXT}" to confirm deletion`);
            return;
        }
        setIsDeleting(true);
        setError(null);
        try {
            yield deleteTemplate(template.slug);
            onSuccess();
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete template');
        }
        finally {
            setIsDeleting(false);
        }
    });
    const handleClose = () => {
        if (!isDeleting) {
            onClose();
        }
    };
    const isConfirmed = confirmationText.toLowerCase() === CONFIRMATION_TEXT;
    return (React.createElement(Dialog, { open: open, onClose: handleClose, maxWidth: "sm", fullWidth: true },
        React.createElement(DialogTitle, null, "Delete Template"),
        React.createElement(DialogContent, null,
            React.createElement(Stack, { spacing: 2, sx: { mt: 1 } },
                React.createElement(Alert, { severity: "warning" },
                    "This action cannot be undone. The template \"",
                    template.name,
                    "\" will be permanently deleted."),
                React.createElement(Typography, { variant: "body2", color: "text.secondary" },
                    "To confirm deletion, please type ",
                    React.createElement("strong", null,
                        "\"",
                        CONFIRMATION_TEXT,
                        "\""),
                    " in the box below:"),
                error && React.createElement(Alert, { severity: "error" }, error),
                React.createElement(TextField, { label: `Type "${CONFIRMATION_TEXT}" to confirm`, value: confirmationText, onChange: (e) => {
                        setConfirmationText(e.target.value);
                        setError(null);
                    }, fullWidth: true, disabled: isDeleting, autoFocus: true, error: confirmationText.length > 0 && !isConfirmed, helperText: confirmationText.length > 0 && !isConfirmed
                        ? `Please type "${CONFIRMATION_TEXT}" exactly`
                        : '' }))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: handleClose, disabled: isDeleting }, "Cancel"),
            React.createElement(Button, { onClick: handleDelete, variant: "contained", color: "error", disabled: isDeleting || !isConfirmed }, isDeleting ? (React.createElement(React.Fragment, null,
                React.createElement(CircularProgress, { size: 16, sx: { mr: 1 } }),
                "Deleting...")) : ('Delete Template')))));
}
//# sourceMappingURL=DeleteTemplateDialog.js.map