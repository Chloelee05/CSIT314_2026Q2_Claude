-- ============================================================
-- FundRaise: Database Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable pgcrypto for bcrypt password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ──────────────────────────────────────────────
-- BCE Entity: UserProfile (#16) / UserAccount (#49)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profiles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username    TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email       TEXT UNIQUE,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'fund_raiser', 'donee', 'platform_management')),
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  full_name   TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- For development: allow the anon key full access to this table.
-- In production, replace with proper RLS policies.
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for anon"
  ON user_profiles
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ──────────────────────────────────────────────
-- BCE Entity: UserProfile (#11) — extended profile details
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profile_details (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id   UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  dob          TEXT,
  address      TEXT,
  phone_number TEXT,
  role         TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_profile_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for anon on user_profile_details"
  ON user_profile_details
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ──────────────────────────────────────────────
-- Seed data (5 test accounts)
-- ──────────────────────────────────────────────
INSERT INTO user_profiles (username, password_hash, role, status, full_name, email) VALUES
  ('admin',        crypt('admin123',    gen_salt('bf', 10)), 'admin',               'active',    'System Administrator', 'admin@fundraise.com'),
  ('fundraiser1',  crypt('password123', gen_salt('bf', 10)), 'fund_raiser',         'active',    'Alice Johnson',        'alice@fundraise.com'),
  ('donee1',       crypt('password123', gen_salt('bf', 10)), 'donee',               'active',    'Bob Smith',            'bob@fundraise.com'),
  ('platformmgr',  crypt('password123', gen_salt('bf', 10)), 'platform_management', 'active',    'Charlie Brown',        'charlie@fundraise.com'),
  ('suspended1',   crypt('password123', gen_salt('bf', 10)), 'fund_raiser',         'suspended', 'Suspended Account',    'suspended@fundraise.com');
