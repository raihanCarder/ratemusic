-- Music4You baseline schema
-- This migration establishes the initial repo-tracked schema for the app.

create extension if not exists "pgcrypto";

-- ============================================================================
-- Shared utility: updated_at trigger
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Shared trigger function that refreshes updated_at before update.';

-- ============================================================================
-- Profiles
-- Public-facing identity for auth.users
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Public profile information for each authenticated user.';
comment on column public.profiles.id is
  'Matches auth.users.id exactly.';
comment on column public.profiles.username is
  'Unique public handle used in /u/[username] routes.';
comment on column public.profiles.avatar_url is
  'External avatar image URL.';
comment on column public.profiles.bio is
  'Optional profile biography shown on public and private profile pages.';

alter table public.profiles enable row level security;

drop policy if exists "Profiles are public" on public.profiles;
create policy "Profiles are public"
on public.profiles
for select
using (true);

drop policy if exists "Update own profile" on public.profiles;
create policy "Update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

comment on policy "Profiles are public" on public.profiles is
  'Anyone can read public profiles.';
comment on policy "Update own profile" on public.profiles is
  'Authenticated users can update only their own profile row.';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    lower(trim(new.raw_user_meta_data->>'username')),
    new.raw_user_meta_data->>'username'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

comment on function public.handle_new_user() is
  'Creates an initial public profile row after a new auth.users signup.';

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ============================================================================
-- Albums
-- Shared music catalog cached from providers
-- ============================================================================

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_album_id text not null,
  title text not null,
  artist text not null,
  release_date date,
  album_cover text,
  raw_payload jsonb,
  cached_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint albums_provider_album_id_unique unique (provider, provider_album_id)
);

comment on table public.albums is
  'Shared album catalog cached from upstream providers.';
comment on column public.albums.provider is
  'Provider namespace, for example mock or spotify.';
comment on column public.albums.provider_album_id is
  'Provider-owned identifier used to hydrate album detail pages.';
comment on column public.albums.album_cover is
  'Album artwork URL used throughout discovery and album pages.';
comment on column public.albums.raw_payload is
  'Provider payload and any serialized track data used to rehydrate songs.';

create index if not exists idx_albums_provider
  on public.albums (provider);
create index if not exists idx_albums_provider_album_id
  on public.albums (provider, provider_album_id);
create index if not exists idx_albums_title
  on public.albums (title);
create index if not exists idx_albums_artist
  on public.albums (artist);

alter table public.albums enable row level security;

drop policy if exists "Albums are public" on public.albums;
create policy "Albums are public"
on public.albums
for select
using (true);

comment on policy "Albums are public" on public.albums is
  'Anyone can read cached albums. Writes are expected to come from the service role.';

-- ============================================================================
-- Reviews
-- User rating + review body for an album
-- ============================================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  album_id uuid not null references public.albums(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 10),
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_user_id_album_id_unique unique (user_id, album_id)
);

comment on table public.reviews is
  'One user review per album, including 1-10 rating and optional body text.';
comment on column public.reviews.rating is
  'Integer rating scale from 1 through 10.';

drop trigger if exists set_reviews_updated_at on public.reviews;
create trigger set_reviews_updated_at
before update on public.reviews
for each row
execute function public.set_updated_at();

create index if not exists idx_reviews_user_id
  on public.reviews (user_id);
create index if not exists idx_reviews_album_id
  on public.reviews (album_id);

alter table public.reviews enable row level security;

drop policy if exists "Reviews are public" on public.reviews;
create policy "Reviews are public"
on public.reviews
for select
using (true);

drop policy if exists "Insert own review" on public.reviews;
create policy "Insert own review"
on public.reviews
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Update own review" on public.reviews;
create policy "Update own review"
on public.reviews
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Delete own review" on public.reviews;
create policy "Delete own review"
on public.reviews
for delete
to authenticated
using (auth.uid() = user_id);

comment on policy "Reviews are public" on public.reviews is
  'Anyone can read reviews.';
comment on policy "Insert own review" on public.reviews is
  'Authenticated users can create reviews only for themselves.';
comment on policy "Update own review" on public.reviews is
  'Authenticated users can update only their own reviews.';
comment on policy "Delete own review" on public.reviews is
  'Authenticated users can delete only their own reviews.';

-- ============================================================================
-- Featured lists
-- Shared album collections used by discovery and editorial surfaces
-- ============================================================================

create table if not exists public.featured_lists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

comment on table public.featured_lists is
  'Named album collections such as feed and daily-album.';
comment on column public.featured_lists.slug is
  'Stable programmatic identifier used by the app.';

create table if not exists public.featured_list_items (
  list_id uuid not null references public.featured_lists(id) on delete cascade,
  album_id uuid not null references public.albums(id) on delete cascade,
  rank integer not null,
  created_at timestamptz not null default now(),
  primary key (list_id, album_id)
);

comment on table public.featured_list_items is
  'Join table linking albums to named featured lists.';
comment on column public.featured_list_items.rank is
  'Ordering slot. In feed it is list order. In daily-album it is the Toronto calendar-day ordinal.';

create index if not exists idx_featured_list_items_rank
  on public.featured_list_items (list_id, rank);

create unique index if not exists idx_featured_list_items_list_id_rank
  on public.featured_list_items (list_id, rank);

comment on index public.idx_featured_list_items_list_id_rank is
  'Prevents two rows from claiming the same rank within a single featured list.';

alter table public.featured_lists enable row level security;
alter table public.featured_list_items enable row level security;

drop policy if exists "Featured lists are public" on public.featured_lists;
create policy "Featured lists are public"
on public.featured_lists
for select
using (true);

drop policy if exists "Featured list items are public" on public.featured_list_items;
create policy "Featured list items are public"
on public.featured_list_items
for select
using (true);

comment on policy "Featured lists are public" on public.featured_lists is
  'Anyone can read list metadata.';
comment on policy "Featured list items are public" on public.featured_list_items is
  'Anyone can read list membership and ordering.';

insert into public.featured_lists (slug, title)
values
  ('feed', 'Feed'),
  ('daily-album', 'Album of the Day Archive')
on conflict (slug) do update
set
  title = excluded.title,
  updated_at = now();
