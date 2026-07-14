import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { Colors } from '../../constants/theme';

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
        tabBarStyle: { backgroundColor: Colors.surface, borderTopColor: Colors.border },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSubtle,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Feed' }} />
    </Tabs>
  );
}
