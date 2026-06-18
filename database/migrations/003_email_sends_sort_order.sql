-- Migration: 003_email_sends_sort_order.sql
-- Static display order for sends (shared across all users)

ALTER TABLE email_sends ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Backfill: preserve prior list order (most recently updated first → lowest sort_order)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY updated_at DESC, created_at ASC) - 1 AS ord
  FROM email_sends
)
UPDATE email_sends s
SET sort_order = ranked.ord
FROM ranked
WHERE s.id = ranked.id;

CREATE INDEX IF NOT EXISTS idx_email_sends_sort_order ON email_sends(sort_order);
