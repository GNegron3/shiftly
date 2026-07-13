-- Migration: allow professionals to read guest_profiles for their own followers.
-- Without this policy, PostgREST joins from follows → guest_profiles return null
-- for a professional's session because guest_profiles_select_own only permits
-- auth.uid() = id (the guest reading their own row).

CREATE POLICY "guest_profiles_select_for_professional"
  ON guest_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM follows
      WHERE follows.guest_id = guest_profiles.id
        AND follows.professional_id = auth.uid()
    )
  );
