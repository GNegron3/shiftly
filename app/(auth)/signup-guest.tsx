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
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { isValidReturnTo, setPendingReturnTo } from '../../lib/pendingReturnTo';
import { getAuthConfirmUrl } from '../../lib/profileUrl';
import { Colors } from '../../constants/theme';

export default function SignUpGuestScreen() {
  const { returnTo } = useLocalSearchParams<{ returnTo?: string }>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);

  const handleSignUp = async () => {
    setError('');

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    const confirmUrl = getAuthConfirmUrl();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: confirmUrl || undefined,
        data: { full_name: fullName.trim(), role: 'guest' },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    if (!data.session) {
      // Persist returnTo so it survives the external email confirmation flow.
      // Wrapped in try/catch so a storage failure does not block the flow.
      if (isValidReturnTo(returnTo)) {
        try {
          await setPendingReturnTo(returnTo);
        } catch {
          // storage unavailable; returnTo will not survive email confirmation
        }
      }
      setAwaitingConfirmation(true);
    } else {
      router.replace((isValidReturnTo(returnTo) ? returnTo : '/') as any);
    }
  };

  const handleGoToLogin = () => {
    if (returnTo) {
      router.replace({ pathname: '/login', params: { returnTo } } as any);
    } else {
      router.replace('/login');
    }
  };

  if (awaitingConfirmation) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.confirmContainer}>
          <Text style={styles.confirmIcon}>✉️</Text>
          <Text style={styles.heading}>Check your email</Text>
          <Text style={styles.confirmSubtitle}>
            We sent a confirmation link to{' '}
            <Text style={styles.emailHighlight}>{email}</Text>.
            {'\n\n'}Open it to activate your account, then log in.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={handleGoToLogin}
          >
            <Text style={styles.primaryButtonText}>Go to Log In</Text>
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
          <View style={styles.inviteBanner}>
            <Text style={styles.inviteText}>
              You were invited by{' '}
              <Text style={styles.inviteName}>a professional</Text>
            </Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.heading}>Create your account</Text>
            <Text style={styles.subtitle}>
              Follow professionals and get their schedule updates
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={Colors.textSubtle}
                autoCapitalize="words"
                autoCorrect={false}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textSubtle}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor={Colors.textSubtle}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Repeat your password"
                placeholderTextColor={Colors.textSubtle}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            activeOpacity={0.85}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={Colors.surface} />
              : <Text style={styles.primaryButtonText}>Create Account</Text>
            }
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleGoToLogin}>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>

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
  container: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 48,
  },
  confirmContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  confirmIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  confirmSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  emailHighlight: {
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  inviteBanner: {
    backgroundColor: Colors.primarySubtle,
    borderWidth: 1,
    borderColor: Colors.cardSuccessBorder,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  inviteText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  inviteName: {
    color: Colors.primary,
    fontWeight: '600',
  },
  header: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
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
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
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
    color: Colors.surface,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    flexWrap: 'wrap',
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});
