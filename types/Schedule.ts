export type ShiftType = 'off' | 'lunch' | 'dinner' | 'double' | 'custom';

export interface DaySchedule {
  id?: string;
  pro_id: string;
  day_of_week: number; // 0 = Monday … 6 = Sunday (matches existing convention)
  shift_type: ShiftType;
  custom_note: string | null;
  updated_at: string;
}
