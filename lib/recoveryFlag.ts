import { kvStorage } from './keyValueStorage';

const KEY = 'auth_recovery_pending';

// In-memory flag, readable synchronously. Supabase's own URL auto-detection
// fires PASSWORD_RECOVERY via a `setTimeout(0)` deferred from client
// construction (see GoTrueClient#_initialize) — an async kvStorage read can't
// reliably win that race, but a listener registered synchronously at module
// scope (see lib/supabase.ts) always does, so this is the source of truth.
let pending = false;

type Listener = () => void;
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function isRecoveryPending(): boolean {
  return pending;
}

export function subscribeRecoveryPending(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setRecoveryPending(): void {
  kvStorage.setItem(KEY, '1').catch(() => {});
  if (pending) return;
  pending = true;
  emit();
}

export function clearRecoveryPending(): void {
  kvStorage.removeItem(KEY).catch(() => {});
  if (!pending) return;
  pending = false;
  emit();
}

// Restores the flag on cold start if a recovery flow was interrupted before
// the password was changed (e.g. the app was backgrounded or the page was
// reloaded while sitting on the set-new-password screen).
export async function hydrateRecoveryPending(): Promise<void> {
  const stored = await kvStorage.getItem(KEY);
  if (stored === '1' && !pending) {
    pending = true;
    emit();
  }
}

// Cross-tab sync, web only. Supabase's own BroadcastChannel relays auth
// events (including PASSWORD_RECOVERY) to every open tab, so setRecoveryPending()
// ends up firing tab-locally in tabs that never opened the recovery link —
// but clearRecoveryPending() is plain application code with no such relay,
// so a clear in one tab previously never reached the others, leaving them
// stuck pending forever. The native `storage` event (which fires in every
// *other* tab whenever localStorage changes, never the tab that wrote it)
// closes that gap for both directions without depending on Supabase internals.
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key !== KEY) return;
    const next = event.newValue === '1';
    if (next === pending) return;
    pending = next;
    emit();
  });
}
