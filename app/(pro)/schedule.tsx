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
import { useState } from 'react';
import { useAuth } from '../../context/auth';
import { useSchedule } from '../../hooks/useSchedule';
import { Colors } from '../../constants/theme';

const DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
];

const SHIFTS = [
  { type: 'off',    label: 'Off'    },
  { type: 'lunch',  label: 'Lunch'  },
  { type: 'dinner', label: 'Dinner' },
  { type: 'double', label: 'Double' },
  { type: 'custom', label: 'Custom' },
] as const;

export default function ScheduleScreen() {
  const { session } = useAuth();
  const { schedule, loading, error, saving, saveError, setDay, setNote, save } =
    useSchedule(session?.user.id);

  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    setSuccessMessage('');
    try {
      await save();
      setSuccessMessage('Schedule saved!');
      setTimeout(() => router.back(), 900);
    } catch {
      // saveError from hook is displayed below
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
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
                    placeholderTextColor={Colors.textSubtle}
                    value={schedule[i].note}
                    onChangeText={text => setNote(i, text)}
                    returnKeyType="done"
                  />
                )}
              </View>
            ))}
          </View>

          {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
          >
            {saving
              ? <ActivityIndicator color={Colors.surface} />
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
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 32,
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
    color: Colors.textMuted,
    fontSize: 16,
  },
  header: {
    marginBottom: 28,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
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
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  pillTextSelected: {
    color: Colors.surface,
    fontWeight: '700',
  },
  customInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  successText: {
    color: Colors.primary,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: Colors.primary,
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
    color: Colors.surface,
  },
});
