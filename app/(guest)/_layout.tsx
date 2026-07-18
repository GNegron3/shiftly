import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { useRecoveryPending } from '../../hooks/useRecoveryPending';
import { devLog } from '../../lib/devLog';
import { Colors } from '../../constants/theme';

export default function GuestLayout() {
  const { session, loading } = useAuth();
  const recoveryPending = useRecoveryPending();

  useEffect(() => {
    if (loading) return;

    if (recoveryPending) {
      devLog('guest-layout', { pathname: '/(guest)', recoveryIntent: true, branch: 'recovery-pause', destination: '/reset-password' });
      router.replace('/reset-password');
      return;
    }

    if (!session) {
      devLog('guest-layout', { pathname: '/(guest)', recoveryIntent: false, branch: 'no-session', destination: '/welcome' });
      router.replace('/welcome');
    }
  }, [session, loading, recoveryPending]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSubtle,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Feed' }} />
    </Tabs>
  );
}
