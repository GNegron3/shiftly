import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { kvStorage } from './keyValueStorage';
import { hydrateRecoveryPending, setRecoveryPending } from './recoveryFlag';
import { devLog } from './devLog';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// True only during `expo export --platform web` (Node, no window).
// Supabase Realtime would otherwise fall back to globalThis.WebSocket,
// triggering Node 20's ExperimentalWarning. A truthy transport class
// prevents that fallback; the class is never instantiated during export.
const isStaticRender = Platform.OS === 'web' && typeof window === 'undefined';
const isBrowser = Platform.OS === 'web' && typeof window !== 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: kvStorage,
    autoRefreshToken: !isStaticRender,
    persistSession: !isStaticRender,
    detectSessionInUrl: isBrowser,
  },
  ...(isStaticRender && {
    realtime: {
      transport: class NoOpWebSocket {} as unknown as typeof WebSocket,
    },
  }),
});

// Registered synchronously, immediately after client construction. When
// detectSessionInUrl auto-detects a recovery link, GoTrueClient's own
// _initialize() defers the PASSWORD_RECOVERY notification via setTimeout(0)
// (from the constructor's fire-and-forget initialize() call). A listener
// subscribed inside a React effect mounts too late to reliably win that race
// and silently misses the event, leaving no signal that the resulting
// session is a recovery session rather than a normal login. Subscribing here
// — in the same synchronous tick as createClient() — always beats that
// setTimeout(0), so this is the one source of truth for recovery intent.
supabase.auth.onAuthStateChange((event) => {
  devLog('supabase-listener', { event, recoveryIntent: event === 'PASSWORD_RECOVERY' });
  if (event === 'PASSWORD_RECOVERY') {
    setRecoveryPending();
  }
});

hydrateRecoveryPending();
