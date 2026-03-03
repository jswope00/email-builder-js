import React from 'react';
import type { TemplateListItem } from '../../api/templates';
interface DeleteTemplateDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    template: TemplateListItem;
}
export default function DeleteTemplateDialog({ open, onClose, onSuccess, template, }: DeleteTemplateDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=DeleteTemplateDialog.d.ts.map