-- Migration: US#26 — add end_date column to fundraising_activities
-- Run this if you already created the fundraising_activities table from US#25.
ALTER TABLE fundraising_activities ADD COLUMN IF NOT EXISTS end_date DATE;
