-- Migration: US#27 — create saved_fundraising_activities table
-- Run this if you already ran the US#25/26 schema.
CREATE TABLE IF NOT EXISTS saved_fundraising_activities (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donee_id  UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  fra_id    UUID NOT NULL REFERENCES fundraising_activities(id) ON DELETE CASCADE,
  saved_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (donee_id, fra_id)
);

ALTER TABLE saved_fundraising_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for anon on saved_fundraising_activities"
  ON saved_fundraising_activities
  FOR ALL
  USING (true)
  WITH CHECK (true);
