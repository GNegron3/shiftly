import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { kvStorage } from './keyValueStorage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// True only during `expo export --platform web` (Node, no window).
// Supabase Realtime would otherwise fall back to globalThis.WebSocket,
// triggering Node 20's ExperimentalWarning. A truthy transport class
// prevents that fallback; the class is never instantiated during export.
const isStaticRender = Platform.OS === 'web' && typeof window === 'undefined';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: kvStorage,
    autoRefreshToken: !isStaticRender,
    persistSession: !isStaticRender,
    detectSessionInUrl: false,
  },
  ...(isStaticRender && {
    realtime: {
      transport: class NoOpWebSocket {} as unknown as typeof WebSocket,
    },
  }),
});
