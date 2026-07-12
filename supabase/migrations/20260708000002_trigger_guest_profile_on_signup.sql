-- Migration: auto-create guest_profiles row on auth.users insert
-- A SECURITY DEFINER trigger runs with elevated privileges, bypassing RLS.
-- This guarantees the guest_profiles row exists regardless of whether
-- email confirmation is enabled (no client session required).

CREATE OR REPLACE FUNCTION public.handle_new_guest_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'role' = 'guest' THEN
    INSERT INTO public.guest_profiles (id, full_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Guest')
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_guest_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_guest_user();
