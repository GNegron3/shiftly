import { supabase } from '../lib/supabase';
import { ProfessionalProfile } from '../types/Profile';

export async function getFollowStatus(
  guestId: string,
  professionalId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .eq('guest_id', guestId)
    .eq('professional_id', professionalId)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

export async function followProfessional(
  guestId: string,
  professionalId: string,
): Promise<void> {
  const { error } = await supabase.from('follows').insert({
    guest_id: guestId,
    professional_id: professionalId,
  });

  if (error) throw error;
}

export async function unfollowProfessional(
  guestId: string,
  professionalId: string,
): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('guest_id', guestId)
    .eq('professional_id', professionalId);

  if (error) throw error;
}

export async function getFollowing(
  guestId: string,
): Promise<ProfessionalProfile[]> {
  const { data, error } = await supabase
    .from('follows')
    .select('profiles:professional_id ( id, full_name, trade, workplace_name, workplace_location, bio, updated_at )')
    .eq('guest_id', guestId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? [])
    .map((row) => row.profiles as unknown as ProfessionalProfile | null)
    .filter((p): p is ProfessionalProfile => p !== null);
}
