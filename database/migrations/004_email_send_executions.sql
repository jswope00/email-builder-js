-- Migration: 004_email_send_executions.sql
-- Audit log and idempotency ledger for send executions (manual and scheduled)

CREATE TABLE IF NOT EXISTS email_send_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  send_id UUID NOT NULL REFERENCES email_sends(id) ON DELETE CASCADE,
  schedule_id UUID REFERENCES email_send_schedules(id) ON DELETE SET NULL,
  trigger_type VARCHAR(16) NOT NULL CHECK (trigger_type IN ('manual', 'scheduled')),
  mode VARCHAR(16) NOT NULL CHECK (mode IN ('live', 'test')),
  intended_run_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(16) NOT NULL CHECK (status IN ('started', 'sent', 'failed', 'skipped')),
  mailchimp_campaign_id VARCHAR(64),
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_scheduled_execution_has_slot CHECK (
    trigger_type != 'scheduled' OR (schedule_id IS NOT NULL AND intended_run_at IS NOT NULL)
  ),
  CONSTRAINT chk_manual_execution_has_no_slot CHECK (
    trigger_type != 'manual' OR (schedule_id IS NULL AND intended_run_at IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_send_executions_schedule_slot
  ON email_send_executions (schedule_id, intended_run_at)
  WHERE trigger_type = 'scheduled';

CREATE INDEX IF NOT EXISTS idx_email_send_executions_send_id ON email_send_executions(send_id);
CREATE INDEX IF NOT EXISTS idx_email_send_executions_started_at ON email_send_executions(started_at DESC);

DROP TRIGGER IF EXISTS update_email_send_executions_updated_at ON email_send_executions;
CREATE TRIGGER update_email_send_executions_updated_at
  BEFORE UPDATE ON email_send_executions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
