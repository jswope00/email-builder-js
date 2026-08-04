import React, { useEffect, useState } from 'react';

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

import { deleteFolder, type TemplateFolder } from '../../api/folders';

interface DeleteFolderDialogProps {
  open: boolean;
  folder: TemplateFolder;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteFolderDialog({
  open,
  folder,
  onClose,
  onSuccess,
}: DeleteFolderDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setIsDeleting(false);
    }
  }, [open]);

  const handleDelete = async () => {
    if (folder.template_count > 0) {
      setError('Folder must be empty before it can be deleted');
      return;
    }

    setIsDeleting(true);
    setError(null);
    try {
      await deleteFolder(folder.id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete folder');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  const isEmpty = folder.template_count === 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Folder</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {!isEmpty && (
            <Alert severity="warning">
              Move or delete the templates in &quot;{folder.name}&quot; before deleting this folder.
            </Alert>
          )}
          {isEmpty && (
            <Typography variant="body2">
              Delete the empty folder &quot;{folder.name}&quot;?
            </Typography>
          )}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          onClick={() => void handleDelete()}
          variant="contained"
          color="error"
          disabled={isDeleting || !isEmpty}
        >
          {isDeleting ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Deleting…
            </>
          ) : (
            'Delete Folder'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
