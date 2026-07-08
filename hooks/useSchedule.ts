import { useCallback, useEffect, useState } from 'react';
import { getSchedule, saveSchedule, DayInput } from '../services/scheduleService';
import { ShiftType } from '../types/Schedule';

const DAYS_COUNT = 7;

const defaultWeek = (): DayInput[] =>
  Array.from({ length: DAYS_COUNT }, () => ({ type: 'off' as ShiftType, note: '' }));

interface UseScheduleResult {
  schedule: DayInput[];
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveError: string | null;
  setDay: (index: number, type: ShiftType) => void;
  setNote: (index: number, note: string) => void;
  save: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSchedule(userId: string | undefined): UseScheduleResult {
  const [schedule, setSchedule] = useState<DayInput[]>(defaultWeek());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await getSchedule(userId);
      const week = defaultWeek();
      rows.forEach(row => {
        week[row.day_of_week] = {
          type: row.shift_type,
          note: row.custom_note ?? '',
        };
      });
      setSchedule(week);
    } catch {
      setError('Failed to load schedule.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const setDay = useCallback((index: number, type: ShiftType) => {
    setSchedule(prev => {
      const next = [...prev];
      next[index] = { ...next[index], type };
      return next;
    });
  }, []);

  const setNote = useCallback((index: number, note: string) => {
    setSchedule(prev => {
      const next = [...prev];
      next[index] = { ...next[index], note };
      return next;
    });
  }, []);

  const save = useCallback(async () => {
    if (!userId) return;

    setSaveError(null);

    const DAYS = [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ];
    const missingNote = schedule.findIndex(d => d.type === 'custom' && !d.note.trim());
    if (missingNote !== -1) {
      const msg = `Please add a note for ${DAYS[missingNote]}.`;
      setSaveError(msg);
      throw new Error(msg);
    }

    setSaving(true);
    try {
      await saveSchedule(userId, schedule);
    } catch (e: unknown) {
      // Avoid overwriting a validation error already set above
      if ((e as Error)?.message?.startsWith('Please add')) throw e;
      setSaveError('Failed to save schedule. Please try again.');
      throw new Error('save_failed');
    } finally {
      setSaving(false);
    }
  }, [userId, schedule]);

  return { schedule, loading, error, saving, saveError, setDay, setNote, save, refresh: fetch };
}
