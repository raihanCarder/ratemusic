import "server-only";

import { createSupabaseAdmin } from "@/src/auth/admin";
import { logger } from "@/src/lib/logger";
import { ensureAlbumRowId, getAlbumRowId } from "@/src/lib/music/server";
import type {
  AlbumRatingsPageData,
  RateableAlbumData,
  SubmitAlbumRatingInput,
} from "./types";

type ReviewRatingRow = {
  rating: number;
};

function roundToTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
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
    logger.error("Error fetching album ratings:", ratingsResult.error);
  }

  if (currentUserRatingResult.error) {
    logger.error(
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
  const albumRowId = await ensureAlbumRowId(input);

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
    logger.error("Error saving album rating:", error);
    return { errorMessage: "Could not save your rating right now." };
  }

  return { errorMessage: null };
}
