import { useSyncExternalStore } from 'react';
import { isRecoveryPending, subscribeRecoveryPending } from '../lib/recoveryFlag';

export function useRecoveryPending(): boolean {
  return useSyncExternalStore(subscribeRecoveryPending, isRecoveryPending, isRecoveryPending);
}
