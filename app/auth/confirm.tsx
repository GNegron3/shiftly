import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/auth';
import {
  clearPendingReturnTo,
  getPendingReturnTo,
  isValidReturnTo,
} from '../../lib/pendingReturnTo';
import { Colors } from '../../constants/theme';

type Status = 'verifying' | 'success' | 'error';

export default function AuthConfirmScreen() {
  const { session } = useAuth();
  const params = useLocalSearchParams<{
    code?: string;
    token_hash?: string;
    type?: string;
    error?: string;
    error_description?: string;
  }>();

  const [status, setStatus] = useState<Status>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const didRedirect = useRef(false);

  const handleSuccess = useCallback(async () => {
    if (didRedirect.current) return;
    didRedirect.current = true;

    let destination: string = '/';
    try {
      const stored = await getPendingReturnTo();
      await clearPendingReturnTo();
      if (isValidReturnTo(stored)) destination = stored;
    } catch {
      // storage unavailable
    }

    setStatus('success');
    setTimeout(() => router.replace(destination as any), 1200);
  }, []);

  // When detectSessionInUrl processes a code/hash and sets the session, pick it up here.
  useEffect(() => {
    if (session && status === 'verifying') {
      handleSuccess();
    }
  }, [session, status, handleSuccess]);

  // Handle URL params that detectSessionInUrl doesn't process automatically.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (params.error) {
      setErrorMessage(params.error_description ?? params.error);
      setStatus('error');
      return;
    }

    if (params.token_hash && params.type) {
      supabase.auth
        .verifyOtp({ token_hash: params.token_hash, type: params.type as any })
        .then(({ error }) => {
          if (error) {
            setErrorMessage(error.message);
            setStatus('error');
          }
          // On success the session useEffect above fires.
        });
      return;
    }

    // code/hash flows: detectSessionInUrl handles them. Start a timeout as a fallback.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Timeout guard — if nothing resolves in 15s the link is probably expired.
  useEffect(() => {
    if (status !== 'verifying') return;
    const t = setTimeout(() => {
      setErrorMessage(
        'The verification link may have expired or already been used. Please request a new one.',
      );
      setStatus('error');
    }, 15000);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centered}>
        {status === 'verifying' && (
          <>
            <ActivityIndicator color={Colors.primary} size="large" />
            <Text style={styles.message}>Verifying your email…</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.heading}>Email confirmed!</Text>
            <Text style={styles.message}>Signing you in…</Text>
          </>
        )}

        {status === 'error' && (
          <>
            <Text style={styles.errorIcon}>✕</Text>
            <Text style={styles.heading}>Verification failed</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace('/login')}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Go to Log In</Text>
            </TouchableOpacity>
          </>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 16,
  },
  successIcon: {
    fontSize: 56,
    color: Colors.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  errorIcon: {
    fontSize: 48,
    color: Colors.error,
    fontWeight: '700',
    marginBottom: 4,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 14,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
});
