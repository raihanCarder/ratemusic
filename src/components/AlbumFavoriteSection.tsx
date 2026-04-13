"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { submitAlbumFavoriteAction } from "@/src/actions/favorites";
import type {
  AlbumFavoritesPageData,
  FavoriteAlbum,
  FavoritableAlbumData,
} from "@/src/lib/favorites/types";
import FavoriteReplaceDialog from "./FavoriteReplaceDialog";

type AlbumFavoriteSectionProps = {
  album: FavoritableAlbumData;
  favorites: AlbumFavoritesPageData;
  isSignedIn: boolean;
  signUpHref: string;
};

export default function AlbumFavoriteSection({
  album,
  favorites,
  isSignedIn,
  signUpHref,
}: AlbumFavoriteSectionProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [replacementFavorites, setReplacementFavorites] = useState<FavoriteAlbum[]>(
    favorites.currentUserFavorites,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const favoriteCountLabel = `${favorites.currentUserFavorites.length}/4 favourites used`;

  const closeDialog = () => {
    if (!isPending) {
      setDialogOpen(false);
    }
  };

  const handleSuccess = (status: "added" | "removed" | "replaced") => {
    const messages = {
      added: "Added to favourites.",
      removed: "Removed from favourites.",
      replaced: "Favourite replaced.",
    };

    setFormError(null);
    setDialogOpen(false);
    toast.success(messages[status]);
    router.refresh();
  };

  const handleToggleFavorite = () => {
    setFormError(null);

    startTransition(async () => {
      const result = await submitAlbumFavoriteAction(album);

      if (result.status === "error") {
        setFormError(result.errorMessage);
        return;
      }

      if (result.status === "needs_replacement") {
        setReplacementFavorites(result.currentUserFavorites);
        setDialogOpen(true);
        return;
      }

      handleSuccess(result.status);
    });
  };

  const handleReplace = (replaceAlbumId: string) => {
    setFormError(null);

    startTransition(async () => {
      const result = await submitAlbumFavoriteAction({
        ...album,
        replaceAlbumId,
      });

      if (result.status === "error") {
        setFormError(result.errorMessage);
        return;
      }

      if (result.status === "needs_replacement") {
        setReplacementFavorites(result.currentUserFavorites);
        setDialogOpen(true);
        return;
      }

      handleSuccess(result.status);
    });
  };

  return (
    <>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography variant="overline" sx={{ letterSpacing: 1.1 }}>
              Your favourites
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
              {favorites.isFavorited ? "On your profile" : "Show this on your profile"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {isSignedIn
                ? `Pick up to four albums that define your profile. ${favoriteCountLabel}.`
                : "Sign up to pin up to four favourite albums to your profile."}
            </Typography>
          </Box>

          {isSignedIn ? (
            <Stack spacing={1.5} alignItems="flex-start">
              <Button
                type="button"
                variant={favorites.isFavorited ? "outlined" : "contained"}
                color={favorites.isFavorited ? "inherit" : "primary"}
                onClick={handleToggleFavorite}
                disabled={isPending}
                sx={{ borderRadius: 999, px: 2.5 }}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : favorites.isFavorited ? (
                  "Remove from favourites"
                ) : (
                  "Add to favourites"
                )}
              </Button>

              {formError ? (
                <Typography color="error" variant="body2">
                  {formError}
                </Typography>
              ) : null}
            </Stack>
          ) : (
            <Stack spacing={1.25} alignItems="flex-start">
              <Typography variant="body2" color="text.secondary">
                Make this one of the records people see first when they visit your
                profile.
              </Typography>
              <Button
                component={Link}
                href={signUpHref}
                variant="contained"
                sx={{ borderRadius: 999, px: 2.5 }}
              >
                Sign up to favourite
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>

      <FavoriteReplaceDialog
        open={dialogOpen}
        favorites={replacementFavorites}
        pending={isPending}
        errorMessage={formError}
        onClose={closeDialog}
        onSelect={handleReplace}
      />
    </>
  );
}
