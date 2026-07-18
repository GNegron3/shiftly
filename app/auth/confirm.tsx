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
import { isRecoveryPending } from '../../lib/recoveryFlag';
import { devLog } from '../../lib/devLog';
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
  const [isRecovery, setIsRecovery] = useState(false);
  const didRedirect = useRef(false);

  const handleSuccess = useCallback(async (forceRecovery = false) => {
    if (didRedirect.current) return;
    didRedirect.current = true;

    // Password-recovery links must land on the set-new-password screen,
    // never on the normal post-login destination. Recovery intent is
    // detected three ways, since Supabase can deliver a recovery link in
    // either URL shape: the token_hash/type query params (read here) for
    // the OTP-exchange format, or the dedicated PASSWORD_RECOVERY auth
    // event for the hash-fragment implicit format (which never appears in
    // the query string) — caught either by the effect below, or, more
    // reliably, by the module-scope listener in lib/supabase.ts that wins
    // the race against Supabase's own deferred auto-detection (see
    // lib/recoveryFlag.ts for why the effect below alone isn't enough).
    const recoveryIntent = forceRecovery || params.type === 'recovery' || isRecoveryPending();

    if (recoveryIntent) {
      devLog('confirm', {
        pathname: '/auth/confirm',
        recoveryIntent: true,
        branch: 'recovery',
        destination: '/reset-password',
      });
      setIsRecovery(true);
      setStatus('success');
      setTimeout(() => router.replace('/reset-password' as any), 1200);
      return;
    }

    let destination: string = '/';
    try {
      const stored = await getPendingReturnTo();
      await clearPendingReturnTo();
      if (isValidReturnTo(stored)) destination = stored;
    } catch {
      // storage unavailable
    }

    devLog('confirm', {
      pathname: '/auth/confirm',
      recoveryIntent: false,
      branch: 'normal-login',
      destination,
    });
    setStatus('success');
    setTimeout(() => router.replace(destination as any), 1200);
  }, [params.type]);

  // Format-agnostic recovery signal — fires whenever Supabase establishes a
  // recovery session, regardless of which URL shape delivered it. This is
  // what makes the hash-fragment implicit flow (invisible to query params)
  // still land on the set-new-password screen instead of normal routing.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        handleSuccess(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [handleSuccess]);

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
            <Text style={styles.heading}>
              {isRecovery ? 'Verified!' : 'Email confirmed!'}
            </Text>
            <Text style={styles.message}>
              {isRecovery ? 'Taking you to set a new password…' : 'Signing you in…'}
            </Text>
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
