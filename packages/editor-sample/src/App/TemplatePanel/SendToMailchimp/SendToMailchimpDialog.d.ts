import React from 'react';
interface SendToMailchimpDialogProps {
    open: boolean;
    onClose: () => void;
    onSent?: () => void;
    templateName?: string;
}
export default function SendToMailchimpDialog({ open, onClose, onSent, templateName, }: SendToMailchimpDialogProps): React.JSX.Element;
export {};
//# sourceMappingURL=SendToMailchimpDialog.d.ts.map