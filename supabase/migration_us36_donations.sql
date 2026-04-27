-- Migration: US#36 — Create donations table
-- Tracks individual donation transactions by a donee for a fundraising activity.

CREATE TABLE IF NOT EXISTS donations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donee_id    UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  fra_id      UUID NOT NULL REFERENCES fundraising_activities(id) ON DELETE CASCADE,
  amount      NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  donated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for anon on donations"
  ON donations
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);
