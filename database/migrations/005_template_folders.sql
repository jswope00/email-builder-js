-- Migration: 005_template_folders.sql
-- Folders for organizing email templates

CREATE TABLE IF NOT EXISTS template_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_template_folders_name ON template_folders(name);

DROP TRIGGER IF EXISTS update_template_folders_updated_at ON template_folders;
CREATE TRIGGER update_template_folders_updated_at
  BEFORE UPDATE ON template_folders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE email_templates
  ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES template_folders(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_email_templates_folder_id ON email_templates(folder_id)
  WHERE folder_id IS NOT NULL;
