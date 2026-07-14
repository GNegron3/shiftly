const BASE_URL = (process.env.EXPO_PUBLIC_PROFILE_BASE_URL ?? '').replace(/\/$/, '');

export function getProfileUrl(proId: string): string {
  if (!BASE_URL) return '';
  return `${BASE_URL}/pro/${proId}`;
}

export function getProfileShareContent(
  proId: string,
): { message: string; url: string } | null {
  const url = getProfileUrl(proId);
  if (!url) return null;
  return {
    message: `Check out my Shiftly profile:\n\n${url}`,
    url,
  };
}
