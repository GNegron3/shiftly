import { supabase } from '../lib/supabase';
import { GuestProfile, CreateGuestProfilePayload } from '../types/GuestProfile';

export async function getGuestProfile(userId: string): Promise<GuestProfile | null> {
  const { data, error } = await supabase
    .from('guest_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function createGuestProfile(
  payload: CreateGuestProfilePayload,
): Promise<void> {
  const { error } = await supabase.from('guest_profiles').insert({
    id: payload.id,
    full_name: payload.full_name,
  });

  if (error) throw error;
}
