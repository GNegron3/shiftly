# Domain & Hosting

## Production alias (current)

**`https://tapindev.expo.app`** — EAS Hosting's own default alias for this project, promoted via `eas deploy --prod`. This is the canonical domain for:

- Shareable profile URLs and QR codes (`EXPO_PUBLIC_PROFILE_BASE_URL`)
- Supabase Auth email redirect (`/auth/confirm`)

Set via:
- `EXPO_PUBLIC_PROFILE_BASE_URL=https://tapindev.expo.app` in `.env` (local dev/export) and in the EAS `production` environment variable (`eas env:update production --variable-name EXPO_PUBLIC_PROFILE_BASE_URL --value https://tapindev.expo.app`) — both must be kept in sync, since `eas deploy` uploads a pre-built `dist/`, it doesn't build; the value only gets baked in at `expo export` time from whatever's in the local environment.
- Supabase Dashboard → Authentication → URL Configuration → Redirect URLs includes `https://tapindev.expo.app/auth/confirm`, alongside `http://localhost:8081/auth/confirm` (local dev) and `https://enpourapp.com/auth/confirm` (kept for when the custom domain resumes — see below).

## Custom domain (`enpourapp.com`) — on hold

`enpourapp.com` was purchased and connected to Cloudflare, and briefly was the production alias (see CHANGELOG `[Unreleased]`, dated entry, for that switch and today's reversion). It's currently **paused, not decommissioned** — the domain and Cloudflare zone still exist, but `EXPO_PUBLIC_PROFILE_BASE_URL` and the Supabase Site URL point at `tapindev.expo.app` instead while the underlying hosting issue below is resolved.

### Diagnosed issue (as of this writing)

`https://enpourapp.com` returns a **Cloudflare 522 "Connection timed out"** for every path — not specific to any route. This happens because Cloudflare's proxy (orange cloud) is active on the DNS records, but the connection from Cloudflare's edge to the EAS Hosting origin never completes. This contradicts Expo's own guidance (see below) to leave these records **DNS only** (grey cloud) until the custom domain shows fully verified in the Expo dashboard.

Confirmed *not* the cause: the app code, the `/pro/[id]` dynamic route, the static export, or Supabase RLS — all verified working correctly via the `tapindev.expo.app` alias with real profile data, both logged-in and logged-out.

### Resuming the custom domain later

This project's web output (`"web": { "output": "static" }` in `app.json`, deployed via `eas deploy`) is served by EAS Hosting. Attaching `enpourapp.com` to it follows Expo's documented process: <https://docs.expo.dev/eas/hosting/custom-domain/>

**Prerequisite:** a production EAS Hosting deployment must exist (`eas deploy --prod`), and a **Premium EAS plan** is required — custom domains are not available on the Free tier. Verify the account plan before starting.

Add these DNS records to Cloudflare **in this order**, confirming each passes (via the refresh button in the Expo dashboard's Hosting → Custom domain screen) before adding the next:

| # | Type | Host | Value | Source |
|---|------|------|-------|--------|
| 1 | TXT | `_cf-custom-hostname.enpourapp.com` | *shown in the Expo dashboard* | Per-project verification token — generated only after you enter `enpourapp.com` in the project's Hosting settings. Not predictable in advance. |
| 2 | CNAME | `_acme-challenge.enpourapp.com` | *shown in the Expo dashboard* | Per-project ACME/SSL validation target — same dashboard screen as above. |
| 3 | A | `enpourapp.com` (apex) | `172.66.0.241` | Fixed, documented EAS Hosting anycast IP for apex domains. |

Steps:
1. Run `eas deploy --prod` (creates/updates the production hosting deployment).
2. In the [Expo dashboard](https://expo.dev/) → project → **Hosting** → **Custom domain**, enter `enpourapp.com`. This reveals the exact values for records #1 and #2.
3. Add records #1 and #2 to Cloudflare, confirm each passes in the dashboard.
4. Add record #3 (the fixed apex A record).
5. **Set all three records to DNS only (grey cloud) in Cloudflare — do not enable the orange-cloud proxy.** This is the step that was missed (or reverted) last time and produced the 522 above. Click refresh until all checks pass (usually a couple of minutes).
6. Once `https://enpourapp.com` loads correctly and stays stable, only then evaluate whether enabling Cloudflare's proxy is worth it — Expo's docs don't recommend it, and doing so is what broke the domain the first time.
7. Switch `EXPO_PUBLIC_PROFILE_BASE_URL` back to `https://enpourapp.com` (`.env` + `eas env:update production`), re-export, redeploy, and re-verify with at least two real profile IDs before treating it as production again.
8. Update the Supabase Site URL back to `https://enpourapp.com` if desired (Redirect URLs can keep all three entries indefinitely — Supabase doesn't limit the allowlist to one).

Notes:
- Both apex and subdomains are supported. We're using the apex (`enpourapp.com`), not `www`. Expo's hosting layer 308-redirects `www.enpourapp.com` → `enpourapp.com` automatically unless a `www` alias is explicitly configured (`CNAME www.enpourapp.com → origin.expo.app`). Not evaluated this round since the apex itself isn't stable yet.
- Do not guess or reuse the verification token / ACME target from another project or domain — they are unique per hostname and issued only through the dashboard flow above.

## Universal Links / Android App Links — still blocked (independent of domain)

Whichever domain ends up canonical, this isn't unblocked yet. It's still waiting on decisions/artifacts that don't exist yet in this project and shouldn't be guessed:

1. **iOS bundle identifier** and **Android package name** (e.g. `com.enpour.app`) — permanent once published; not yet chosen. Needed before `ios.associatedDomains` / `android.package` can be set in `app.json`.
2. **Apple Team ID** — required inside `apple-app-site-association`; comes from the Apple Developer account.
3. **Android signing credentials** — the SHA-256 cert fingerprint for `assetlinks.json` comes from `eas credentials -p android`, which requires a native Android build/credentials to exist first.

Once those exist:
- `app.json`: add `ios.associatedDomains` and an `android.intentFilters` entry with `autoVerify: true` for whichever domain is canonical at that point.
- Host `https://<domain>/.well-known/apple-app-site-association` and `https://<domain>/.well-known/assetlinks.json` as static files in the Expo Router `public/.well-known/` directory (served by the same EAS Hosting deployment), each following the exact schema documented at <https://docs.expo.dev/linking/ios-universal-links/> and <https://docs.expo.dev/linking/android-app-links/>.

## Naming note

`app.json`'s `slug` (`"TapInDev"`) and the EAS project it's linked to (`extra.eas.projectId`) determine the `tapindev.expo.app` alias — renaming either is a separate decision from the custom-domain work above.
