-- Mirror auth email verification state into public.profiles for fast public-directory queries.

alter table public.profiles
add column if not exists email_confirmed boolean not null default false;

comment on column public.profiles.email_confirmed is
  'App-facing mirror of auth.users.email_confirmed_at used for public visibility filters.';

update public.profiles as profile
set email_confirmed = auth_user.email_confirmed_at is not null
from auth.users as auth_user
where auth_user.id = profile.id;

create index if not exists idx_profiles_email_confirmed_created_at
  on public.profiles (email_confirmed, created_at desc);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name, email_confirmed)
  values (
    new.id,
    lower(trim(new.raw_user_meta_data->>'username')),
    new.raw_user_meta_data->>'username',
    new.email_confirmed_at is not null
  )
  on conflict (id) do update
  set email_confirmed = excluded.email_confirmed;

  return new;
end;
$$;

comment on function public.handle_new_user() is
  'Creates an initial public profile row after a new auth.users signup and mirrors email verification state.';

create or replace function public.handle_auth_user_email_confirmed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set email_confirmed = new.email_confirmed_at is not null
  where id = new.id;

  return new;
end;
$$;

comment on function public.handle_auth_user_email_confirmed() is
  'Keeps public.profiles.email_confirmed in sync with auth.users.email_confirmed_at.';

drop trigger if exists on_auth_user_email_confirmed on auth.users;
create trigger on_auth_user_email_confirmed
after update of email_confirmed_at on auth.users
for each row
when (old.email_confirmed_at is distinct from new.email_confirmed_at)
execute function public.handle_auth_user_email_confirmed();
