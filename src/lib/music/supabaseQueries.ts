import type { SupabaseClient } from "@supabase/supabase-js";
import { AlbumDataInDatabase } from "./types";

type getAlbumDataFromProviderIdQueryParams = {
  db: SupabaseClient;
  provider: string;
  providerAlbumId: string;
};

export async function getAlbumDataFromProviderIdQuery({
  db,
  provider,
  providerAlbumId,
}: getAlbumDataFromProviderIdQueryParams) {
  return db
    .from("albums")
    .select(
      "provider, provider_album_id, title, artist, album_cover, release_date, raw_payload",
    )
    .eq("provider", provider)
    .eq("provider_album_id", providerAlbumId)
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
      "provider, provider_album_id, title, artist, album_cover, release_date, raw_payload",
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
