import "server-only";

import { createSupabaseAdmin } from "@/src/auth/admin";
import type {
  AlbumRatingsPageData,
  RateableAlbumData,
  SubmitAlbumRatingInput,
} from "./types";

type AlbumIdRow = {
  id: string;
};

type ReviewRatingRow = {
  rating: number;
};

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}

function normalizeReleaseDate(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const dateObject = new Date(value);
  return Number.isNaN(dateObject.getTime()) ? null : value;
}

function isUniqueViolationError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { code?: unknown; message?: unknown };
  const code = typeof maybeError.code === "string" ? maybeError.code : "";
  const message =
    typeof maybeError.message === "string" ? maybeError.message.toLowerCase() : "";

  return code === "23505" || message.includes("duplicate key");
}

async function getAlbumRowId(provider: string, providerAlbumId: string) {
  const admin = createSupabaseAdmin();
  const { data, error } = await admin
    .from("albums")
    .select("id")
    .eq("provider", provider)
    .eq("provider_album_id", providerAlbumId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching album row for ratings:", error);
    return null;
  }

  return (data as AlbumIdRow | null)?.id ?? null;
}

async function createAlbumRowForRating(album: RateableAlbumData) {
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

  console.error("Error creating album row for ratings:", error);
  return null;
}

async function ensureAlbumRowIdForRating(album: RateableAlbumData) {
  return (
    (await getAlbumRowId(album.provider, album.id)) ??
    (await createAlbumRowForRating(album))
  );
}

export async function getAlbumRatingsPageData(
  album: RateableAlbumData,
  userId?: string | null,
): Promise<AlbumRatingsPageData> {
  const albumRowId = await getAlbumRowId(album.provider, album.id);

  if (!albumRowId) {
    return {
      summary: {
        averageRating: null,
        ratingCount: 0,
      },
      currentUserRating: null,
    };
  }

  const admin = createSupabaseAdmin();
  const [ratingsResult, currentUserRatingResult] = await Promise.all([
    admin.from("reviews").select("rating").eq("album_id", albumRowId),
    userId
      ? admin
          .from("reviews")
          .select("rating")
          .eq("album_id", albumRowId)
          .eq("user_id", userId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (ratingsResult.error) {
    console.error("Error fetching album ratings:", ratingsResult.error);
  }

  if (currentUserRatingResult.error) {
    console.error(
      "Error fetching current user album rating:",
      currentUserRatingResult.error,
    );
  }

  const ratings = ((ratingsResult.data as ReviewRatingRow[] | null) ?? [])
    .map((row) => row.rating)
    .filter((rating) => typeof rating === "number");

  const averageRating =
    ratings.length > 0
      ? roundToTwoDecimals(
          ratings.reduce((total, rating) => total + rating, 0) / ratings.length,
        )
      : null;

  const currentUserRating = currentUserRatingResult.data as ReviewRatingRow | null;

  return {
    summary: {
      averageRating,
      ratingCount: ratings.length,
    },
    currentUserRating: currentUserRating
      ? {
          rating: currentUserRating.rating,
        }
      : null,
  };
}

export async function upsertAlbumRatingForUser(
  userId: string,
  input: SubmitAlbumRatingInput,
) {
  const albumRowId = await ensureAlbumRowIdForRating(input);

  if (!albumRowId) {
    return { errorMessage: "Could not save your rating right now." };
  }

  const admin = createSupabaseAdmin();
  const { error } = await admin.from("reviews").upsert(
    {
      user_id: userId,
      album_id: albumRowId,
      rating: input.rating,
      body: null,
    },
    { onConflict: "user_id, album_id" },
  );

  if (error) {
    console.error("Error saving album rating:", error);
    return { errorMessage: "Could not save your rating right now." };
  }

  return { errorMessage: null };
}
