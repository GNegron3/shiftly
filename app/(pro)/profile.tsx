import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/auth';
import { useProfile } from '../../hooks/useProfile';

export default function ProfileScreen() {
  const { session } = useAuth();
  const { profile, loading, saving, saveError, updateProfile } = useProfile(
    session?.user.id,
  );

  const [fullName, setFullName] = useState('');
  const [trade, setTrade] = useState('');
  const [workplaceName, setWorkplaceName] = useState('');
  const [workplaceLocation, setWorkplaceLocation] = useState('');
  const [bio, setBio] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Pre-populate form once profile loads. Falls back to signup metadata for new users.
  useEffect(() => {
    if (loading) return;

    if (profile) {
      setFullName(profile.full_name);
      setTrade(profile.trade);
      setWorkplaceName(profile.workplace_name);
      setWorkplaceLocation(profile.workplace_location ?? '');
      setBio(profile.bio);
    } else {
      const meta = session?.user.user_metadata;
      setFullName(meta?.full_name ?? '');
      setTrade(meta?.trade ?? '');
    }
  }, [loading, profile, session]);

  const getInitials = () => {
    const parts = fullName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isComplete = !!(
    profile?.full_name &&
    profile?.trade &&
    profile?.workplace_name &&
    profile?.bio
  );

  const handleSave = async () => {
    setValidationError('');
    setSuccessMessage('');

    if (!fullName.trim()) { setValidationError('Full name is required.'); return; }
    if (!trade.trim()) { setValidationError('Trade / role is required.'); return; }
    if (!workplaceName.trim()) { setValidationError('Workplace name is required.'); return; }
    if (!bio.trim()) { setValidationError('Bio is required.'); return; }

    try {
      await updateProfile({
        full_name: fullName.trim(),
        trade: trade.trim(),
        workplace_name: workplaceName.trim(),
        workplace_location: workplaceLocation.trim() || null,
        bio: bio.trim(),
      });
      setSuccessMessage('Profile saved!');
      setTimeout(() => router.back(), 1000);
    } catch {
      // saveError from hook is shown below
    }
  };

  const handleShare = async () => {
    if (!session) return;
    await Share.share({
      message: `Check out my Shiftly profile!\n\nProfile ID: ${session.user.id}`,
      title: 'Share My Shiftly Profile',
    });
  };

  const displayError = validationError || saveError || '';

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
            <Text style={styles.heading}>Your Profile</Text>
            <Text style={styles.subtitle}>This is what your regulars will see.</Text>
          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{getInitials()}</Text>
            </View>
            <Text style={styles.avatarHint}>Photo upload coming soon</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>
                Full Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Maria Garcia"
                placeholderTextColor="#6B7280"
                autoCapitalize="words"
                autoCorrect={false}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Trade / Role <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Bartender, Server, Chef"
                placeholderTextColor="#6B7280"
                autoCapitalize="words"
                value={trade}
                onChangeText={setTrade}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Workplace Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. The Gold Bar"
                placeholderTextColor="#6B7280"
                autoCapitalize="words"
                value={workplaceName}
                onChangeText={setWorkplaceName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Workplace Location{' '}
                <Text style={styles.optional}>(optional)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Downtown Chicago"
                placeholderTextColor="#6B7280"
                autoCapitalize="words"
                value={workplaceLocation}
                onChangeText={setWorkplaceLocation}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>
                Bio <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Tell your regulars a bit about yourself..."
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={bio}
                onChangeText={setBio}
              />
            </View>
          </View>

          {displayError ? (
            <Text style={styles.errorText}>{displayError}</Text>
          ) : null}
          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.primaryButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#111827" />
            ) : (
              <Text style={styles.primaryButtonText}>Save Profile</Text>
            )}
          </TouchableOpacity>

          {isComplete && (
            <TouchableOpacity
              style={styles.shareButton}
              activeOpacity={0.85}
              onPress={handleShare}
            >
              <Text style={styles.shareButtonText}>Share My Profile</Text>
            </TouchableOpacity>
          )}
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
    paddingHorizontal: 32,
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
    marginBottom: 32,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F9FAFB',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 36,
    gap: 10,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  avatarHint: {
    fontSize: 12,
    color: '#4B5563',
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  required: {
    color: '#F87171',
  },
  optional: {
    color: '#6B7280',
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#F9FAFB',
  },
  bioInput: {
    minHeight: 120,
    paddingTop: 16,
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
  primaryButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  shareButton: {
    marginTop: 12,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
});
