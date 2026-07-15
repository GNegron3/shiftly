# Domain & Hosting

## Production domain

**enpourapp.com** — purchased and connected to Cloudflare (Cloudflare is the authoritative DNS provider). This is the canonical domain for:

- Shareable profile URLs and QR codes (`EXPO_PUBLIC_PROFILE_BASE_URL`)
- Supabase Auth email redirect (`/auth/confirm`)
- The eventual target for iOS Universal Links and Android App Links

## EAS Hosting custom domain setup (Cloudflare DNS records)

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
5. Click refresh until all checks pass (usually a couple of minutes).

Notes:
- Both apex and subdomains are supported. We're using the apex (`enpourapp.com`), not `www`. Expo's hosting layer 308-redirects `www.enpourapp.com` → `enpourapp.com` automatically unless a `www` alias is explicitly configured (`CNAME www.enpourapp.com → origin.expo.app`).
- Expo's docs don't state a Cloudflare proxy (orange-cloud) recommendation. Start with **DNS only** (grey cloud) for all three records until the dashboard shows the domain fully verified, then optionally enable Cloudflare's proxy afterward.
- Do not guess or reuse the verification token / ACME target from another project or domain — they are unique per hostname and issued only through the dashboard flow above.

## Supabase Auth redirect configuration

Not stored in this repo (no `supabase/config.toml`) — set directly in the **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL:** `https://enpourapp.com`
- **Redirect URLs:** add `https://enpourapp.com/auth/confirm`

This must be done manually in the dashboard; verify the values match what `lib/profileUrl.ts` (`getAuthConfirmUrl`) generates.

## Universal Links / Android App Links — still blocked (independent of DNS)

The domain being live does **not** unblock this. It's still waiting on decisions/artifacts that don't exist yet in this project and shouldn't be guessed:

1. **iOS bundle identifier** and **Android package name** (e.g. `com.enpour.app`) — permanent once published; not yet chosen. Needed before `ios.associatedDomains` / `android.package` can be set in `app.json`.
2. **Apple Team ID** — required inside `apple-app-site-association`; comes from the Apple Developer account.
3. **Android signing credentials** — the SHA-256 cert fingerprint for `assetlinks.json` comes from `eas credentials -p android`, which requires a native Android build/credentials to exist first.

Once those exist:
- `app.json`: add `ios.associatedDomains: ["applinks:enpourapp.com"]` and an `android.intentFilters` entry with `autoVerify: true` for `host: "enpourapp.com"`.
- Host `https://enpourapp.com/.well-known/apple-app-site-association` and `https://enpourapp.com/.well-known/assetlinks.json` as static files in the Expo Router `public/.well-known/` directory (served by the same EAS Hosting deployment), each following the exact schema documented at <https://docs.expo.dev/linking/ios-universal-links/> and <https://docs.expo.dev/linking/android-app-links/>.

## Naming note

`app.json`'s `slug` (`"TapInDev"`) and the EAS project it's linked to (`extra.eas.projectId`) were **not** renamed as part of this migration — `eas-cli` validates that the local slug matches the slug the remote project is registered under, and changing one without the other breaks every `eas` command. Renaming the underlying Expo project (and by extension its default `*.expo.app` hosting URL) is a separate decision to make via the Expo dashboard, not required for `enpourapp.com` to work as the custom domain.
