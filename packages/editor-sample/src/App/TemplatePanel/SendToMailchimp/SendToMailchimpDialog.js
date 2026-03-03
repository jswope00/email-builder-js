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
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert, CircularProgress, Stack, MenuItem, FormControl, InputLabel, Select, } from '@mui/material';
import { useDocument } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { sendCampaign, fetchAudiences, fetchSegments } from '../../../api/mailchimp';
export default function SendToMailchimpDialog({ open, onClose, onSent, templateName = 'Email Template', }) {
    const document = useDocument();
    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [fromName, setFromName] = useState('Dr. Jack Cush');
    const [fromEmail, setFromEmail] = useState('jackcush@rheumnow.com');
    const [replyTo, setReplyTo] = useState('jackcush@rheumnow.com');
    const [selectedAudienceId, setSelectedAudienceId] = useState('');
    const [selectedSegmentId, setSelectedSegmentId] = useState(undefined);
    const [audiences, setAudiences] = useState([]);
    const [segments, setSegments] = useState([]);
    const [isLoadingAudiences, setIsLoadingAudiences] = useState(false);
    const [isLoadingSegments, setIsLoadingSegments] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    // Generate default title: Template Name + Date YYYY-MM-DD
    useEffect(() => {
        if (open) {
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
            setTitle(`${templateName} ${dateStr}`);
            setError(null);
        }
    }, [open, templateName]);
    // Load audiences when dialog opens
    useEffect(() => {
        if (open) {
            loadAudiences();
        }
    }, [open]);
    // Load segments when audience changes
    useEffect(() => {
        if (selectedAudienceId) {
            loadSegments(selectedAudienceId);
            setSelectedSegmentId(undefined); // Reset segment when audience changes
        }
        else {
            setSegments([]);
        }
    }, [selectedAudienceId]);
    // Set default audience to "Administrators" when audiences load
    useEffect(() => {
        if (audiences.length > 0 && !selectedAudienceId) {
            const adminAudience = audiences.find((a) => a.name === 'Administrators');
            if (adminAudience) {
                setSelectedAudienceId(adminAudience.id);
            }
        }
    }, [audiences, selectedAudienceId]);
    const loadAudiences = () => __awaiter(this, void 0, void 0, function* () {
        setIsLoadingAudiences(true);
        setError(null);
        try {
            const data = yield fetchAudiences();
            setAudiences(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load audiences');
            console.error('Failed to load audiences:', err);
        }
        finally {
            setIsLoadingAudiences(false);
        }
    });
    const loadSegments = (audienceId) => __awaiter(this, void 0, void 0, function* () {
        setIsLoadingSegments(true);
        try {
            const data = yield fetchSegments(audienceId);
            setSegments(data);
        }
        catch (err) {
            console.error('Failed to load segments:', err);
            setSegments([]);
        }
        finally {
            setIsLoadingSegments(false);
        }
    });
    const handleSend = () => __awaiter(this, void 0, void 0, function* () {
        if (!subject.trim()) {
            setError('Subject line is required');
            return;
        }
        if (!selectedAudienceId) {
            setError('Please select an audience');
            return;
        }
        setIsSending(true);
        setError(null);
        try {
            // Generate HTML from document
            const htmlContent = yield renderToStaticMarkup(document, { rootBlockId: 'root' });
            // Send campaign
            yield sendCampaign({
                title: title.trim(),
                subject: subject.trim(),
                fromName: fromName.trim(),
                fromEmail: fromEmail.trim(),
                replyTo: replyTo.trim(),
                listId: selectedAudienceId,
                segmentId: selectedSegmentId,
                htmlContent,
            });
            onSent === null || onSent === void 0 ? void 0 : onSent();
            onClose();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send campaign');
        }
        finally {
            setIsSending(false);
        }
    });
    const handleClose = () => {
        if (!isSending) {
            onClose();
        }
    };
    return (React.createElement(Dialog, { open: open, onClose: handleClose, maxWidth: "sm", fullWidth: true },
        React.createElement(DialogTitle, null, "Send to Mailchimp"),
        React.createElement(DialogContent, null,
            React.createElement(Stack, { spacing: 2, sx: { mt: 1 } },
                error && React.createElement(Alert, { severity: "error" }, error),
                React.createElement(TextField, { label: "Campaign Title", value: title, onChange: (e) => setTitle(e.target.value), fullWidth: true, required: true, disabled: isSending, helperText: "Template name + date (auto-generated)" }),
                React.createElement(TextField, { label: "Subject Line", value: subject, onChange: (e) => setSubject(e.target.value), fullWidth: true, required: true, disabled: isSending, autoFocus: true }),
                React.createElement(TextField, { label: "From Name", value: fromName, onChange: (e) => setFromName(e.target.value), fullWidth: true, required: true, disabled: isSending }),
                React.createElement(TextField, { label: "From Email", value: fromEmail, onChange: (e) => setFromEmail(e.target.value), fullWidth: true, required: true, type: "email", disabled: isSending }),
                React.createElement(TextField, { label: "Reply-To", value: replyTo, onChange: (e) => setReplyTo(e.target.value), fullWidth: true, required: true, type: "email", disabled: isSending }),
                React.createElement(FormControl, { fullWidth: true, required: true, disabled: isSending || isLoadingAudiences },
                    React.createElement(InputLabel, null, "Audience"),
                    React.createElement(Select, { value: selectedAudienceId, label: "Audience", onChange: (e) => setSelectedAudienceId(e.target.value), MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 300,
                                },
                            },
                        } }, isLoadingAudiences ? (React.createElement(MenuItem, { disabled: true },
                        React.createElement(CircularProgress, { size: 16, sx: { mr: 1 } }),
                        "Loading audiences...")) : (audiences.map((audience) => (React.createElement(MenuItem, { key: audience.id, value: audience.id },
                        audience.name,
                        " (",
                        audience.member_count.toLocaleString(),
                        " members)")))))),
                React.createElement(FormControl, { fullWidth: true, disabled: isSending || isLoadingSegments || !selectedAudienceId },
                    React.createElement(InputLabel, null, "Segment (Optional)"),
                    React.createElement(Select, { value: selectedSegmentId || '', label: "Segment (Optional)", onChange: (e) => setSelectedSegmentId(e.target.value ? Number(e.target.value) : undefined), MenuProps: {
                            PaperProps: {
                                style: {
                                    maxHeight: 300,
                                },
                            },
                        } },
                        React.createElement(MenuItem, { value: "" }, "None - Send to entire audience"),
                        isLoadingSegments ? (React.createElement(MenuItem, { disabled: true },
                            React.createElement(CircularProgress, { size: 16, sx: { mr: 1 } }),
                            "Loading segments...")) : (segments.map((segment) => (React.createElement(MenuItem, { key: segment.id, value: segment.id },
                            segment.name,
                            " (",
                            segment.member_count.toLocaleString(),
                            " members)")))))))),
        React.createElement(DialogActions, null,
            React.createElement(Button, { onClick: handleClose, disabled: isSending }, "Cancel"),
            React.createElement(Button, { onClick: handleSend, variant: "contained", disabled: isSending || !subject.trim() || !selectedAudienceId }, isSending ? (React.createElement(React.Fragment, null,
                React.createElement(CircularProgress, { size: 16, sx: { mr: 1 } }),
                "Sending...")) : ('Send Campaign')))));
}
//# sourceMappingURL=SendToMailchimpDialog.js.map