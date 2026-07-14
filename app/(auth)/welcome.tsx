import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Colors } from '../../constants/theme';

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
                placeholderTextColor={Colors.textSubtle}
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
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  heading: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: 12,
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  tertiaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  tertiaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  devPanel: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    gap: 8,
  },
  devLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSubtle,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  devRow: {
    flexDirection: 'row',
    gap: 8,
  },
  devInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.textMuted,
  },
  devButton: {
    backgroundColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  devButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
