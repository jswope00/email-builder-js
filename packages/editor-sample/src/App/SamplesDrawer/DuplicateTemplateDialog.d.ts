import React from 'react';
import type { TemplateListItem } from '../../api/templates';
interface DuplicateTemplateDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    template: TemplateListItem;
}
export default function DuplicateTemplateDialog({ open, onClose, onSuccess, template, }: DuplicateTemplateDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=DuplicateTemplateDialog.d.ts.map