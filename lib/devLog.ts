// Dev-only tracing for the auth-redirect flow. Never pass tokens, passwords,
// or full recovery URLs here — pathname/event/branch names only.
export function devLog(scope: string, data: Record<string, unknown>): void {
  if (!__DEV__) return;
  console.log(`[auth:${scope}]`, data);
}
