-- Email Builder Database Schema
-- PostgreSQL database schema for storing email templates

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly identifier (e.g., "rheumnow-daily")
  description TEXT,
  configuration JSONB NOT NULL, -- The full TEditorConfiguration JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255), -- Optional: user identifier (for future multi-user support)
  is_active BOOLEAN DEFAULT true,
  
  CONSTRAINT valid_configuration CHECK (configuration ? 'root')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_templates_slug ON email_templates(slug);
CREATE INDEX IF NOT EXISTS idx_email_templates_active ON email_templates(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_email_templates_created_at ON email_templates(created_at DESC);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on row update
CREATE TRIGGER update_email_templates_updated_at 
    BEFORE UPDATE ON email_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Template versions table (optional, for history/rollback)
-- Uncomment if you want versioning support
/*
CREATE TABLE IF NOT EXISTS email_template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  configuration JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  
  UNIQUE(template_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_template_versions_template_id ON email_template_versions(template_id, version_number DESC);
*/


-- Saved Mailchimp sends and schedules (full definition: database/migrations/002_email_sends_and_schedules.sql)

CREATE TABLE IF NOT EXISTS email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL DEFAULT 'Untitled send',
  template_id UUID NOT NULL REFERENCES email_templates(id) ON DELETE RESTRICT,
  subject VARCHAR(998) NOT NULL,
  list_id VARCHAR(64) NOT NULL,
  segment_id INTEGER,
  from_name VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  reply_to VARCHAR(255) NOT NULL,
  test_subject VARCHAR(998),
  test_list_id VARCHAR(64),
  test_segment_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_email_sends_template_id ON email_sends(template_id);
CREATE INDEX IF NOT EXISTS idx_email_sends_active ON email_sends(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_email_sends_sort_order ON email_sends(sort_order);

CREATE TABLE IF NOT EXISTS email_send_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  send_id UUID NOT NULL REFERENCES email_sends(id) ON DELETE CASCADE,
  schedule_kind VARCHAR(16) NOT NULL CHECK (schedule_kind IN ('live', 'test')),
  schedule_type VARCHAR(16) NOT NULL CHECK (schedule_type IN ('one_off', 'recurring')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  timezone VARCHAR(64) NOT NULL,
  one_off_at TIMESTAMP WITH TIME ZONE,
  recurring_weekdays SMALLINT[],
  recurring_time_local VARCHAR(8),
  next_run_at TIMESTAMP WITH TIME ZONE,
  last_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chk_one_off_has_time CHECK (
    schedule_type != 'one_off' OR one_off_at IS NOT NULL
  ),
  CONSTRAINT chk_recurring_has_pattern CHECK (
    schedule_type != 'recurring'
    OR (recurring_weekdays IS NOT NULL AND array_length(recurring_weekdays, 1) > 0 AND recurring_time_local IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_email_send_schedules_send_id ON email_send_schedules(send_id);
CREATE INDEX IF NOT EXISTS idx_email_send_schedules_next_run
  ON email_send_schedules(next_run_at)
  WHERE is_active = true AND next_run_at IS NOT NULL;

DROP TRIGGER IF EXISTS update_email_sends_updated_at ON email_sends;
CREATE TRIGGER update_email_sends_updated_at
  BEFORE UPDATE ON email_sends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_send_schedules_updated_at ON email_send_schedules;
CREATE TRIGGER update_email_send_schedules_updated_at
  BEFORE UPDATE ON email_send_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
