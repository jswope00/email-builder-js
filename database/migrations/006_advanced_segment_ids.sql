-- Migration: 006_advanced_segment_ids.sql
-- Store Mailchimp advanced segment string ids; clear legacy integer selections

ALTER TABLE email_sends
  ALTER COLUMN segment_id TYPE TEXT USING segment_id::text,
  ALTER COLUMN test_segment_id TYPE TEXT USING test_segment_id::text;

UPDATE email_sends
SET segment_id = NULL,
    test_segment_id = NULL;
