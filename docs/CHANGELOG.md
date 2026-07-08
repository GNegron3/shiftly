# Changelog

All notable changes to Shiftly will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Shiftly uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- **Schedule service** — `services/scheduleService.ts`; responsibilities: `getSchedule`, `saveSchedule`; all Supabase access for the schedule feature centralized here; `DayInput` type exported for use by the hook
- **`useSchedule` hook** — `hooks/useSchedule.ts`; encapsulates schedule fetch, form state (`DayInput[]`), day/note mutation, validation (custom shifts require a note), save, and loading/saving/error states

### Changed

- **Schedule screen** — `app/(pro)/schedule.tsx` refactored from inline Supabase calls to `useSchedule` hook; duplicate local type definitions removed; fetch error now surfaces a dedicated error screen with back navigation
- **`profileService.ts`** — `getProSchedule` removed; schedule access is now owned by `scheduleService.ts`
- **Public profile screen** — `app/pro/[id].tsx` updated to import `getSchedule` from `scheduleService` instead of `profileService`

---

## [0.1.0] — 2026-07-08 (MVP in development)

### Added

- **Project scaffolding** — Expo managed workflow initialized from starter template; Expo boilerplate (tabs, demo screens, demo components) removed; welcome screen retained as entry point (`f68cfee`)
- **Navigation architecture** — Three-group file-based routing via Expo Router: `(auth)`, `(pro)`, `(guest)`; root `app/index.tsx` routes users by session and role (`b7fdda9`)
- **Auth screens** — Welcome, Login, Professional Signup (with trade field), Guest Signup (invite-only placeholder), and Forgot Password screens; all with form validation, loading states, and error states (`b7fdda9`)
- **Supabase client** — `lib/supabase.ts` initialized with `expo-secure-store`-backed auth; live session check replaces hardcoded auth in the router (`2e20847`)
- **Authentication flow** — `AuthProvider` context (`context/auth.tsx`) manages session globally; professional signup, login, logout, and password reset all wired to Supabase Auth; role stored in user metadata; email confirmation state handled (`8064b89`)
- **Pro dashboard** — Role-based welcome, profile completion status card, and schedule status card; refreshes on screen focus via `useFocusEffect` (`cf5c4a9`)
- **Profile edit screen** — `app/(pro)/profile.tsx`; fields: full name, trade, workplace name, workplace location (optional), bio; upserts to Supabase `profiles` table; pre-fills from signup metadata on first visit; avatar placeholder shows initials (`cf5c4a9`)
- **Weekly schedule management** — `app/(pro)/schedule.tsx`; seven-day schedule with shift types: Off, Lunch, Dinner, Double, Custom (with note); upserts to Supabase `schedules` table with `(pro_id, day_of_week)` uniqueness constraint; schedule summary displayed on dashboard (`0c10563`)
- **Shared TypeScript interfaces** — `types/Profile.ts` (`ProfessionalProfile`, `UpdateProfilePayload`) and `types/Schedule.ts` (`ShiftType`, `DaySchedule`) (`cd3b112`)
- **Profile service** — `services/profileService.ts`; responsibilities: `getProfile`, `updateProfile`; all Supabase access for the profile feature is centralized here (`cd3b112`)
- **`useProfile` hook** — `hooks/useProfile.ts`; encapsulates fetch and save logic with `loading`, `error`, `saving`, and `saveError` states (`cd3b112`)
- **Public profile screen** — `app/pro/[id].tsx`; displays professional name, trade, workplace, bio, and weekly schedule; accessible without authentication; handles profile-not-found state; follow button present as disabled placeholder (`cd3b112`)
- **Share Profile button** — Appears on the profile edit screen once the profile is complete; opens the native share sheet via React Native `Share` API (`cd3b112`)
- **Share Profile dashboard card** — Appears on the pro dashboard when both profile and schedule are complete (`cd3b112`)
- **`/docs` directory** — Repository-level documentation structure established: `company/`, `engineering/`, `architecture/`, `adr/`, `assets/` (`e41e069`)

### Changed

- **Pro layout** — Switched from tab navigation to stack navigation to support single-screen flow (`cf5c4a9`)
- **Profile screen** — Refactored from inline Supabase calls to `useProfile` hook; business logic moved out of the component (`cd3b112`)

### Fixed

- **Auth context** — Removed debug `console.log` left in `context/auth.tsx` (`cf5c4a9`)
- **Unescaped entity** — Fixed pre-existing `react/no-unescaped-entities` lint violation in `app/(pro)/index.tsx` (`cd3b112`)
- **`useEffect` dependency** — Added missing `session` dependency to profile pre-fill effect in `app/(pro)/profile.tsx` (`cd3b112`)

### Documentation

- Company Manual migrated to `docs/company/Company_Manual.md` (`e41e069`)
- Engineering Manual migrated to `docs/engineering/Engineering_Manual.md` (`e41e069`)
- `docs/README.md` added describing directory structure and source-of-truth policy (`e41e069`)

### Infrastructure

- **Supabase schema verified** — `profiles` and `schedules` tables confirmed to exist with correct columns; RLS confirmed enabled on both tables with public SELECT and owner-only INSERT/UPDATE policies; no migrations required (`cd3b112`)
- **`.env` excluded from version control** — `.gitignore` updated to protect Supabase credentials (`2e20847`)

---

[Unreleased]: https://github.com/GNegron3/shiftly/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/GNegron3/shiftly/commits/main
