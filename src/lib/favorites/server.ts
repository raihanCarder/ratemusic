import "server-only";

import { createSupabaseAdmin } from "@/src/auth/admin";
import { isUniqueViolationError } from "@/src/lib/db/errors";
import { logger } from "@/src/lib/logger";
import { ensureAlbumRowId, getAlbumRowId } from "@/src/lib/music/server";
import type {
  AlbumFavoritesPageData,
  FavoritableAlbumData,
  FavoriteAlbum,
} from "./types";

type FavoriteAlbumRow = {
  created_at: string;
  album:
    | {
        provider_album_id: string;
        title: string;
        artist: string;
        album_cover: string | null;
      }
    | {
        provider_album_id: string;
        title: string;
        artist: string;
        album_cover: string | null;
      }[]
    | null;
};

type FavoriteMutationErrorCode =
  | "favorite_limit_reached"
  | "favorite_replace_target_missing"
  | "unknown";

type FavoriteMutationResult = {
  errorCode: FavoriteMutationErrorCode | null;
  errorMessage: string | null;
};

function mapFavoriteAlbumRow(row: FavoriteAlbumRow): FavoriteAlbum | null {
  const album = Array.isArray(row.album) ? row.album[0] : row.album;

  if (!album) {
    return null;
  }

  return {
    albumId: album.provider_album_id,
    title: album.title,
    artist: album.artist,
    image: album.album_cover ?? "",
    favoritedAt: row.created_at,
  };
}

function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "";
  }

  const maybeError = error as {
    message?: unknown;
    details?: unknown;
    hint?: unknown;
  };
  const messageParts = [
    typeof maybeError.message === "string" ? maybeError.message : "",
    typeof maybeError.details === "string" ? maybeError.details : "",
    typeof maybeError.hint === "string" ? maybeError.hint : "",
  ];

  return messageParts.join(" ").toLowerCase();
}

function getFavoriteMutationErrorCode(error: unknown): FavoriteMutationErrorCode {
  const message = getErrorMessage(error);

  if (message.includes("favorite_limit_reached")) {
    return "favorite_limit_reached";
  }

  if (message.includes("favorite_replace_target_missing")) {
    return "favorite_replace_target_missing";
  }

  return "unknown";
}

export async function getFavoriteAlbumsByUserId(userId: string): Promise<FavoriteAlbum[]> {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("profile_favorite_albums")
    .select(
      `
        created_at,
        album:albums!profile_favorite_albums_album_id_fkey(
          provider_album_id,
          title,
          artist,
          album_cover
        )
      `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(4);

  if (error) {
    logger.error("Error fetching profile favourite albums:", error);
    return [];
  }

  return ((data as FavoriteAlbumRow[] | null) ?? [])
    .map((row) => mapFavoriteAlbumRow(row))
    .filter((album): album is FavoriteAlbum => Boolean(album));
}

export async function getAlbumFavoritesPageData(
  album: FavoritableAlbumData,
  userId?: string | null,
): Promise<AlbumFavoritesPageData> {
  if (!userId) {
    return {
      isFavorited: false,
      currentUserFavorites: [],
    };
  }

  const currentUserFavorites = await getFavoriteAlbumsByUserId(userId);

  return {
    isFavorited: currentUserFavorites.some(
      (favoriteAlbum) => favoriteAlbum.albumId === album.id,
    ),
    currentUserFavorites,
  };
}

export async function addFavoriteAlbumForUser(
  userId: string,
  album: FavoritableAlbumData,
): Promise<FavoriteMutationResult> {
  const albumRowId = await ensureAlbumRowId(album);

  if (!albumRowId) {
    return {
      errorCode: "unknown",
      errorMessage: "Could not update your favourites right now.",
    };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("profile_favorite_albums").insert({
    user_id: userId,
    album_id: albumRowId,
  });

  if (!error || isUniqueViolationError(error)) {
    return {
      errorCode: null,
      errorMessage: null,
    };
  }

  const errorCode = getFavoriteMutationErrorCode(error);

  if (errorCode === "favorite_limit_reached") {
    return {
      errorCode,
      errorMessage: "You can only keep four favourite albums at a time.",
    };
  }

  logger.error("Error adding favourite album:", error);
  return {
    errorCode,
    errorMessage: "Could not update your favourites right now.",
  };
}

export async function removeFavoriteAlbumForUser(
  userId: string,
  album: FavoritableAlbumData,
): Promise<FavoriteMutationResult> {
  const albumRowId = await getAlbumRowId(album.provider, album.id);

  if (!albumRowId) {
    return {
      errorCode: null,
      errorMessage: null,
    };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin
    .from("profile_favorite_albums")
    .delete()
    .eq("user_id", userId)
    .eq("album_id", albumRowId);

  if (error) {
    logger.error("Error removing favourite album:", error);
    return {
      errorCode: "unknown",
      errorMessage: "Could not update your favourites right now.",
    };
  }

  return {
    errorCode: null,
    errorMessage: null,
  };
}

export async function replaceFavoriteAlbumForUser(
  userId: string,
  replaceAlbumId: string,
  album: FavoritableAlbumData,
): Promise<FavoriteMutationResult> {
  const [removeAlbumRowId, addAlbumRowId] = await Promise.all([
    getAlbumRowId(album.provider, replaceAlbumId),
    ensureAlbumRowId(album),
  ]);

  if (!removeAlbumRowId || !addAlbumRowId) {
    return {
      errorCode: "unknown",
      errorMessage: "Could not update your favourites right now.",
    };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.rpc("replace_profile_favorite_album", {
    target_user_id: userId,
    remove_album_id: removeAlbumRowId,
    add_album_id: addAlbumRowId,
  });

  if (!error) {
    return {
      errorCode: null,
      errorMessage: null,
    };
  }

  const errorCode = getFavoriteMutationErrorCode(error);

  if (errorCode === "favorite_replace_target_missing") {
    return {
      errorCode,
      errorMessage: "That favourite could not be replaced. Refresh and try again.",
    };
  }

  logger.error("Error replacing favourite album:", error);
  return {
    errorCode,
    errorMessage: "Could not update your favourites right now.",
  };
}
