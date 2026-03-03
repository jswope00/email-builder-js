import React from 'react';
import { type TemplateListItem } from '../../../api/templates';
interface SaveTemplateDialogProps {
    open: boolean;
    onClose: () => void;
    onSaved?: () => void;
    existingTemplate?: TemplateListItem | null;
}
export default function SaveTemplateDialog({ open, onClose, onSaved, existingTemplate, }: SaveTemplateDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=SaveTemplateDialog.d.ts.map