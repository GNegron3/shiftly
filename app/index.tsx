import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../context/auth';
import { useRecoveryPending } from '../hooks/useRecoveryPending';
import { devLog } from '../lib/devLog';
import { Colors } from '../constants/theme';

export default function Index() {
  const { session, loading } = useAuth();
  const recoveryPending = useRecoveryPending();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  // A password-recovery flow in progress must win over every other
  // redirect — otherwise a recovery session (which looks like a normal
  // login) can route straight into the app before the password is changed.
  if (recoveryPending) {
    devLog('index', { pathname: '/', recoveryIntent: true, branch: 'recovery-pause', destination: '/reset-password' });
    return <Redirect href="/reset-password" />;
  }

  if (!session) {
    devLog('index', { pathname: '/', recoveryIntent: false, branch: 'no-session', destination: '/welcome' });
    return <Redirect href="/welcome" />;
  }

  const userRole = session.user.user_metadata?.role as 'pro' | 'guest' | undefined;

  if (userRole === 'pro') {
    devLog('index', { pathname: '/', recoveryIntent: false, branch: 'role-pro', destination: '/(pro)' });
    return <Redirect href="/(pro)" />;
  }

  devLog('index', { pathname: '/', recoveryIntent: false, branch: 'role-guest', destination: '/(guest)' });
  return <Redirect href="/(guest)" />;
}
