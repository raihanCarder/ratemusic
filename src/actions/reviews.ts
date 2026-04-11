"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/src/auth/server";
import { upsertAlbumRatingForUser } from "@/src/lib/reviews/server";
import type { SubmitAlbumRatingInput } from "@/src/lib/reviews/types";

function isValidRating(rating: number) {
  return Number.isInteger(rating) && rating >= 1 && rating <= 10;
}

export async function submitAlbumRatingAction(input: SubmitAlbumRatingInput) {
  const user = await getUser();

  if (!user) {
    return { errorMessage: "Please sign up or sign in to rate albums." };
  }

  if (!isValidRating(input.rating)) {
    return { errorMessage: "Ratings must be a whole number from 1 to 10." };
  }

  const result = await upsertAlbumRatingForUser(user.id, input);

  if (result.errorMessage) {
    return result;
  }

  revalidatePath(`/album/${input.id}`);

  return { errorMessage: null };
}
