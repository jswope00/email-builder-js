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
} from '@mui/material';

import { useDocument } from '../../../documents/editor/EditorContext';
import { createTemplate, updateTemplate, fetchTemplate, type TemplateListItem } from '../../../api/templates';

interface SaveTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
  existingTemplate?: TemplateListItem | null;
}

export default function SaveTemplateDialog({
  open,
  onClose,
  onSaved,
  existingTemplate,
}: SaveTemplateDialogProps) {
  const document = useDocument();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form when dialog opens
  useEffect(() => {
    if (open) {
      if (existingTemplate) {
        setName(existingTemplate.name);
        setSlug(existingTemplate.slug);
        setDescription(existingTemplate.description || '');
      } else {
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

  const handleSave = async () => {
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
        await updateTemplate(existingTemplate.slug, {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          configuration: document,
        });
      } else {
        // Create new template
        await createTemplate({
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || null,
          configuration: document,
        });
      }

      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{existingTemplate ? 'Update Template' : 'Save Template'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Template Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            disabled={isSaving}
            autoFocus
          />

          <TextField
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            fullWidth
            required
            disabled={isSaving || !!existingTemplate}
            helperText={
              existingTemplate
                ? 'Slug cannot be changed after creation'
                : 'URL-friendly identifier (auto-generated from name)'
            }
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            disabled={isSaving}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving || !name.trim() || !slug.trim()}>
          {isSaving ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Saving...
            </>
          ) : existingTemplate ? (
            'Update'
          ) : (
            'Save'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
