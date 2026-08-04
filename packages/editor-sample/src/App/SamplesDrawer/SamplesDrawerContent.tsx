import React, { useMemo, useState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import {
  Add,
  CreateNewFolderOutlined,
  EditOutlined,
  NoteAddOutlined,
  SendOutlined,
  SettingsOutlined,
} from '@mui/icons-material';

import { resetDocument, setCurrentView } from '../../documents/editor/EditorContext';
import getConfiguration from '../../getConfiguration';
import { createFolder, type TemplateFolder } from '../../api/folders';
import { moveTemplate, type TemplateListItem } from '../../api/templates';

import TemplateRow from './TemplateRow';
import FolderRow from './FolderRow';
import FolderNameDialog from './FolderNameDialog';
import { getTemplateDragPayload, isTemplateDrag } from './templateDrag';
import { useCloseSamplesDrawerOnMobile } from './useMobileNav';

export const SAMPLES_DRAWER_WIDTH = 240;

type SamplesDrawerContentProps = {
  templates: TemplateListItem[];
  folders: TemplateFolder[];
  isLoading: boolean;
  error: string | null;
  onTemplateListChange: () => void;
  onFolderListChange: () => void;
};

const EXPANDED_FOLDERS_KEY = 'email-builder-expanded-folders';

function loadExpandedFolders(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(EXPANDED_FOLDERS_KEY);
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function saveExpandedFolders(state: Record<string, boolean>) {
  try {
    localStorage.setItem(EXPANDED_FOLDERS_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / private mode
  }
}

export default function SamplesDrawerContent({
  templates,
  folders,
  isLoading,
  error,
  onTemplateListChange,
  onFolderListChange,
}: SamplesDrawerContentProps) {
  const closeIfMobile = useCloseSamplesDrawerOnMobile();
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>(loadExpandedFolders);
  const [rootDragOver, setRootDragOver] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const navigateTo = (view: Parameters<typeof setCurrentView>[0]) => {
    setCurrentView(view);
    closeIfMobile();
  };

  const handleNewTemplate = () => {
    setAddMenuAnchorEl(null);
    setCurrentView('editor');
    window.location.hash = '#';
    resetDocument(getConfiguration('#'));
    closeIfMobile();
  };

  const handleNewFolder = () => {
    setAddMenuAnchorEl(null);
    setCreateFolderOpen(true);
  };

  const rootTemplates = useMemo(
    () => templates.filter((t) => !t.folder_id),
    [templates]
  );

  const templatesByFolder = useMemo(() => {
    const map = new Map<string, TemplateListItem[]>();
    for (const folder of folders) {
      map.set(folder.id, []);
    }
    for (const template of templates) {
      if (template.folder_id) {
        const list = map.get(template.folder_id);
        if (list) {
          list.push(template);
        } else {
          // Folder missing from list — still show under root-ish recovery
          // by leaving it out of folders; orphaned templates appear nowhere
          // unless we add them to root. Prefer showing at root.
        }
      }
    }
    return map;
  }, [folders, templates]);

  const orphanTemplates = useMemo(() => {
    const folderIds = new Set(folders.map((f) => f.id));
    return templates.filter((t) => t.folder_id && !folderIds.has(t.folder_id));
  }, [folders, templates]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = { ...prev, [folderId]: !prev[folderId] };
      saveExpandedFolders(next);
      return next;
    });
  };

  const handleDropTemplate = async (slug: string, folderId: string | null) => {
    setIsMoving(true);
    try {
      await moveTemplate(slug, folderId);
      onTemplateListChange();
      onFolderListChange();
    } catch (err) {
      console.error('Failed to move template:', err);
    } finally {
      setIsMoving(false);
    }
  };

  const handleRootDragOver = (event: React.DragEvent) => {
    if (!isTemplateDrag(event.dataTransfer)) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setRootDragOver(true);
  };

  const handleRootDragLeave = (event: React.DragEvent) => {
    if (event.currentTarget.contains(event.relatedTarget as Node)) {
      return;
    }
    setRootDragOver(false);
  };

  const handleRootDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setRootDragOver(false);
    const payload = getTemplateDragPayload(event.dataTransfer);
    if (!payload || payload.folderId === null) {
      // Already at root (or unknown-but-null); skip no-op when known
      return;
    }
    await handleDropTemplate(payload.slug, null);
  };

  return (
    <Stack
      py={1}
      px={2}
      width={SAMPLES_DRAWER_WIDTH}
      height="100%"
      minHeight={0}
      spacing={2}
      sx={{ '& .MuiButton-root': { width: '100%', justifyContent: 'flex-start' } }}
    >
      <Stack spacing={2} flex={1} minHeight={0} width="100%" overflow="auto" alignItems="flex-start">
        <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
          RheumNow Email Builder
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="medium"
          startIcon={<SendOutlined />}
          onClick={() => navigateTo('sends')}
          sx={{ py: 1.25, fontWeight: 600 }}
        >
          Sends &amp; schedules
        </Button>

        <Stack spacing={1} alignItems="flex-start" width="100%">
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1, pt: 0.5, width: '100%' }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center" minWidth={0}>
              <EditOutlined sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography variant="overline" color="primary" sx={{ fontSize: '0.7rem', letterSpacing: '0.06em' }}>
                Templates
              </Typography>
            </Stack>
            <IconButton
              size="small"
              aria-label="Add template or folder"
              aria-controls={addMenuAnchorEl ? 'templates-add-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={addMenuAnchorEl ? 'true' : undefined}
              onClick={(e) => setAddMenuAnchorEl(e.currentTarget)}
              sx={{
                width: 28,
                height: 28,
                color: 'primary.main',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Add sx={{ fontSize: 20 }} />
            </IconButton>
          </Stack>

          <Menu
            id="templates-add-menu"
            anchorEl={addMenuAnchorEl}
            open={Boolean(addMenuAnchorEl)}
            onClose={() => setAddMenuAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleNewTemplate}>
              <ListItemIcon>
                <NoteAddOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Template</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleNewFolder}>
              <ListItemIcon>
                <CreateNewFolderOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>New Folder</ListItemText>
            </MenuItem>
          </Menu>

          {isLoading && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 1, py: 0.5 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                Loading templates…
              </Typography>
            </Stack>
          )}

          {error && (
            <Typography variant="caption" color="error" sx={{ px: 1, py: 0.5 }}>
              {error}
            </Typography>
          )}

          {!isLoading && !error && (
            <Stack spacing={0.5} sx={{ width: '100%', opacity: isMoving ? 0.7 : 1 }}>
              {folders.map((folder) => (
                <FolderRow
                  key={folder.id}
                  folder={folder}
                  templates={templatesByFolder.get(folder.id) ?? []}
                  expanded={Boolean(expandedFolders[folder.id])}
                  onToggle={() => toggleFolder(folder.id)}
                  onFolderChange={() => {
                    onFolderListChange();
                    onTemplateListChange();
                  }}
                  onTemplateListChange={onTemplateListChange}
                  onDropTemplate={handleDropTemplate}
                  onNavigate={closeIfMobile}
                />
              ))}

              <Box
                onDragOver={handleRootDragOver}
                onDragLeave={handleRootDragLeave}
                onDrop={(e) => void handleRootDrop(e)}
                sx={{
                  width: '100%',
                  borderRadius: 1,
                  minHeight: rootTemplates.length + orphanTemplates.length === 0 ? 36 : undefined,
                  outline: rootDragOver ? '2px solid' : 'none',
                  outlineColor: 'primary.main',
                  bgcolor: rootDragOver ? 'action.selected' : 'transparent',
                  px: rootDragOver ? 0.5 : 0,
                  py: rootDragOver ? 0.5 : 0,
                }}
              >
                {rootDragOver && rootTemplates.length + orphanTemplates.length === 0 && (
                  <Typography variant="caption" color="primary" sx={{ px: 1, py: 0.5 }}>
                    Drop here to remove from folder
                  </Typography>
                )}

                {[...rootTemplates, ...orphanTemplates].map((template) => (
                  <TemplateRow
                    key={template.id}
                    template={template}
                    onTemplateDeleted={onTemplateListChange}
                    onTemplateDuplicated={onTemplateListChange}
                    onTemplateUpdated={onTemplateListChange}
                    onNavigate={closeIfMobile}
                  />
                ))}
              </Box>

              {templates.length === 0 && folders.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                  No saved templates yet
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </Stack>

      <Box
        flexShrink={0}
        sx={{
          p: 1.5,
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'action.selected' : 'grey.50'),
        }}
      >
        <Stack spacing={1} alignItems="flex-start">
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ px: 0.25 }}>
            <SettingsOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
              Administration
            </Typography>
          </Stack>

          <Button size="small" variant="outlined" color="inherit" onClick={() => navigateTo('sendExecutions')}>
            Execution history
          </Button>

          <Button size="small" variant="outlined" color="inherit" onClick={() => navigateTo('mailchimp')}>
            Lists &amp; campaigns
          </Button>
        </Stack>
      </Box>

      <FolderNameDialog
        open={createFolderOpen}
        title="New Folder"
        submitLabel="Create"
        onClose={() => setCreateFolderOpen(false)}
        onSubmit={async (name) => {
          const folder = await createFolder({ name });
          setExpandedFolders((prev) => {
            const next = { ...prev, [folder.id]: true };
            saveExpandedFolders(next);
            return next;
          });
          onFolderListChange();
        }}
      />
    </Stack>
  );
}
