import { kvStorage } from './keyValueStorage';

const KEY = 'pending_return_to';

// Only /pro/<uuid> paths are accepted as valid return destinations.
const VALID_PATTERN = /^\/pro\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidReturnTo(value: string | undefined | null): value is string {
  if (!value) return false;
  return VALID_PATTERN.test(value);
}

export async function setPendingReturnTo(value: string): Promise<void> {
  await kvStorage.setItem(KEY, value);
}

export async function getPendingReturnTo(): Promise<string | null> {
  return kvStorage.getItem(KEY);
}

export async function clearPendingReturnTo(): Promise<void> {
  await kvStorage.removeItem(KEY);
}
