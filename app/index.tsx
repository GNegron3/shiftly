import { Redirect } from 'expo-router';

// Entry point for the app.
// TODO: Replace isAuthenticated and userRole with a real Supabase session check.
export default function Index() {
  const isAuthenticated = false;
  const userRole: 'pro' | 'guest' | null = null;

  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  if (userRole === 'pro') {
    return <Redirect href="/(pro)" />;
  }

  return <Redirect href="/(guest)" />;
}
