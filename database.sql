-- RateMusic Database Schema
-- PostgreSQL schema for Supabase
-- WARNING: This schema is for context only and is not meant to be run directly.
-- Table order and constraints may not be valid for execution.

-- Albums table: stores album metadata from music providers
CREATE TABLE public.albums (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  provider_album_id text NOT NULL,
  title text NOT NULL,
  artist text NOT NULL,
  release_date date,
  album_cover text,
  raw_payload jsonb,
  cached_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT albums_pkey PRIMARY KEY (id),
  CONSTRAINT albums_provider_album_id_unique UNIQUE (provider, provider_album_id)
);

-- Featured Lists: collections of albums (e.g., "feed", "trending")
CREATE TABLE public.featured_lists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT featured_lists_pkey PRIMARY KEY (id)
);

-- Featured List Items: join table linking albums to featured lists
CREATE TABLE public.featured_list_items (
  list_id uuid NOT NULL,
  album_id uuid NOT NULL,
  rank integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT featured_list_items_pkey PRIMARY KEY (list_id, album_id),
  CONSTRAINT featured_list_items_list_id_fkey FOREIGN KEY (list_id) REFERENCES public.featured_lists(id) ON DELETE CASCADE,
  CONSTRAINT featured_list_items_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums(id) ON DELETE CASCADE
);

-- User Profiles: user information linked to auth.users
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  username text NOT NULL UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Reviews: user ratings and reviews for albums
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  album_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 10),
  body text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT reviews_album_id_fkey FOREIGN KEY (album_id) REFERENCES public.albums(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_albums_provider ON public.albums(provider);
CREATE INDEX idx_albums_provider_album_id ON public.albums(provider, provider_album_id);
CREATE INDEX idx_featured_list_items_rank ON public.featured_list_items(list_id, rank);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_album_id ON public.reviews(album_id);
