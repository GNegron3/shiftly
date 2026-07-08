import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/auth';

export default function ProLayout() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/welcome');
    }
  }, [session, loading]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
