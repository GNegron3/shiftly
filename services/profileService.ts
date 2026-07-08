import { supabase } from '../lib/supabase';
import { ProfessionalProfile, UpdateProfilePayload } from '../types/Profile';

export async function getProfile(userId: string): Promise<ProfessionalProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // row not found — expected for new users
    throw error;
  }
  return data;
}

export async function updateProfile(
  userId: string,
  payload: UpdateProfilePayload,
): Promise<void> {
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    ...payload,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}
