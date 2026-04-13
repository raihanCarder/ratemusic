"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/src/auth/server";
import {
  addFavoriteAlbumForUser,
  getFavoriteAlbumsByUserId,
  getAlbumFavoritesPageData,
  removeFavoriteAlbumForUser,
  replaceFavoriteAlbumForUser,
} from "@/src/lib/favorites/server";
import type { FavoriteAlbum, SubmitAlbumFavoriteInput } from "@/src/lib/favorites/types";
import { ensureCurrentUserProfile } from "@/src/lib/profiles/server";

type SubmitAlbumFavoriteActionResult =
  | {
      status: "added" | "removed" | "replaced";
      errorMessage: null;
      currentUserFavorites: FavoriteAlbum[];
    }
  | {
      status: "needs_replacement";
      errorMessage: null;
      currentUserFavorites: FavoriteAlbum[];
    }
  | {
      status: "error";
      errorMessage: string;
      currentUserFavorites: FavoriteAlbum[];
    };

function revalidateFavoritePaths(albumId: string, username: string | null | undefined) {
  revalidatePath(`/album/${albumId}`);
  revalidatePath("/profile");

  if (username) {
    revalidatePath(`/u/${username}`);
  }
}

export async function submitAlbumFavoriteAction(
  input: SubmitAlbumFavoriteInput,
): Promise<SubmitAlbumFavoriteActionResult> {
  const user = await getUser();

  if (!user) {
    return {
      status: "error",
      errorMessage: "Please sign up or sign in to favourite albums.",
      currentUserFavorites: [],
    };
  }

  const [profile, favoritesPageData] = await Promise.all([
    ensureCurrentUserProfile(),
    getAlbumFavoritesPageData(input, user.id),
  ]);

  if (favoritesPageData.isFavorited) {
    const result = await removeFavoriteAlbumForUser(user.id, input);

    if (result.errorMessage) {
      return {
        status: "error",
        errorMessage: result.errorMessage,
        currentUserFavorites: favoritesPageData.currentUserFavorites,
      };
    }

    revalidateFavoritePaths(input.id, profile?.username);

    return {
      status: "removed",
      errorMessage: null,
      currentUserFavorites: favoritesPageData.currentUserFavorites.filter(
        (favoriteAlbum) => favoriteAlbum.albumId !== input.id,
      ),
    };
  }

  if (input.replaceAlbumId) {
    const result = await replaceFavoriteAlbumForUser(
      user.id,
      input.replaceAlbumId,
      input,
    );

    if (result.errorMessage) {
      return {
        status: "error",
        errorMessage: result.errorMessage,
        currentUserFavorites: favoritesPageData.currentUserFavorites,
      };
    }

    revalidateFavoritePaths(input.id, profile?.username);

    return {
      status: "replaced",
      errorMessage: null,
      currentUserFavorites: await getFavoriteAlbumsByUserId(user.id),
    };
  }

  if (favoritesPageData.currentUserFavorites.length >= 4) {
    return {
      status: "needs_replacement",
      errorMessage: null,
      currentUserFavorites: favoritesPageData.currentUserFavorites,
    };
  }

  const result = await addFavoriteAlbumForUser(user.id, input);

  if (result.errorCode === "favorite_limit_reached") {
    return {
      status: "needs_replacement",
      errorMessage: null,
      currentUserFavorites: await getFavoriteAlbumsByUserId(user.id),
    };
  }

  if (result.errorMessage) {
    return {
      status: "error",
      errorMessage: result.errorMessage,
      currentUserFavorites: favoritesPageData.currentUserFavorites,
    };
  }

  revalidateFavoritePaths(input.id, profile?.username);

  return {
    status: "added",
    errorMessage: null,
    currentUserFavorites: await getFavoriteAlbumsByUserId(user.id),
  };
}
