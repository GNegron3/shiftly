const BASE_URL = (process.env.EXPO_PUBLIC_PROFILE_BASE_URL ?? '').replace(/\/$/, '');

export function getProfileUrl(proId: string): string {
  if (!BASE_URL) return '';
  return `${BASE_URL}/pro/${proId}`;
}
