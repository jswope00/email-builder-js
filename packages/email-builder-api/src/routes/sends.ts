import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { pool } from '../db/connection';
import {
  createSend,
  deleteScheduleRow,
  getSendById,
  hardDeleteSend,
  listSends,
  setScheduleActive,
  setSendActive,
  updateSend,
  type ScheduleInsertRow,
} from '../db/sendQueries';
import type { CreateSendInput } from '../types/send';
import { validateBody, validateParams } from '../middleware/validation';
import { AppError, NotFoundError } from '../utils/errors';
import { computeInitialNextRunAt } from '../utils/scheduleNextRun';
import { executeSendForMailchimp } from '../services/executeSend';

const router = Router();

const UuidParamsSchema = z.object({
  id: z.string().uuid(),
});

const ScheduleSchema = z.discriminatedUnion('scheduleType', [
  z.object({
    scheduleKind: z.enum(['live', 'test']),
    scheduleType: z.literal('one_off'),
    isActive: z.boolean(),
    timezone: z.string().min(1),
    oneOffAt: z.string().min(1),
  }),
  z.object({
    scheduleKind: z.enum(['live', 'test']),
    scheduleType: z.literal('recurring'),
    isActive: z.boolean(),
    timezone: z.string().min(1),
    recurringWeekdays: z.array(z.number().int().min(1).max(7)).min(1),
    recurringTimeLocal: z.string().regex(/^\d{2}:\d{2}$/),
  }),
]);

const SendPayloadSchema = z.object({
  name: z.string(),
  templateId: z.string().uuid(),
  subject: z.string().min(1),
  listId: z.string().min(1),
  segmentId: z.number().int().optional().nullable(),
  fromName: z.string().min(1),
  fromEmail: z.string().email(),
  replyTo: z.string().email(),
  testSubject: z.string().optional().nullable(),
  testListId: z.string().optional().nullable(),
  testSegmentId: z.number().int().optional().nullable(),
  schedules: z.array(ScheduleSchema).optional().default([]),
});

const ExecuteBodySchema = z.object({
  mode: z.enum(['live', 'test']),
});

const PatchActiveSchema = z.object({
  isActive: z.boolean(),
});

const SendScheduleParamsSchema = z.object({
  id: z.string().uuid(),
  scheduleId: z.string().uuid(),
});

function hasTestTargeting(input: z.infer<typeof SendPayloadSchema>) {
  return Boolean(
    (input.testSubject && input.testSubject.trim()) ||
      (input.testListId && input.testListId.trim()) ||
      input.testSegmentId != null
  );
}

function validateTestTargetingComplete(input: z.infer<typeof SendPayloadSchema>) {
  if (!hasTestTargeting(input)) return;
  if (!input.testSubject?.trim() || !input.testListId?.trim()) {
    throw new AppError(
      400,
      'Test audience and test subject are required when using test overrides',
      'VALIDATION_ERROR'
    );
  }
}

function schedulesToRows(
  schedules: z.infer<typeof SendPayloadSchema>['schedules'],
  sendHasTestConfig: boolean
): ScheduleInsertRow[] {
  for (const sch of schedules) {
    if (sch.scheduleKind === 'test' && !sendHasTestConfig) {
      throw new AppError(400, 'Test schedules require test subject and test audience on the send', 'VALIDATION_ERROR');
    }
  }

  return schedules.map((sch) => {
    if (sch.scheduleType === 'one_off') {
      const nextRunAt = computeInitialNextRunAt({
        scheduleType: 'one_off',
        timezone: sch.timezone,
        oneOffAt: sch.oneOffAt,
        isActive: sch.isActive,
      });
      return {
        scheduleKind: sch.scheduleKind,
        scheduleType: 'one_off' as const,
        isActive: sch.isActive,
        timezone: sch.timezone,
        oneOffAt: sch.oneOffAt,
        recurringWeekdays: null,
        recurringTimeLocal: null,
        nextRunAt,
      };
    }

    if (!sch.recurringWeekdays.length) {
      throw new AppError(400, 'Recurring schedules require at least one weekday', 'VALIDATION_ERROR');
    }
    const nextRunAt = computeInitialNextRunAt({
      scheduleType: 'recurring',
      timezone: sch.timezone,
      recurringWeekdays: sch.recurringWeekdays,
      recurringTimeLocal: sch.recurringTimeLocal,
      isActive: sch.isActive,
    });

    return {
      scheduleKind: sch.scheduleKind,
      scheduleType: 'recurring' as const,
      isActive: sch.isActive,
      timezone: sch.timezone,
      oneOffAt: null,
      recurringWeekdays: sch.recurringWeekdays,
      recurringTimeLocal: sch.recurringTimeLocal,
      nextRunAt,
    };
  });
}

