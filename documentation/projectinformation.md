# Music4You — Full Project Information

> This document is intended as a thorough technical briefing for AI-assisted resume writing. It covers architecture decisions, feature implementations, engineering patterns, and design rationale in detail so that resume bullets can be generated with accuracy and specificity.

---

## Project Summary

**Music4You** is a full-stack social music web application modelled after Letterboxd. Users rate albums on a 1–10 scale, build a public profile that displays their recent ratings, and engage with a daily editorial pick that rotates every 24 hours. The project was designed from the ground up with a clean architecture that separates the music data provider (e.g. Spotify) from the database layer via interfaces, meaning real API integrations can be wired in without touching any UI code.

**Personal motivation:** music has been the primary way the developer has formed close friendships. The goal is to build a social space where shared taste becomes a starting point for meaningful connection.

---

## Tech Stack (with specifics)

| Technology | Version / Detail |
|---|---|
| Next.js | 15, App Router, Server Components |
| React | 19, Server + Client Components, Suspense |
| TypeScript | Strict, used throughout all layers |
| MUI (Material UI) | v7, dark theme, `sx` prop styling |
| Tailwind CSS | v4, global base styles |
| Supabase | Auth (email/password), Postgres, RLS, `@supabase/ssr` |
| react-hot-toast | Toast notifications for mutation feedback |
| DiceBear | Deterministic avatar generation via public API |

---

## Architecture Overview

### 1. Interface-driven data layer

Two TypeScript interfaces decouple the app from any specific vendor:

```ts
MusicProvider  — searchAlbums(), getAlbum(), getFeaturedAlbums()
AlbumDatabase  — findAlbumByProviderId(), upsertAlbumFromProvider(),
                 getFeaturedAlbums(), setFeaturedAlbums(),
                 getDailyAlbum(), createDailyAlbum(), getDailyAlbumHistory(),
                 getDailyAlbumCandidates()
```

`MusicService` is injected with both interfaces at construction time. Swapping the mock provider for Spotify, or replacing Supabase with another database, requires only a new adapter class — zero UI changes.

### 2. Unified domain type

A single `AlbumData` type flows through every layer — provider response, service logic, database persistence, and UI rendering. This prevents impedance mismatch between layers and removes the need for transformation logic scattered across components.

### 3. Cache-first data flow

```
Page (Server Component)
  └── MusicService.getAlbum(id)
        1. db.findAlbumByProviderId()       — check Supabase first
        2. provider.getAlbum(id)            — fallback to music API
        3. db.upsertAlbumFromProvider()     — persist for next request
        4. return latest data
```

### 4. Three Supabase client tiers

| Client | Where used | Credentials |
|---|---|---|
| `createSupabaseServer()` | Server Components, Server Actions | Publishable key + user session cookies |
| `createSupabaseClient()` | Browser (client components) | Publishable key |
| `createSupabaseAdmin()` | Server-only lib modules | Service-role key — never exposed to browser |

The admin client is used for privileged operations (profile upsert on signup, featured list management, ratings aggregation). It is guarded by `import "server-only"` at the top of every module that uses it.

### 5. Server Actions over API routes

All mutations (sign up, sign in, sign out, submit rating, update profile) are implemented as Next.js Server Actions. There are no custom API route handlers. This keeps mutation logic co-located with the domain, type-safe end-to-end, and reduces surface area.

---

## Feature Implementations

### Authentication

- **Email/password** via Supabase Auth.
- **Session handling** uses `@supabase/ssr`'s `createServerClient` with a custom cookie adapter that reads/writes Next.js `cookies()`. This makes sessions SSR-aware — the server always has the correct auth state without a client-side round trip.
- **Optimization**: `hasSupabaseSessionCookie()` checks for the presence of a Supabase auth cookie before calling `supabase.auth.getUser()`. This avoids an unnecessary network round trip on every unauthenticated page load.
- **Middleware redirect** (`proxy.ts`): `@supabase/ssr` is used directly in Next.js middleware to check auth state and redirect signed-in users away from `/signin` and `/signup` before the page renders. The middleware also mutates response cookies to keep the session alive.
- **Error normalization**: `"auth session missing"` errors from Supabase are silenced (expected for unauthenticated users), while real auth errors are logged.
- **Sign-up server action** handles: email already registered, duplicate username, and unexpected errors — each with a distinct user-facing message. Error detection uses Supabase error code matching and message substring checks.

