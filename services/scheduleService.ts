import { supabase } from '../lib/supabase';
import { DaySchedule, ShiftType } from '../types/Schedule';

export type DayInput = {
  type: ShiftType;
  note: string;
};

export async function getSchedule(proId: string): Promise<DaySchedule[]> {
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('pro_id', proId)
    .order('day_of_week', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function saveSchedule(proId: string, days: DayInput[]): Promise<void> {
  const rows = days.map((day, i) => ({
    pro_id: proId,
    day_of_week: i,
    shift_type: day.type,
    custom_note: day.type === 'custom' ? day.note.trim() : null,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('schedules')
    .upsert(rows, { onConflict: 'pro_id,day_of_week' });

  if (error) throw error;
}
