# 🎵 Music4You

**The album diary for people with real opinions.**

Music4You is a Letterboxd-style music web app where you rate albums, build a public taste profile, and follow a daily editorial pick. Built as a full-stack Next.js project with a clean provider/database architecture ready for Spotify and Supabase at scale.

---

## 🌱 App Features

- 🌟 **Rate albums 1–10** and have your score contribute to a community average.
- 👤 **Build a public music identity** — custom display name, bio, avatar, and a shareable `/u/[username]` profile showing your four most recent ratings.
- 📅 **Album of the Day** — one record gets the spotlight for the full day, then moves to an archive that never repeats until the catalog runs out.
- 🔍 **Discovery feed** — a curated grid of albums to explore, backed by a swappable provider interface.
- 🔐 **Authentication** — sign up, sign in, sign out via Supabase Auth with route-level middleware that keeps auth pages clean for signed-in users.
- ⚙️ **Settings page** — view and edit your profile, including avatar randomization.

---

## 🛠️ Tech Stack

| Layer         | Technology                            |
| ------------- | ------------------------------------- |
| Framework     | Next.js 15 (App Router)               |
| UI            | MUI v7 + Tailwind CSS v4              |
| Language      | TypeScript                            |
| Auth + DB     | Supabase (Auth, Postgres, RLS)        |
| Notifications | react-hot-toast                       |
| Runtime       | React 19 (Server + Client Components) |

---

## 🏗️ Architecture

### Interface-driven data layer

Two core interfaces keep the app decoupled from any specific vendor:

```
MusicProvider   — search albums, fetch album details, get featured albums
AlbumDatabase   — persist albums, manage featured lists, drive the daily rotation
```

Swapping from mock data to Spotify, or from Supabase to another database, means writing a new adapter — not touching UI code.

### Request flow

```
Page (Server Component)
  └── MusicService          cache-first orchestrator
        ├── MusicProvider   fetch from external API (Spotify / mock)
        └── AlbumDatabase   read/write Supabase (Supabase.ts)
```

### Auth flow

