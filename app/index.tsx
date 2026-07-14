import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/auth';
import { Colors } from '../constants/theme';

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} />
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
