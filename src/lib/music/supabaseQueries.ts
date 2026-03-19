import type { SupabaseClient } from "@supabase/supabase-js";
import { AlbumDataInDatabase } from "./types";

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

type getFeaturedAlbumsQueryParams = {
  db: SupabaseClient;
  listId: string;
  amount: number;
};

export async function getFeaturedAlbumsQuery({
  db,
  listId,
  amount,
}: getFeaturedAlbumsQueryParams) {
  return db
    .from("featured_list_items")
    .select(
      `
        rank,
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
    .eq("list_id", listId)
    .order("rank", { ascending: true })
    .limit(amount);
}

type getListIdQueryParams = {
  db: SupabaseClient;
  listName: string;
};

export async function getListIdQuery({ db, listName }: getListIdQueryParams) {
  return db
    .from("featured_lists")
    .select("id")
    .eq("slug", listName)
    .maybeSingle();
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
  // Try to get existing
  const { data: existing, error: getError } = await db
    .from("featured_lists")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  // If found, return it
  if (existing) {
    console.log(`Found existing featured list: ${slug}`, existing);
    return { data: existing, error: null };
  }

  // If error occurred during GET, return the error
  if (getError) {
    console.error(`Error fetching featured list ${slug}:`, getError);
    return { data: null, error: getError };
  }

  // Not found (data is null, error is null) - create it
  console.log(`Creating new featured list: ${slug}`);
  const createResult = await db
    .from("featured_lists")
    .insert([{ slug, title }])
    .select("id")
    .maybeSingle();

  if (createResult.error) {
    console.error(`Error creating featured list ${slug}:`, createResult.error);
  } else {
    console.log(`Successfully created featured list:`, createResult.data);
  }

  return createResult;
}
