import React, { useState } from 'react';
import { MoreVert, Delete, ContentCopy, Edit } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { loadTemplateFromHash, setCurrentView } from '../../documents/editor/EditorContext';
import DuplicateTemplateDialog from './DuplicateTemplateDialog';
import DeleteTemplateDialog from './DeleteTemplateDialog';
import SaveTemplateDialog from '../TemplatePanel/SaveTemplate/SaveTemplateDialog';
export default function TemplateRow({ template, onTemplateDeleted, onTemplateDuplicated, onTemplateUpdated }) {
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleMenuClick = (event) => {
        event.stopPropagation();
        setMenuAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };
    const handleTemplateClick = () => {
        setCurrentView('editor');
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
        onTemplateUpdated === null || onTemplateUpdated === void 0 ? void 0 : onTemplateUpdated();
    };
    const handleDuplicateSuccess = () => {
        setDuplicateDialogOpen(false);
        onTemplateDuplicated();
    };
    const handleDeleteSuccess = () => {
        setDeleteDialogOpen(false);
        onTemplateDeleted();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Box, { sx: {
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '100%',
                minWidth: 0,
                borderRadius: 1,
                '&:hover': {
                    backgroundColor: 'action.hover',
                },
            } },
            React.createElement(Button, { size: "small", onClick: handleTemplateClick, sx: {
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
                } }, template.name),
            React.createElement(IconButton, { size: "small", onClick: handleMenuClick, sx: {
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    ml: 0.5,
                }, "aria-label": "Template options" },
                React.createElement(MoreVert, { fontSize: "small" }))),
        React.createElement(Menu, { anchorEl: menuAnchorEl, open: Boolean(menuAnchorEl), onClose: handleMenuClose, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right',
            }, transformOrigin: {
                vertical: 'top',
                horizontal: 'right',
            } },
            React.createElement(MenuItem, { onClick: handleEditClick },
                React.createElement(ListItemIcon, null,
                    React.createElement(Edit, { fontSize: "small" })),
                React.createElement(ListItemText, null, "Edit")),
            React.createElement(MenuItem, { onClick: handleDuplicateClick },
                React.createElement(ListItemIcon, null,
                    React.createElement(ContentCopy, { fontSize: "small" })),
                React.createElement(ListItemText, null, "Duplicate")),
            React.createElement(MenuItem, { onClick: handleDeleteClick },
                React.createElement(ListItemIcon, null,
                    React.createElement(Delete, { fontSize: "small" })),
                React.createElement(ListItemText, null, "Delete"))),
        React.createElement(DuplicateTemplateDialog, { open: duplicateDialogOpen, onClose: () => setDuplicateDialogOpen(false), onSuccess: handleDuplicateSuccess, template: template }),
        React.createElement(DeleteTemplateDialog, { open: deleteDialogOpen, onClose: () => setDeleteDialogOpen(false), onSuccess: handleDeleteSuccess, template: template }),
        React.createElement(SaveTemplateDialog, { open: editDialogOpen, onClose: () => setEditDialogOpen(false), onSaved: handleEditSuccess, existingTemplate: template })));
}
//# sourceMappingURL=TemplateRow.js.map