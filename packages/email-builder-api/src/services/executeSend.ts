import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import { getTemplateById } from '../db/queries';
import { AppError } from '../utils/errors';
import { createAndSendCampaign } from './mailchimpCampaign';

export type ExecuteMode = 'live' | 'test';

export interface SendRowForExecution {
  id: string;
  name: string;
  template_id: string;
  subject: string;
  list_id: string;
  segment_id: number | null;
  from_name: string;
  from_email: string;
  reply_to: string;
  test_subject: string | null;
  test_list_id: string | null;
  test_segment_id: number | null;
}

export async function executeSendForMailchimp(send: SendRowForExecution, mode: ExecuteMode) {
  if (mode === 'test') {
    if (!send.test_subject?.trim() || !send.test_list_id?.trim()) {
      throw new AppError(
        400,
        'Test sends require test subject and test audience on this send',
        'SEND_TEST_CONFIG_MISSING'
      );
    }
  }

  const subject = mode === 'test' ? send.test_subject!.trim() : send.subject.trim();
  const listId = mode === 'test' ? send.test_list_id!.trim() : send.list_id.trim();
  const segmentId =
    mode === 'test'
      ? send.test_segment_id != null
        ? send.test_segment_id
        : undefined
      : send.segment_id != null
        ? send.segment_id
        : undefined;

  const template = await getTemplateById(send.template_id);
  if (!template) {
    throw new AppError(404, 'Template not found or inactive', 'TEMPLATE_NOT_FOUND');
  }

  const htmlContent = await renderToStaticMarkup(template.configuration, { rootBlockId: 'root' });

  const dateStr = new Date().toISOString().split('T')[0];
  const title = `${send.name} ${dateStr}`;

  return createAndSendCampaign({
    title,
    subject,
    fromName: send.from_name,
    fromEmail: send.from_email,
    replyTo: send.reply_to,
    listId,
    segmentId,
    htmlContent,
  });
}
