-- Profile favourite albums
-- Allows each user to showcase up to four albums on their profile.

create table if not exists public.profile_favorite_albums (
  user_id uuid not null references auth.users(id) on delete cascade,
  album_id uuid not null references public.albums(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, album_id)
);

comment on table public.profile_favorite_albums is
  'Up to four favourite albums selected by a user for their public profile.';
comment on column public.profile_favorite_albums.user_id is
  'Owner of the favourites list.';
comment on column public.profile_favorite_albums.album_id is
  'Album chosen as a favourite.';
comment on column public.profile_favorite_albums.created_at is
  'Timestamp used for newest-first ordering on profiles.';

create index if not exists idx_profile_favorite_albums_user_created_at
  on public.profile_favorite_albums (user_id, created_at desc);

alter table public.profile_favorite_albums enable row level security;

drop policy if exists "Profile favourites are public" on public.profile_favorite_albums;
create policy "Profile favourites are public"
on public.profile_favorite_albums
for select
using (true);

drop policy if exists "Insert own profile favourites" on public.profile_favorite_albums;
create policy "Insert own profile favourites"
on public.profile_favorite_albums
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Delete own profile favourites" on public.profile_favorite_albums;
create policy "Delete own profile favourites"
on public.profile_favorite_albums
for delete
to authenticated
using (auth.uid() = user_id);

comment on policy "Profile favourites are public" on public.profile_favorite_albums is
  'Anyone can read profile favourites.';
comment on policy "Insert own profile favourites" on public.profile_favorite_albums is
  'Authenticated users can insert favourites only for themselves.';
comment on policy "Delete own profile favourites" on public.profile_favorite_albums is
  'Authenticated users can delete favourites only for themselves.';

create or replace function public.enforce_profile_favorite_limit()
returns trigger
language plpgsql
as $$
declare
  current_count integer;
begin
  select count(*)
  into current_count
  from public.profile_favorite_albums
  where user_id = new.user_id;

  if current_count >= 4 then
    raise exception 'favorite_limit_reached';
  end if;

  return new;
end;
$$;

comment on function public.enforce_profile_favorite_limit() is
  'Rejects inserts that would push a user above four favourite albums.';

drop trigger if exists enforce_profile_favorite_limit on public.profile_favorite_albums;
create trigger enforce_profile_favorite_limit
before insert on public.profile_favorite_albums
for each row
execute function public.enforce_profile_favorite_limit();

create or replace function public.replace_profile_favorite_album(
  target_user_id uuid,
  remove_album_id uuid,
  add_album_id uuid
)
returns void
language plpgsql
as $$
begin
  if not exists (
    select 1
    from public.profile_favorite_albums
    where user_id = target_user_id
      and album_id = remove_album_id
  ) then
    raise exception 'favorite_replace_target_missing';
  end if;

  delete from public.profile_favorite_albums
  where user_id = target_user_id
    and album_id = remove_album_id;

  insert into public.profile_favorite_albums (user_id, album_id)
  values (target_user_id, add_album_id);
end;
$$;

comment on function public.replace_profile_favorite_album(uuid, uuid, uuid) is
  'Atomically swaps one favourite album for another for a single user.';
