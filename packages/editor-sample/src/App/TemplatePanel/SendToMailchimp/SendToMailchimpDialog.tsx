import React, { useState, useEffect } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { sendCampaign, fetchAudiences, fetchSegments, type Audience, type Segment } from '../../../api/mailchimp';

interface SendToMailchimpDialogProps {
  open: boolean;
  onClose: () => void;
  onSent?: () => void;
  templateName?: string;
}

export default function SendToMailchimpDialog({
  open,
  onClose,
  onSent,
  templateName = 'Email Template',
}: SendToMailchimpDialogProps) {
  const document = useDocument();
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [fromName, setFromName] = useState('Dr. Jack Cush');
  const [fromEmail, setFromEmail] = useState('jackcush@rheumnow.com');
  const [replyTo, setReplyTo] = useState('jackcush@rheumnow.com');
  const [selectedAudienceId, setSelectedAudienceId] = useState<string>('');
  const [selectedSegmentId, setSelectedSegmentId] = useState<number | undefined>(undefined);
  
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isLoadingAudiences, setIsLoadingAudiences] = useState(false);
  const [isLoadingSegments, setIsLoadingSegments] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate default title: Template Name + Date YYYY-MM-DD
  useEffect(() => {
    if (open) {
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
      setTitle(`${templateName} ${dateStr}`);
      setSubject(`[TEST] ${templateName} ${dateStr}`);
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
    } else {
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

  const loadAudiences = async () => {
    setIsLoadingAudiences(true);
    setError(null);
    try {
      const data = await fetchAudiences();
      setAudiences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audiences');
      console.error('Failed to load audiences:', err);
    } finally {
      setIsLoadingAudiences(false);
    }
  };

  const loadSegments = async (audienceId: string) => {
    setIsLoadingSegments(true);
    try {
      const data = await fetchSegments(audienceId);
      setSegments(data);
    } catch (err) {
      console.error('Failed to load segments:', err);
      setSegments([]);
    } finally {
      setIsLoadingSegments(false);
    }
  };

  const handleSend = async () => {
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
      const htmlContent = await renderToStaticMarkup(document, { rootBlockId: 'root' });

      // Send campaign
      await sendCampaign({
        title: title.trim(),
        subject: subject.trim(),
        fromName: fromName.trim(),
        fromEmail: fromEmail.trim(),
        replyTo: replyTo.trim(),
        listId: selectedAudienceId,
        segmentId: selectedSegmentId,
        htmlContent,
      });

      onSent?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send campaign');
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send to Mailchimp</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Campaign Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            disabled={isSending}
            helperText="Template name + date (auto-generated)"
          />

          <TextField
            label="Subject Line"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            required
            disabled={isSending}
            autoFocus
          />

          <TextField
            label="From Name"
            value={fromName}
            onChange={(e) => setFromName(e.target.value)}
            fullWidth
            required
            disabled={isSending}
          />

          <TextField
            label="From Email"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
            fullWidth
            required
            type="email"
            disabled={isSending}
          />

          <TextField
            label="Reply-To"
            value={replyTo}
            onChange={(e) => setReplyTo(e.target.value)}
            fullWidth
            required
            type="email"
            disabled={isSending}
          />

          <FormControl fullWidth required disabled={isSending || isLoadingAudiences}>
            <InputLabel>Audience</InputLabel>
            <Select
              value={selectedAudienceId}
              label="Audience"
              onChange={(e) => setSelectedAudienceId(e.target.value)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {isLoadingAudiences ? (
                <MenuItem disabled>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Loading audiences...
                </MenuItem>
              ) : (
                audiences.map((audience) => (
                  <MenuItem key={audience.id} value={audience.id}>
                    {audience.name} ({audience.member_count.toLocaleString()} members)
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={isSending || isLoadingSegments || !selectedAudienceId}>
            <InputLabel>Segment (Optional)</InputLabel>
            <Select
              value={selectedSegmentId || ''}
              label="Segment (Optional)"
              onChange={(e) => setSelectedSegmentId(e.target.value ? Number(e.target.value) : undefined)}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              <MenuItem value="">None - Send to entire audience</MenuItem>
              {isLoadingSegments ? (
                <MenuItem disabled>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  Loading segments...
                </MenuItem>
              ) : (
                segments.map((segment) => (
                  <MenuItem key={segment.id} value={segment.id}>
                    {segment.name} ({segment.member_count.toLocaleString()} members)
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSending}>
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          disabled={isSending || !subject.trim() || !selectedAudienceId}
        >
          {isSending ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Sending...
            </>
          ) : (
            'Send Campaign'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
