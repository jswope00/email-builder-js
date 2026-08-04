import React, { useState } from 'react';

import {
  ChevronRight,
  Delete,
  Edit,
  ExpandMore,
  Folder,
  FolderOpen,
  MoreVert,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Collapse,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import { updateFolder, type TemplateFolder } from '../../api/folders';
import type { TemplateListItem } from '../../api/templates';

import DeleteFolderDialog from './DeleteFolderDialog';
import FolderNameDialog from './FolderNameDialog';
import TemplateRow from './TemplateRow';
import { getTemplateDragPayload, isTemplateDrag } from './templateDrag';

interface FolderRowProps {
  folder: TemplateFolder;
  templates: TemplateListItem[];
  expanded: boolean;
  onToggle: () => void;
  onFolderChange: () => void;
  onTemplateListChange: () => void;
  onDropTemplate: (slug: string, folderId: string | null) => Promise<void>;
  onNavigate?: () => void;
}

export default function FolderRow({
  folder,
  templates,
  expanded,
  onToggle,
  onFolderChange,
  onTemplateListChange,
  onDropTemplate,
  onNavigate,
}: FolderRowProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropping, setIsDropping] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDragOver = (event: React.DragEvent) => {
    if (!isTemplateDrag(event.dataTransfer)) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }
    setIsDragOver(false);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const payload = getTemplateDragPayload(event.dataTransfer);
    if (!payload || (payload.folderId !== undefined && payload.folderId === folder.id)) {
      return;
    }

    setIsDropping(true);
    try {
      await onDropTemplate(payload.slug, folder.id);
      if (!expanded) {
        onToggle();
      }
    } finally {
      setIsDropping(false);
    }
  };

  return (
    <>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(e) => void handleDrop(e)}
        sx={{
          width: '100%',
          borderRadius: 1,
          outline: isDragOver ? '2px solid' : 'none',
          outlineColor: 'primary.main',
          bgcolor: isDragOver ? 'action.selected' : 'transparent',
          opacity: isDropping ? 0.7 : 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            minWidth: 0,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Button
            size="small"
            onClick={onToggle}
            sx={{
              flex: 1,
              justifyContent: 'flex-start',
              textTransform: 'none',
              textAlign: 'left',
              minWidth: 0,
              maxWidth: 'calc(100% - 40px)',
              pr: 0.5,
              color: 'text.primary',
              gap: 0.5,
            }}
          >
            {expanded ? (
              <ExpandMore sx={{ fontSize: 18, flexShrink: 0, color: 'text.secondary' }} />
            ) : (
              <ChevronRight sx={{ fontSize: 18, flexShrink: 0, color: 'text.secondary' }} />
            )}
            {expanded ? (
              <FolderOpen sx={{ fontSize: 18, flexShrink: 0, color: 'warning.main' }} />
            ) : (
              <Folder sx={{ fontSize: 18, flexShrink: 0, color: 'warning.main' }} />
            )}
            <Typography
              component="span"
              variant="body2"
              noWrap
              sx={{ fontWeight: 500, minWidth: 0 }}
            >
              {folder.name}
            </Typography>
            <Typography component="span" variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
              ({templates.length})
            </Typography>
          </Button>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{ flexShrink: 0, width: 32, height: 32, ml: 0.5 }}
            aria-label="Folder options"
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Stack spacing={0.5} sx={{ width: '100%', pl: 1.5, pt: 0.25, pb: 0.5 }}>
            {templates.length === 0 ? (
              <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                Drop templates here
              </Typography>
            ) : (
              templates.map((template) => (
                <TemplateRow
                  key={template.id}
                  template={template}
                  onTemplateDeleted={onTemplateListChange}
                  onTemplateDuplicated={onTemplateListChange}
                  onTemplateUpdated={onTemplateListChange}
                  onNavigate={onNavigate}
                />
              ))
            )}
          </Stack>
        </Collapse>
      </Box>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setRenameOpen(true);
          }}
        >
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            setDeleteOpen(true);
          }}
        >
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      <FolderNameDialog
        open={renameOpen}
        title="Rename Folder"
        submitLabel="Rename"
        initialName={folder.name}
        onClose={() => setRenameOpen(false)}
        onSubmit={async (name) => {
          await updateFolder(folder.id, { name });
          onFolderChange();
        }}
      />

      <DeleteFolderDialog
        open={deleteOpen}
        folder={{ ...folder, template_count: templates.length }}
        onClose={() => setDeleteOpen(false)}
        onSuccess={onFolderChange}
      />
    </>
  );
}
