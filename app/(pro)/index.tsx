import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../../context/auth';

export default function ProDashboard() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut();
    // onAuthStateChange fires, session becomes null, app/index.tsx redirects to /welcome.
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>PRO DASHBOARD</Text>
        <Text style={styles.heading}>Coming soon</Text>
        <Text style={styles.subtitle}>
          This is where professionals will manage their schedule and regulars.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#9CA3AF" />
            : <Text style={styles.buttonText}>Log Out</Text>
          }
        </TouchableOpacity>
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
    gap: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.5,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 15,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 24,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
