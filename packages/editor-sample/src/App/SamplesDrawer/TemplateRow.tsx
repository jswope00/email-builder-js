import React, { useState } from 'react';

import { MoreVert, Delete, ContentCopy, Edit } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Box } from '@mui/material';

import { loadTemplateFromHash } from '../../documents/editor/EditorContext';
import type { TemplateListItem } from '../../api/templates';

import DuplicateTemplateDialog from './DuplicateTemplateDialog';
import DeleteTemplateDialog from './DeleteTemplateDialog';
import SaveTemplateDialog from '../TemplatePanel/SaveTemplate/SaveTemplateDialog';

interface TemplateRowProps {
  template: TemplateListItem;
  onTemplateDeleted: () => void;
  onTemplateDuplicated: () => void;
  onTemplateUpdated?: () => void;
}

export default function TemplateRow({ template, onTemplateDeleted, onTemplateDuplicated, onTemplateUpdated }: TemplateRowProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleTemplateClick = () => {
    const hash = `#template/${template.slug}`;
    window.location.hash = hash;
    loadTemplateFromHash(hash);
  };

  const handleDuplicateClick = () => {
    handleMenuClose();
    setDuplicateDialogOpen(true);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setEditDialogOpen(true);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    onTemplateUpdated?.();
  };

  const handleDuplicateSuccess = () => {
    setDuplicateDialogOpen(false);
    onTemplateDuplicated();
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    onTemplateDeleted();
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: '100%',
          minWidth: 0,
          borderRadius: 1,
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <Button
          size="small"
          onClick={handleTemplateClick}
          sx={{
            flex: 1,
            justifyContent: 'flex-start',
            textTransform: 'none',
            textAlign: 'left',
            minWidth: 0,
            maxWidth: 'calc(100% - 40px)',
            pr: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {template.name}
        </Button>
        <IconButton
          size="small"
          onClick={handleMenuClick}
          sx={{ 
            flexShrink: 0,
            width: 32,
            height: 32,
            ml: 0.5,
          }}
          aria-label="Template options"
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDuplicateClick}>
          <ListItemIcon>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <DuplicateTemplateDialog
        open={duplicateDialogOpen}
        onClose={() => setDuplicateDialogOpen(false)}
        onSuccess={handleDuplicateSuccess}
        template={template}
      />

      <DeleteTemplateDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSuccess={handleDeleteSuccess}
        template={template}
      />

      <SaveTemplateDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSaved={handleEditSuccess}
        existingTemplate={template}
      />
    </>
  );
}
