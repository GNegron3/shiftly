import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/auth';

type ShiftType = 'off' | 'lunch' | 'dinner' | 'double' | 'custom';

type DaySchedule = {
  type: ShiftType;
  note: string;
};

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const SHIFTS: { type: ShiftType; label: string }[] = [
  { type: 'off',    label: 'Off'    },
  { type: 'lunch',  label: 'Lunch'  },
  { type: 'dinner', label: 'Dinner' },
  { type: 'double', label: 'Double' },
  { type: 'custom', label: 'Custom' },
];

const defaultWeek = (): DaySchedule[] =>
  Array.from({ length: 7 }, () => ({ type: 'off' as ShiftType, note: '' }));

export default function ScheduleScreen() {
  const { session } = useAuth();
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultWeek());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!session) return;

    const loadSchedule = async () => {
      const { data } = await supabase
        .from('schedules')
        .select('day_of_week, shift_type, custom_note')
        .eq('pro_id', session.user.id)
        .order('day_of_week');

      const week = defaultWeek();
      if (data) {
        data.forEach(row => {
          week[row.day_of_week] = {
            type: row.shift_type as ShiftType,
            note: row.custom_note ?? '',
          };
        });
      }
      setSchedule(week);
      setLoading(false);
    };

    loadSchedule();
  }, [session]);

  const setDay = (dayIndex: number, type: ShiftType) => {
    setSchedule(prev => {
      const next = [...prev];
      next[dayIndex] = { ...next[dayIndex], type };
      return next;
    });
  };

  const setNote = (dayIndex: number, note: string) => {
    setSchedule(prev => {
      const next = [...prev];
      next[dayIndex] = { ...next[dayIndex], note };
      return next;
    });
  };

  const handleSave = async () => {
    setError('');
    setSuccessMessage('');
    if (!session) return;

    // Validate: custom days must have a note.
    const missingNote = schedule.findIndex(d => d.type === 'custom' && !d.note.trim());
    if (missingNote !== -1) {
      setError(`Please add a note for ${DAYS[missingNote]}.`);
      return;
    }

    setSaving(true);
    const rows = schedule.map((day, i) => ({
      pro_id: session.user.id,
      day_of_week: i,
      shift_type: day.type,
      custom_note: day.type === 'custom' ? day.note.trim() : null,
      updated_at: new Date().toISOString(),
    }));

    const { error: upsertError } = await supabase
      .from('schedules')
      .upsert(rows, { onConflict: 'pro_id,day_of_week' });

    setSaving(false);

    if (upsertError) {
      setError(upsertError.message);
      return;
    }

    setSuccessMessage('Schedule saved!');
    setTimeout(() => router.back(), 900);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator color="#F9FAFB" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.heading}>This Week</Text>
            <Text style={styles.subtitle}>Tap to set each day. Done in seconds.</Text>
          </View>

          <View style={styles.dayList}>
            {DAYS.map((day, i) => (
              <View key={day} style={styles.dayBlock}>
                <Text style={styles.dayLabel}>{day}</Text>

                <View style={styles.pillRow}>
                  {SHIFTS.map(({ type, label }) => {
                    const selected = schedule[i].type === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.pill, selected && styles.pillSelected]}
                        onPress={() => setDay(i, type)}
                        activeOpacity={0.75}
                      >
                        <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {schedule[i].type === 'custom' && (
                  <TextInput
                    style={styles.customInput}
                    placeholder="e.g. 3 PM, 4 PM – close"
                    placeholderTextColor="#4B5563"
                    value={schedule[i].note}
                    onChangeText={text => setNote(i, text)}
                    returnKeyType="done"
                  />
                )}
              </View>
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color="#111827" />
              : <Text style={styles.saveButtonText}>Save Schedule</Text>
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  backText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  header: {
    marginBottom: 28,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F9FAFB',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  dayList: {
    gap: 20,
    marginBottom: 32,
  },
  dayBlock: {
    gap: 8,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  pillSelected: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F9FAFB',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  pillTextSelected: {
    color: '#111827',
    fontWeight: '700',
  },
  customInput: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#F9FAFB',
    marginTop: 2,
  },
  errorText: {
    color: '#F87171',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    color: '#34D399',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