function payloadToCreateInput(body: z.infer<typeof SendPayloadSchema>): CreateSendInput {
  return {
    name: body.name,
    templateId: body.templateId,
    subject: body.subject,
    listId: body.listId,
    segmentId: body.segmentId ?? null,
    fromName: body.fromName,
    fromEmail: body.fromEmail,
    replyTo: body.replyTo,
    testSubject: body.testSubject ?? null,
    testListId: body.testListId ?? null,
    testSegmentId: body.testSegmentId ?? null,
  };
}

async function assertTemplateExists(templateId: string) {
  const r = await pool.query(`SELECT 1 FROM email_templates WHERE id = $1 AND is_active = true`, [templateId]);
  if (r.rows.length === 0) {
    throw new NotFoundError('Template not found');
  }
}

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeInactive = req.query.includeInactive === 'true';
    const sends = await listSends(includeInactive);
    res.json(sends);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', validateParams(UuidParamsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const row = await getSendById(req.params.id);
    if (!row) {
      throw new NotFoundError('Send not found');
    }
    res.json(row);
  } catch (e) {
    next(e);
  }
});

router.post('/', validateBody(SendPayloadSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body as z.infer<typeof SendPayloadSchema>;
    validateTestTargetingComplete(body);
    await assertTemplateExists(body.templateId);
    const sendHasTest = Boolean(body.testSubject?.trim() && body.testListId?.trim());
    const scheduleRows = schedulesToRows(body.schedules, sendHasTest);
    const created = await createSend(payloadToCreateInput(body), scheduleRows);
    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
});

router.put(
  '/:id',
  validateParams(UuidParamsSchema),
  validateBody(SendPayloadSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as z.infer<typeof SendPayloadSchema>;
      validateTestTargetingComplete(body);
      await assertTemplateExists(body.templateId);
      const sendHasTest = Boolean(body.testSubject?.trim() && body.testListId?.trim());
      const scheduleRows = schedulesToRows(body.schedules, sendHasTest);
      const updated = await updateSend(req.params.id, payloadToCreateInput(body), scheduleRows);
      if (!updated) {
        throw new NotFoundError('Send not found');
      }
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/:id/schedules/:scheduleId',
  validateParams(SendScheduleParamsSchema),
  validateBody(PatchActiveSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, scheduleId } = req.params as z.infer<typeof SendScheduleParamsSchema>;
      const { isActive } = req.body as z.infer<typeof PatchActiveSchema>;
      const updated = await setScheduleActive(id, scheduleId, isActive);
      if (!updated) {
        throw new NotFoundError('Send or schedule not found');
      }
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

router.delete(
  '/:id/schedules/:scheduleId',
  validateParams(SendScheduleParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, scheduleId } = req.params as z.infer<typeof SendScheduleParamsSchema>;
      const updated = await deleteScheduleRow(id, scheduleId);
      if (!updated) {
        throw new NotFoundError('Send or schedule not found');
      }
      res.json(updated);
    } catch (e) {
      next(e);
    }
  }
);

router.patch(
  '/:id',
  validateParams(UuidParamsSchema),
  validateBody(PatchActiveSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body as z.infer<typeof PatchActiveSchema>;
      const ok = await setSendActive(id, isActive);
      if (!ok) {
        throw new NotFoundError('Send not found');
      }
      const row = await getSendById(id);
      if (!row) {
        throw new NotFoundError('Send not found');
      }
      res.json(row);
    } catch (e) {
      next(e);
    }
  }
);

router.delete('/:id', validateParams(UuidParamsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ok = await hardDeleteSend(req.params.id);
    if (!ok) {
      throw new NotFoundError('Send not found');
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

router.post(
  '/:id/execute',
  validateParams(UuidParamsSchema),
  validateBody(ExecuteBodySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const row = await getSendById(req.params.id);
      if (!row || !row.isActive) {
        throw new NotFoundError('Send not found');
      }
      const { mode } = req.body as z.infer<typeof ExecuteBodySchema>;
      const result = await executeSendForMailchimp(
        {
          id: row.id,
          name: row.name,
          template_id: row.templateId,
          subject: row.subject,
          list_id: row.listId,
          segment_id: row.segmentId,
          from_name: row.fromName,
          from_email: row.fromEmail,
          reply_to: row.replyTo,
          test_subject: row.testSubject,
          test_list_id: row.testListId,
          test_segment_id: row.testSegmentId,
        },
        mode
      );
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
);

export default router;
