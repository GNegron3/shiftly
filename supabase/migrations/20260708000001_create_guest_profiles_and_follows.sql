-- Migration: create guest_profiles and follows tables
-- guest_profiles establishes guests as first-class users (not raw auth.users references).
-- follows links guest_profiles → profiles (professional profiles table).

-- ─── guest_profiles ─────────────────────────────────────────────────────────

CREATE TABLE guest_profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE guest_profiles ENABLE ROW LEVEL SECURITY;

-- Guests can read their own profile
CREATE POLICY "guest_profiles_select_own"
  ON guest_profiles FOR SELECT
  USING (auth.uid() = id);

-- Guests can insert their own profile (on signup)
CREATE POLICY "guest_profiles_insert_own"
  ON guest_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Guests can update their own profile
CREATE POLICY "guest_profiles_update_own"
  ON guest_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ─── follows ────────────────────────────────────────────────────────────────

CREATE TABLE follows (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id        UUID NOT NULL REFERENCES guest_profiles(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (guest_id, professional_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Guests can read their own follows
CREATE POLICY "follows_select_own_guest"
  ON follows FOR SELECT
  USING (auth.uid() = guest_id);

-- Professionals can read follows where they are the professional
CREATE POLICY "follows_select_own_professional"
  ON follows FOR SELECT
  USING (auth.uid() = professional_id);

-- Guests can follow (insert their own rows only)
CREATE POLICY "follows_insert_own"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = guest_id);

-- Guests can unfollow (delete their own rows only)
CREATE POLICY "follows_delete_own"
  ON follows FOR DELETE
  USING (auth.uid() = guest_id);

-- ─── indexes ────────────────────────────────────────────────────────────────

CREATE INDEX follows_guest_id_idx        ON follows (guest_id);
CREATE INDEX follows_professional_id_idx ON follows (professional_id);
