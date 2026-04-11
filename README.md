# Music4You 🎵

Music4You is a Letterboxd-style music app where users discover albums, add friends, and manage accounts. Personally, I’ve met many of my close friends through shared music interests, and I wanted to build something that could help others form meaningful connections. The goal is to create a space where people can rate music, discover shared tastes, and connect with friends through their listening preferences. Built as a full-stack Next.js project with a clean provider/database architecture designed for real API integrations (Spotify) and persistent storage (Supabase).

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

### 3. Start local Supabase ▶️

Repo-tracked migrations now live in `supabase/migrations`. The repo, not the
Supabase dashboard, is the source of truth for schema changes.

Prerequisite: Docker must be running locally before you start the Supabase stack.

```bash
npm run supabase:start
```

Reset the local database from migration history:

```bash
npm run supabase:db:reset
```

Check local service URLs and generated keys:

```bash
npm run supabase:status
```

### 4. Run development server ▶️

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts 📜

- `npm run dev` start local dev server
- `npm run build` production build
- `npm run start` run production build
- `npm run lint` lint project
- `npm run supabase:start` start the local Supabase stack
- `npm run supabase:stop` stop the local Supabase stack
- `npm run supabase:status` print local Supabase URLs and keys
- `npm run supabase:db:reset` rebuild the local database from repo migrations
- `npm run supabase:db:push` apply local migrations to a linked remote Supabase project
- `npm run supabase:migration:new -- <name>` create a new migration file

## Database Workflow 🗄️

### Repo-first migrations

- Create schema changes in `supabase/migrations`, not in the dashboard.
- Use the dashboard for logs, data inspection, auth/provider settings, and emergency fixes only.
- If an emergency dashboard change happens, add the equivalent migration immediately so the repo stays authoritative.

### Common workflow

Create a migration:

```bash
npm run supabase:migration:new -- add_playlists
```

Apply the full migration history locally:

```bash
npm run supabase:db:reset
```

Push pending migrations to a linked Supabase project:

```bash
npm run supabase:db:push
```

Before `supabase:db:push`, link the repo to the hosted project once:

```bash
npx supabase link --project-ref <your-project-ref>
```

### What is a migration?

A migration is a versioned SQL file that describes one ordered schema change.
Examples include creating a table, adding an index, changing an RLS policy, or
adding a trigger or function.

The difference from editing in the dashboard is that migrations are reviewable,
repeatable, and replayable on a fresh database. The dashboard changes the current
state directly, but it does not give you a reliable repo history unless you copy
those changes back into versioned SQL.

## In Progress / Next Milestones 🛣️

- Wire search input to `MusicService.searchAlbums`.
- Complete Spotify provider implementation.
- Complete `setFeaturedAlbums` persistence flow.
- Implement Album of the Day selection + history.
- Add ratings, reviews, lists, and profile pages (core Letterboxd-style social features).

## Notes 📝

- The UI currently uses seeded/mock album content for discovery and album pages.
- The service and database abstractions are already in place to migrate to fully live provider-backed data.
