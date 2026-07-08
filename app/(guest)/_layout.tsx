import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth';

export default function GuestLayout() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/welcome');
    }
  }, [session, loading]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#111827', borderTopColor: '#1F2937' },
        tabBarActiveTintColor: '#F9FAFB',
        tabBarInactiveTintColor: '#6B7280',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Feed' }} />
    </Tabs>
  );
}
