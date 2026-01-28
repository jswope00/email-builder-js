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
  Typography,
} from '@mui/material';

import { deleteTemplate } from '../../api/templates';
import type { TemplateListItem } from '../../api/templates';

interface DeleteTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template: TemplateListItem;
}

const CONFIRMATION_TEXT = 'delete';

export default function DeleteTemplateDialog({
  open,
  onClose,
  onSuccess,
  template,
}: DeleteTemplateDialogProps) {
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setConfirmationText('');
      setError(null);
    }
  }, [open]);

  const handleDelete = async () => {
    if (confirmationText.toLowerCase() !== CONFIRMATION_TEXT) {
      setError(`Please type "${CONFIRMATION_TEXT}" to confirm deletion`);
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await deleteTemplate(template.slug);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const isConfirmed = confirmationText.toLowerCase() === CONFIRMATION_TEXT;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Template</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Alert severity="warning">
            This action cannot be undone. The template &quot;{template.name}&quot; will be permanently deleted.
          </Alert>

          <Typography variant="body2" color="text.secondary">
            To confirm deletion, please type <strong>&quot;{CONFIRMATION_TEXT}&quot;</strong> in the box below:
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label={`Type "${CONFIRMATION_TEXT}" to confirm`}
            value={confirmationText}
            onChange={(e) => {
              setConfirmationText(e.target.value);
              setError(null);
            }}
            fullWidth
            disabled={isDeleting}
            autoFocus
            error={confirmationText.length > 0 && !isConfirmed}
            helperText={
              confirmationText.length > 0 && !isConfirmed
                ? `Please type "${CONFIRMATION_TEXT}" exactly`
                : ''
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isDeleting || !isConfirmed}
        >
          {isDeleting ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Deleting...
            </>
          ) : (
            'Delete Template'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
