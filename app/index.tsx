import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/auth';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator color="#F9FAFB" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  const userRole = session.user.user_metadata?.role as 'pro' | 'guest' | undefined;

  if (userRole === 'pro') {
    return <Redirect href="/(pro)" />;
  }

  return <Redirect href="/(guest)" />;
}
