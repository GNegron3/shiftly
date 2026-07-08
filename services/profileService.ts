import { supabase } from '../lib/supabase';
import { ProfessionalProfile, UpdateProfilePayload } from '../types/Profile';
import { DaySchedule } from '../types/Schedule';

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

export async function getProSchedule(proId: string): Promise<DaySchedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('pro_id', proId)
    .order('day_of_week', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
