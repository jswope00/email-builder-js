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

import { fetchTemplate, createTemplate } from '../../api/templates';
import type { TemplateListItem } from '../../api/templates';

interface DuplicateTemplateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template: TemplateListItem;
}

export default function DuplicateTemplateDialog({
  open,
  onClose,
  onSuccess,
  template,
}: DuplicateTemplateDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleDuplicate = async () => {
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
      const fullTemplate = await fetchTemplate(template.slug);

      // Create new template with the configuration
      await createTemplate({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        configuration: fullTemplate.configuration,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate template');
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleClose = () => {
    if (!isDuplicating && !isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Duplicate Template</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Stack spacing={2} sx={{ mt: 1, alignItems: 'center', py: 2 }}>
            <CircularProgress size={24} />
            <span>Loading template...</span>
          </Stack>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <Alert severity="info">
              This will create a copy of &quot;{template.name}&quot;. You can modify the name and slug.
            </Alert>

            <TextField
              label="Template Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              disabled={isDuplicating}
              autoFocus
            />

            <TextField
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              fullWidth
              required
              disabled={isDuplicating}
              helperText="URL-friendly identifier (auto-generated from name)"
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              disabled={isDuplicating}
            />
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isDuplicating || isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleDuplicate}
          variant="contained"
          disabled={isDuplicating || isLoading || !name.trim() || !slug.trim()}
        >
          {isDuplicating ? (
            <>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Duplicating...
            </>
          ) : (
            'Duplicate'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
