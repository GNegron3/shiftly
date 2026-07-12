import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function WelcomeScreen() {
  const [devProfileId, setDevProfileId] = useState('');

  const handleDevOpen = () => {
    const id = devProfileId.trim();
    if (!id) return;
    router.push(`/pro/${id}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Logo Placeholder */}
        <View style={styles.logoPlaceholder} />

        {/* App Name */}
        <Text style={styles.heading}>Shiftly</Text>

        {/* Tagline */}
        <Text style={styles.subtitle}>
          Stay connected with your regulars.{'\n'}Share your schedule, build your following.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => router.push('/signup-pro')}
          >
            <Text style={styles.primaryButtonText}>Create Professional Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.85}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryButton}
            activeOpacity={0.85}
            onPress={() => router.push('/signup-guest')}
          >
            <Text style={styles.tertiaryButtonText}>Join as a Guest</Text>
          </TouchableOpacity>
        </View>

        {/* Dev-only: open a public profile by UUID without a share link */}
        {__DEV__ && (
          <View style={styles.devPanel}>
            <Text style={styles.devLabel}>DEV — Open Profile by ID</Text>
            <View style={styles.devRow}>
              <TextInput
                style={styles.devInput}
                placeholder="Paste professional UUID"
                placeholderTextColor="#4B5563"
                autoCapitalize="none"
                autoCorrect={false}
                value={devProfileId}
                onChangeText={setDevProfileId}
              />
              <TouchableOpacity
                style={styles.devButton}
                onPress={handleDevOpen}
                activeOpacity={0.75}
              >
                <Text style={styles.devButtonText}>Open</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111827',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 20,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 8,
  },
  heading: {
    fontSize: 40,
    fontWeight: '700',
    color: '#F9FAFB',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
  },
  tertiaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  tertiaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  devPanel: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    paddingTop: 16,
    gap: 8,
  },
  devLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  devRow: {
    flexDirection: 'row',
    gap: 8,
  },
  devInput: {
    flex: 1,
    backgroundColor: '#0D1117',
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#6B7280',
  },
  devButton: {
    backgroundColor: '#1F2937',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  devButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
});
