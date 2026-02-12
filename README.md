# Music4You 🎵

A Letterboxd-style music app where users discover albums, open album detail pages, and manage accounts. Built as a full-stack Next.js project with a clean provider/database architecture designed for real API integrations (Spotify) and persistent storage (Supabase).

## Why This Project 🚀

- Shows practical full-stack engineering: App Router, auth, server/client boundaries, and typed domain models.
- Uses interface-driven architecture (`MusicProvider`, `AlbumDatabase`) so data providers can be swapped without rewriting UI.
- Demonstrates product thinking: discovery-first UX, account flow, and roadmap toward ratings/reviews and daily editorial experiences.

## Current Features ✨

- Authentication with Supabase (sign up, sign in, sign out).
- Username validation and duplicate-handling in server actions.
- Route middleware that redirects authenticated users away from auth pages.
- Sticky navigation that renders server-side auth state.
- Discover feed with a responsive album grid.
- Dynamic album detail pages with track listing and duration formatting.
- Global search input in nav (UI currently present, backend integration pending).
- Toast-based user feedback for auth actions.

## Architecture 🏗️

### App Layer 🧭

- `src/app` uses Next.js App Router routes.
- `/` redirects to `/feed`.
- `/feed` renders the discovery page.
- `/album/[id]` renders a dynamic album details page.
- `/signin` and `/signup` handle account access.
- `/album-of-the-day` is scaffolded for the planned daily feature.

### Domain + Data Layer 🧠

- `src/lib/music/types.ts` defines core contracts (`MusicProvider`, `AlbumDatabase`, `AlbumData`).
- `MusicService` (`src/lib/music/MusicService.ts`) uses a cache-first flow: DB read -> provider fallback -> DB upsert.

### Persistence 🗄️

- Supabase adapter in `src/lib/music/Supabase.ts`.
- Query modules in `src/lib/music/supabaseQueries.ts`.
- Expected tables: `albums`, `featured_lists`, `featured_list_items`.

### Auth 🔐

- SSR-aware Supabase clients for browser and server contexts.
- Service-role admin client is server-only.
- Cookie-based session handling with `@supabase/ssr`.

## Tech Stack 🛠️

- Next.js 16 (App Router)
- React 19 + TypeScript
- MUI 7 for UI components/theming
- Supabase Auth + Postgres
- Tailwind CSS v4 (global setup) + MUI styling
- `react-hot-toast` for notifications

## Project Structure 📁

```text
src/
  app/                # Routes and layout (feed, album, auth)
  components/         # Reusable UI (nav, cards, album/track views)
  actions/            # Server actions (auth flows)
  auth/               # Supabase client factories (server/client/admin)
  lib/music/          # Domain contracts, service, providers, DB adapter
    testing/          # Mock provider + seeded album data
```

## Local Setup ⚙️

### 1. Install dependencies 📦

```bash
npm install
```

### 2. Configure environment variables 🔑

Copy `.env.example` to `.env.local` and fill values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3. Run development server ▶️

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts 📜

- `npm run dev` start local dev server
- `npm run build` production build
- `npm run start` run production build
- `npm run lint` lint project

## In Progress / Next Milestones 🛣️

- Wire search input to `MusicService.searchAlbums`.
- Complete Spotify provider implementation.
- Complete `setFeaturedAlbums` persistence flow.
- Implement Album of the Day selection + history.
- Add ratings, reviews, lists, and profile pages (core Letterboxd-style social features).

## Notes 📝

- The UI currently uses seeded/mock album content for discovery and album pages.
- The service and database abstractions are already in place to migrate to fully live provider-backed data.
