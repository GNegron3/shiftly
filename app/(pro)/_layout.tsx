import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { useRecoveryPending } from '../../hooks/useRecoveryPending';
import { devLog } from '../../lib/devLog';

export default function ProLayout() {
  const { session, loading } = useAuth();
  const recoveryPending = useRecoveryPending();

  useEffect(() => {
    if (loading) return;

    if (recoveryPending) {
      devLog('pro-layout', { pathname: '/(pro)', recoveryIntent: true, branch: 'recovery-pause', destination: '/reset-password' });
      router.replace('/reset-password');
      return;
    }

    if (!session) {
      devLog('pro-layout', { pathname: '/(pro)', recoveryIntent: false, branch: 'no-session', destination: '/welcome' });
      router.replace('/welcome');
    }
  }, [session, loading, recoveryPending]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