### Profile System

- **Auto-creation**: Every signed-in user gets a profile row created automatically on first access via `ensureProfileForUser()`. This is idempotent — safe to call on every request.
- **Username generation**: A candidate username is derived from user metadata (OAuth `username`, email prefix, or user ID prefix). It is then sanitized, trimmed, lowercased, and stripped of invalid characters. If taken, up to 50 numbered variants are tried (`username_2`, `username_3`…). If all fail, a timestamp-entropy suffix is appended as a final fallback.
- **OAuth metadata extraction**: `getUserMetadataValue()` safely reads `username`, `display_name`, `full_name`, `avatar_url`, and `picture` fields from Supabase user metadata. This enables future OAuth provider support (Google, GitHub) without additional user setup.
- **Display name resolution**: `getPreferredProfileName()` returns `displayName` if set, otherwise falls back to `username`. UI uses this consistently so no profile ever shows blank.
- **Avatar fallback chain**: If no avatar URL is stored, `ProfileAvatar` renders a generated initials-based avatar using DiceBear's API (seeded on username for consistency). If the image fails to load, a React error handler falls back to a `Typography` initials component.
- **Recent ratings join**: Profile fetches eagerly load the 4 most recent album ratings via a Supabase relational join (`reviews!reviews_album_id_fkey(…)`) ordered by `updated_at`. These display on both the public and private profile pages.
- **Profile update**: Username change checks availability (excluding the current user's own ID) before updating. DB-level uniqueness constraint violations are caught as a secondary guard.

### Album Rating System

- **Scale**: 1–10 integer ratings.
- **Upsert pattern**: Ratings use `onConflict: "user_id, album_id"` — resubmitting a rating updates rather than inserts.
- **Lazy album row creation**: The `albums` table only gets a row when the first user rates that album. `ensureAlbumRowIdForRating()` checks for an existing row first, then inserts if missing. If two users rate simultaneously, a unique constraint violation on `(provider, provider_album_id)` is caught and the row is re-fetched.
- **Aggregate computation**: Average rating and total count are computed at read time from all `reviews` rows for the album. `roundToTwoDecimals()` cleans floating-point results for display.
- **Community score + personal rating** are fetched in parallel with `Promise.all` to minimize latency.

### Daily Album Rotation

This is the most algorithmically complex feature.

- **Date key**: The current day is represented as a `"YYYY-MM-DD"` string computed in the `America/Toronto` timezone using `Intl.DateTimeFormat`. This is timezone-safe and consistent across servers.
- **Rank**: The date key is converted to an integer rank (days since Unix epoch) using `Date.UTC`. Rank is stored in `featured_list_items.rank` and serves as a globally consistent daily album identifier.
- **Selection algorithm**:
  1. Check if today's album already exists in DB (`getDailyAlbum`).
  2. If not, fetch all album IDs already used in the daily archive and build a candidate pool by excluding them.
  3. If the candidate pool is empty, fetch fresh albums from the provider, upsert to DB, then rebuild candidates.
  4. Shuffle candidates with Fisher-Yates algorithm (in-place, O(n)).
  5. Iterate through shuffled candidates and attempt to create a daily album for each. Stop at first success.
- **Race condition handling**: Multiple requests may attempt to create today's album simultaneously. The `createDailyAlbum()` method uses a database `INSERT` (not upsert). If the insert fails with a unique constraint violation, the request re-fetches the winning row. Duplicate entries at the same rank are cleaned up by keeping the earliest `created_at` and deleting others.
- **Fallback chain**: If all creation attempts fail, the service falls back to: (1) re-read DB for today, (2) use yesterday's archive entry, (3) construct a synthetic in-memory entry from the first shuffled candidate.
- **Album enrichment**: Once today's album is resolved, `getAlbum()` is called to ensure full track data (songs) is populated from the provider and persisted.

### Featured Lists Abstraction

The same `featured_lists` + `featured_list_items` table pair handles both the discovery feed and the daily rotation:

| List slug | Rank meaning | Usage |
|---|---|---|
| `"feed"` | Sequential position (1, 2, 3…) | Discovery album grid |
| `"daily-album"` | Days since epoch | One album per calendar day |

`createOrGetFeaturedListQuery` is idempotent — safe to call on every write without creating duplicates.

### Streaming Nav with Suspense

The navigation bar never blocks page rendering. Architecture:

1. `Nav.tsx` is a Server Component that renders the shell (logo, links) synchronously.
2. The auth-dependent account slot is wrapped in `<Suspense fallback={<skeleton />}>`.
3. `NavAccountSlot` is an async Server Component that resolves `getCurrentAccountNavUser()` separately.
4. The page renders and streams immediately; the account button fills in when auth resolves.

### Discovery Feed

- `getDiscoveryAlbums()` wraps `MusicService.getFeedAlbums()` with Next.js `unstable_cache` for request-level memoization.
- Feed albums are pre-populated in the `featured_lists` table. If fewer than the required amount are in the DB, `refreshFeedAlbums()` fetches from the provider and re-persists.
- `AlbumGrid` renders a responsive CSS grid of `AlbumCard` components, each linking to `/album/[id]`.

### Album Detail Page

- Dynamic route `/album/[id]` fetches full album data (title, artist, release date, tracks, cover) from the service.
- Current user's rating and community aggregate are fetched in parallel with `Promise.all`.
- If the album fetch fails, the page falls back to mock data (graceful degradation for development).
- `AlbumRatingSection` handles the rating form with client-side validation (1–10 range check), optimistic form state, and toast feedback on success or error.

---

## Database Design

### Tables

| Table | Key columns | Notes |
|---|---|---|
| `profiles` | `id` (FK to auth.users), `username` (unique), `display_name`, `avatar_url`, `bio`, `created_at` | One row per user |
| `albums` | `id`, `provider`, `provider_album_id`, `title`, `artist`, `album_cover`, `release_date`, `raw_payload` | `(provider, provider_album_id)` unique — supports multiple music APIs |
| `reviews` | `user_id`, `album_id`, `rating`, `body`, `updated_at` | `(user_id, album_id)` unique constraint enables upsert |
| `featured_lists` | `id`, `slug` (unique), `title` | Identifies "feed" vs "daily-album" |
| `featured_list_items` | `list_id`, `album_id`, `rank`, `created_at` | `(list_id, album_id)` unique; `rank` is dual-purpose |

### Key design decisions

- **`raw_payload` JSON column**: Album song data is stored as a JSON blob inside `raw_payload`. This allows flexible schema evolution (adding song fields, storing provider-specific metadata) without migrations per provider. Songs are extracted and normalized at read time by `extractSongsFromRawPayload()`.
- **Provider-keyed albums**: Albums are identified by `(provider, provider_album_id)` rather than a single UUID. This supports multiple music data providers coexisting without ID collisions.
- **Upsert-first writes**: Every write path uses `upsert` with an explicit `onConflict` clause. This makes write operations idempotent and safe under concurrent access.
- **Migration-first workflow**: Schema changes live in `supabase/migrations` versioned SQL files. The repo — not the dashboard — is the source of truth. `supabase db reset` replays full history from scratch.

---

## Code Quality & Engineering Practices

### Module structure

```
lib/
  db/errors.ts          — shared isUniqueViolationError(), formatSupabaseError()
  music/mappers.ts       — all DB row ↔ domain type transformations in one place
  music/MusicService.ts  — pure orchestration logic, no DB or provider details
  music/Supabase.ts      — AlbumDatabase implementation, imports mappers
  profiles/server.ts     — all profile logic, server-only
  profiles/format.ts     — formatting utilities (extracted from components)
  reviews/server.ts      — rating logic, server-only
```

### Duplication eliminated during refactor

| Before | After |
|---|---|
| `isUniqueViolationError` duplicated in `Supabase.ts` and `reviews/server.ts` | Single source in `lib/db/errors.ts` |
| `formatMs()` local to `SongView.tsx` | Imports `formatTrackDuration()` from `lib/music/dailyAlbum` |
| `formatJoinedDate()` inline in `ProfilePageView.tsx` | Extracted to `lib/profiles/format.ts` |
| 7 mapper functions inside 600-line `Supabase.ts` | Extracted to `lib/music/mappers.ts` |
| 530-line `DailyAlbumPageView.tsx` | Split into 4 focused sub-components in `components/daily/` |

### Server/client discipline

- All data fetching happens in Server Components or server-only lib modules.
- `"use client"` is applied only where browser APIs or React state are genuinely needed (`ProfilePageView`, `AlbumRatingSection`, `SignInForm`, `SignUpForm`, etc.).
- `import "server-only"` guards all modules that access the admin Supabase client.
- `providers.tsx` (a required `"use client"` boundary for MUI/toast) renders only children — no data fetching, no auth logic.

### TypeScript patterns

- Domain types (`AlbumData`, `Profile`, `DailyAlbumEntry`, etc.) are defined in `types.ts` files, not inlined in components.
- Database row types (`AlbumDataInDatabase`, `ProfileRow`, etc.) are separate from domain types, with explicit mappers between them.
- `filter((x): x is T => Boolean(x))` type guard pattern used throughout to safely narrow nullable arrays.
- Discriminated return types on mutations (e.g. `{ profile, previousUsername, errorMessage }`) rather than throwing exceptions.

---

## Frontend / UI Patterns

- **Dark theme**: MUI `createTheme({ palette: { mode: "dark" } })` applied globally via `ThemeProvider` in `providers.tsx`.
- **Glassmorphism cards**: `backdropFilter: "blur(14px)"`, `bgcolor: "rgba(255,255,255,0.04)"`, subtle border overlays.
- **Gradient backgrounds**: Radial gradients layered with `linear-gradient` using MUI `sx` prop. Gradient text via `WebkitBackgroundClip: "text"` + `WebkitTextFillColor: "transparent"`.
- **Grid overlay**: Full-page grid texture via `backgroundImage` with `linear-gradient` lines, masked with `maskImage` to fade out toward bottom.
- **Next.js Image**: All album covers use `<Image fill>` with `sizes` prop tuned per context for optimal responsive image delivery.
- **Responsive layouts**: All grids use `gridTemplateColumns` with MUI breakpoint objects (`{ xs: "1fr", lg: "1.25fr 0.9fr" }`).
- **Streaming skeleton**: `NavAccountFallback` renders a pill-shaped placeholder matching the real account button dimensions.
- **Toast feedback**: `react-hot-toast` called from Server Actions return values — not from catch blocks — for predictable UX.

---

## Current Routes

| Route | Type | Auth required |
|---|---|---|
| `/` | Server Component | No |
| `/feed` | Server Component | No |
| `/album/[id]` | Server Component | No (rating requires auth) |
| `/album-of-the-day` | Server Component | No |
| `/profile` | Server Component | Yes → redirect to `/signin` |
| `/u/[username]` | Server Component | No |
| `/settings` | Server Component | Yes → redirect to `/signin` |
| `/signin` | Server Component + Client Form | Redirect to `/feed` if signed in |
| `/signup` | Server Component + Client Form | Redirect to `/feed` if signed in |

---

## What's Not Yet Built (Honest Gaps)

- **Spotify provider**: `Spotify.ts` is a stub. The `MusicProvider` interface is implemented but all methods return empty/null. Real data comes from the mock provider.
- **Nav search**: The search input in `NavClient.tsx` is UI-only. `MusicService.searchAlbums()` exists and is wired to the provider, but no handler connects the input to it.
- **Social graph**: No friends, follows, or activity feed.
- **Album lists**: No user-created lists or year-in-review feature.
- **Daily scoreboard**: The scoreboard panel on the daily page shows placeholder text. Community ratings are stored but not yet surfaced on that page.

---

## Numbers Worth Knowing

| Metric | Value |
|---|---|
| Total source files | ~40 TypeScript/TSX files |
| Largest single file (before refactor) | `DailyAlbumPageView.tsx` — 530 lines |
| Largest single file (after refactor) | `lib/profiles/server.ts` — ~405 lines |
| Server Actions | 5 (signUp, signIn, signOut, updateProfile, submitRating) |
| Database tables | 5 |
| Daily album fallback layers | 5 (DB today → create → archive fallback → in-memory entry) |
| Username generation retry limit | 50 attempts + timestamp entropy fallback |
| Rating scale | Integer 1–10 |
| Recent ratings shown on profile | 4 |
| Daily album history fetch limit | Configurable via `DAILY_ALBUM_HISTORY_LIMIT` constant |
