import type { SupabaseClient } from "@supabase/supabase-js";
import { AlbumDataInDatabase } from "./types";
import { logger } from "@/src/lib/logger";

type getAlbumDataFromProviderIdQueryParams = {
  db: SupabaseClient;
  provider: string;
  id: string;
};

export async function getAlbumDataFromProviderIdQuery({
  db,
  provider,
  id,
}: getAlbumDataFromProviderIdQueryParams) {
  return db
    .from("albums")
    .select(
      "provider, provider_album_id, title, artist, album_cover, release_date, raw_payload",
    )
    .eq("provider", provider)
    .eq("provider_album_id", id)
    .maybeSingle();
}

type upsertAlbumToDatabaseQueryParams = {
  db: SupabaseClient;
  row: AlbumDataInDatabase;
};

export async function upsertAlbumToDatabaseQuery({
  db,
  row,
}: upsertAlbumToDatabaseQueryParams) {
  return db
    .from("albums")
    .upsert(row, { onConflict: "provider, provider_album_id" })
    .select(
      "id, provider, provider_album_id, title, artist, album_cover, release_date, raw_payload",
    )
    .maybeSingle();
}

type upsertAlbumsToDatabaseQueryParams = {
  db: SupabaseClient;
  rows: AlbumDataInDatabase[];
};

export async function upsertAlbumsToDatabaseQuery({
  db,
  rows,
}: upsertAlbumsToDatabaseQueryParams) {
  return db
    .from("albums")
    .upsert(rows, { onConflict: "provider, provider_album_id" })
    .select(
      "id, provider, provider_album_id, title, artist, album_cover, release_date, raw_payload",
    );
}

type getFeaturedAlbumsQueryParams = {
  db: SupabaseClient;
  listSlug: string;
  amount: number;
};

export async function getFeaturedAlbumsQuery({
  db,
  listSlug,
  amount,
}: getFeaturedAlbumsQueryParams) {
  return db
    .from("featured_list_items")
    .select(
      `
        rank,
        featured_lists!inner(slug),
        album:albums!featured_list_items_album_id_fkey(
          provider,
          provider_album_id,
          title,
          artist,
          album_cover,
          release_date,
          raw_payload
        )
      `,
    )
    .eq("featured_lists.slug", listSlug)
    .order("rank", { ascending: true })
    .limit(amount);
}

type createOrGetFeaturedListParams = {
  db: SupabaseClient;
  slug: string;
  title: string;
};

export async function createOrGetFeaturedListQuery({
  db,
  slug,
  title,
}: createOrGetFeaturedListParams) {
  const result = await db
    .from("featured_lists")
    .upsert([{ slug, title }], { onConflict: "slug" })
    .select("id")
    .single();

  if (result.error) {
    logger.error(`Error upserting featured list ${slug}:`, result.error);
  } else {
    logger.log(`Using featured list ${slug}:`, result.data);
  }

  return result;
}

type getFeaturedListItemsQueryParams = {
  db: SupabaseClient;
  listSlug: string;
  amount?: number;
  rank?: number;
  ascending?: boolean;
};

export async function getFeaturedListItemsQuery({
  db,
  listSlug,
  amount,
  rank,
  ascending = true,
}: getFeaturedListItemsQueryParams) {
  let query = db
    .from("featured_list_items")
    .select(
      `
        list_id,
        album_id,
        rank,
        created_at,
        featured_lists!inner(slug),
        album:albums!featured_list_items_album_id_fkey(
          provider,
          provider_album_id,
          title,
          artist,
          album_cover,
          release_date,
          raw_payload
        )
      `,
    )
    .eq("featured_lists.slug", listSlug)
    .order("rank", { ascending });

  if (typeof rank === "number") {
    query = query.eq("rank", rank);
  }

  if (typeof amount === "number") {
    query = query.limit(amount);
  }

  return query;
}
