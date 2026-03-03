import React from 'react';
import type { TemplateListItem } from '../../api/templates';
interface TemplateRowProps {
    template: TemplateListItem;
    onTemplateDeleted: () => void;
    onTemplateDuplicated: () => void;
    onTemplateUpdated?: () => void;
}
export default function TemplateRow({ template, onTemplateDeleted, onTemplateDuplicated, onTemplateUpdated }: TemplateRowProps): React.JSX.Element;
export {};
//# sourceMappingURL=TemplateRow.d.ts.map