import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Logo Placeholder */}
        <View style={styles.logoPlaceholder} />

        {/* Heading */}
        <Text style={styles.heading}>Stay Connected</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Helping you stay connected with the service professionals you know and trust.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonGroup}>

          {/* Primary Button */}
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Continue as Guest</Text>
          </TouchableOpacity>

          {/* Secondary Button */}
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
            <Text style={styles.secondaryButtonText}>Continue as Professional</Text>
          </TouchableOpacity>

        </View>
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
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    marginBottom: 12,
  },
  heading: {
    fontSize: 36,
    fontWeight: '700',
    color: '#F9FAFB',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
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
});