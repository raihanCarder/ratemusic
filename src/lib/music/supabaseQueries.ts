import type { SupabaseClient } from "@supabase/supabase-js";
import { AlbumDataInDatabase } from "./types";

type getAlbumDataFromProviderIdParams = {
  db: SupabaseClient;
  provider: string;
  providerAlbumId: string;
};

export async function getAlbumDataFromProviderId({
  db,
  provider,
  providerAlbumId,
}: getAlbumDataFromProviderIdParams) {
  return db
    .from("albums")
    .select(
      "provider, provider_album_id, title, artist, album_cover, release_date, raw_payload"
    )
    .eq("provider", provider)
    .eq("provider_album_id", providerAlbumId)
    .maybeSingle();
}

type upsertAlbumToDatabaseParams = {
  db: SupabaseClient;
  row: AlbumDataInDatabase;
};

export async function upsertAlbumToDatabase({
  db,
  row,
}: upsertAlbumToDatabaseParams) {
  return db
    .from("albums")
    .upsert(row, { onConflict: "provider, provider_album_id" })
    .select(
      "provider, provider_album_id, title, artist, album_cover, release_date, raw_payload"
    )
    .maybeSingle();
}
