import "server-only";

import { createSupabaseAdmin } from "@/src/auth/admin";
import { isUniqueViolationError } from "@/src/lib/db/errors";
import { logger } from "@/src/lib/logger";
import type { AlbumData } from "./types";

export type PersistableAlbumInput = Pick<
  AlbumData,
  "provider" | "id" | "title" | "artist" | "image" | "releaseDate"
>;

type AlbumIdRow = {
  id: string;
};

function normalizeReleaseDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const dateObject = new Date(value);
  return Number.isNaN(dateObject.getTime()) ? null : value;
}

export async function getAlbumRowId(provider: string, providerAlbumId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("albums")
    .select("id")
    .eq("provider", provider)
    .eq("provider_album_id", providerAlbumId)
    .maybeSingle();

  if (error) {
    logger.error("Error fetching album row for mutation:", error);
    return null;
  }

  return (data as AlbumIdRow | null)?.id ?? null;
}

async function createAlbumRow(album: PersistableAlbumInput) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("albums")
    .insert({
      provider: album.provider,
      provider_album_id: album.id,
      title: album.title,
      artist: album.artist,
      album_cover: album.image,
      release_date: normalizeReleaseDate(album.releaseDate),
      raw_payload: null,
    })
    .select("id")
    .maybeSingle();

  if (!error) {
    return (data as AlbumIdRow | null)?.id ?? null;
  }

  if (isUniqueViolationError(error)) {
    return getAlbumRowId(album.provider, album.id);
  }

  logger.error("Error creating album row for mutation:", error);
  return null;
}

export async function ensureAlbumRowId(album: PersistableAlbumInput) {
  return (
    (await getAlbumRowId(album.provider, album.id)) ??
    (await createAlbumRow(album))
  );
}