```
Middleware (proxy.ts)       redirect signed-in users away from /signin, /signup
  └── getUser()             server-only Supabase session check
        ├── Server pages    redirect to /signin if not authenticated
        └── Server actions  validate session before any mutation
```

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router routes
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout (Nav + Footer)
│   ├── providers.tsx             # MUI theme + toast provider (client boundary)
│   ├── feed/                     # Discovery album grid
│   ├── album/[id]/               # Dynamic album detail + rating page
│   ├── album-of-the-day/         # Daily editorial page
│   ├── profile/                  # Authenticated user profile (editable)
│   ├── u/[username]/             # Public profile by username
│   ├── settings/                 # Account settings
│   ├── signin/                   # Sign-in form + server action
│   └── signup/                   # Sign-up form + server action
│
├── components/                   # Shared UI components
│   ├── daily/                    # Daily album page sub-components
│   │   ├── DailyAlbumHero.tsx    # Cover, title, stats, CTAs
│   │   ├── DailyTrackSpotlight.tsx  # Track listing panel
│   │   ├── DailyArchive.tsx      # Previous picks grid
│   │   └── DailyRightColumn.tsx  # Scoreboard + ritual info
│   ├── Nav.tsx                   # Server nav shell with streaming auth slot
│   ├── NavClient.tsx             # Client nav with logo + links
│   ├── PageFooter.tsx            # Sitewide footer with links + contact
│   ├── AlbumCard.tsx             # Album cover card
│   ├── AlbumGrid.tsx             # Responsive album grid layout
│   ├── AlbumView.tsx             # Full album detail view
│   ├── AlbumRatingSection.tsx    # Rating form + community score display
│   ├── SongView.tsx              # Individual track row
│   ├── DailyAlbumPageView.tsx    # Orchestrator for daily page sections
│   ├── ProfilePageView.tsx       # User profile layout
│   ├── ProfileAvatar.tsx         # Avatar with initials fallback
│   └── ProfileEditDialog.tsx     # Edit profile dialog
│
├── actions/                      # Next.js Server Actions
│   ├── users.ts                  # Sign up, sign in, sign out
│   ├── profiles.ts               # Update profile
│   └── reviews.ts                # Submit album rating
│
├── auth/                         # Supabase client factories
│   ├── server.ts                 # SSR-aware server client + session helpers
│   ├── client.ts                 # Browser client
│   ├── admin.ts                  # Service-role admin client (server-only)
│   └── env.ts                    # Environment variable validation
│
├── lib/
│   ├── db/
│   │   └── errors.ts             # Shared DB error utilities (unique violation, etc.)
│   ├── music/
│   │   ├── types.ts              # Core contracts: AlbumData, MusicProvider, AlbumDatabase
│   │   ├── Music.ts              # MusicService factory (singleton)
│   │   ├── MusicService.ts       # Cache-first orchestrator for all music data
│   │   ├── Supabase.ts           # AlbumDatabase implementation
│   │   ├── mappers.ts            # DB row ↔ domain type transformations
│   │   ├── supabaseQueries.ts    # Low-level Supabase query builders
│   │   ├── dailyAlbum.ts         # Date/time utilities for daily rotation
│   │   ├── discovery.ts          # Cached discovery feed helpers
│   │   ├── constants.ts          # Shared slug/limit constants
│   │   ├── Spotify.ts            # Spotify provider stub (in progress)
│   │   └── testing/              # Mock provider + seeded album data
│   ├── profiles/
│   │   ├── types.ts              # Profile domain types
│   │   ├── server.ts             # Profile fetch, create, update (server-only)
│   │   ├── format.ts             # Date/display formatting for profiles
│   │   ├── avatar.ts             # DiceBear avatar URL generation
│   │   └── validation.ts         # Username rules + profile input validation
│   └── reviews/
│       ├── types.ts              # Rating domain types
│       └── server.ts             # Rating fetch + upsert (server-only)
│
└── proxy.ts                      # Middleware: auth redirects
```

---

## 🗄️ Database Schema

| Table                 | Purpose                                                 |
| --------------------- | ------------------------------------------------------- |
| `profiles`            | User profile data (username, display name, bio, avatar) |
| `albums`              | Persisted album records with provider metadata          |
| `reviews`             | User ratings (1–10) per album                           |
| `featured_lists`      | Named curated lists (feed, daily rotation)              |
| `featured_list_items` | Albums assigned to a list with rank                     |

---

## ⚙️ Local Setup

### 1. 📦 Install dependencies

```bash
npm install
```

### 2. 🔑 Configure environment variables

```bash
cp .env.example .env.local
```

Required:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### 3. 🐳 Start local Supabase (Docker required)

```bash
npm run supabase:start
```

Reset to a clean database from migrations:

```bash
npm run supabase:db:reset
```

### 4. ▶️ Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts

| Command                                    | Description                              |
| ------------------------------------------ | ---------------------------------------- |
| `npm run dev`                              | Start local dev server                   |
| `npm run build`                            | Production build                         |
| `npm run start`                            | Run production build                     |
| `npm run lint`                             | Lint project                             |
| `npm run supabase:start`                   | Start local Supabase stack               |
| `npm run supabase:stop`                    | Stop local Supabase stack                |
| `npm run supabase:status`                  | Print local Supabase URLs and keys       |
| `npm run supabase:db:reset`                | Rebuild local DB from repo migrations    |
| `npm run supabase:db:push`                 | Push local migrations to hosted Supabase |
| `npm run supabase:migration:new -- <name>` | Create a new migration file              |

---

## 🗃️ Database Workflow

Migrations live in `supabase/migrations` — the repo is the source of truth, not the dashboard. Use the dashboard for logs, data inspection, and auth settings only.

```bash
# Create a new migration
npm run supabase:migration:new -- add_playlists

# Apply full history locally
npm run supabase:db:reset

# Link to hosted project once
npx supabase link --project-ref <your-project-ref>

# Push to hosted project
npm run supabase:db:push
```

---

## 🛣️ Roadmap

- [ ] 🔎 Wire nav search to `MusicService.searchAlbums`
- [ ] 🎧 Complete Spotify provider implementation
- [ ] 🤝 Friends / social graph
- [ ] 📋 Album lists and year-in-review summaries
- [ ] 🏆 Ratings connected to daily scoreboard

---

## 💡 Why This Project

Music4You demonstrates product-quality full-stack engineering:

- 🧱 **Server/client boundary discipline** — data fetching and mutations stay on the server; the client only handles interactivity.
- 🔌 **Interface-driven architecture** — `MusicProvider` and `AlbumDatabase` are contracts, not implementations. Spotify and any future database are drop-in replacements.
- 🧩 **Modular codebase** — domain logic (music, profiles, reviews) is isolated in `lib/`, shared utilities (`db/errors`, `music/mappers`) prevent duplication, and large components are split into focused sub-components.
- 🔐 **Auth done right** — SSR-aware Supabase clients, service-role admin isolation, and middleware-level redirect guards.
- 🎯 **Product thinking** — discovery feed, shareable profiles, and a daily editorial feature that creates a reason to return every day.

---

Built by [Raihan Carder](mailto:raihancarder@gmail.com) 🎶
