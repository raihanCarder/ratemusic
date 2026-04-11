"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { submitAlbumRatingAction } from "@/src/actions/reviews";
import type {
  AlbumRatingsPageData,
  RateableAlbumData,
} from "@/src/lib/reviews/types";

const RATING_OPTIONS = Array.from({ length: 10 }, (_, index) => index + 1);

type AlbumRatingSectionProps = {
  album: RateableAlbumData;
  ratings: AlbumRatingsPageData;
  isSignedIn: boolean;
  signUpHref: string;
};

export default function AlbumRatingSection({
  album,
  ratings,
  isSignedIn,
  signUpHref,
}: AlbumRatingSectionProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(
    ratings.currentUserRating ? String(ratings.currentUserRating.rating) : "",
  );
  const [isPending, startTransition] = useTransition();
  const hasExistingRating = ratings.currentUserRating !== null;

  const averageLabel =
    ratings.summary.averageRating === null
      ? "No ratings yet"
      : ratings.summary.averageRating.toFixed(2);
  const ratingCountLabel =
    ratings.summary.ratingCount === 0
      ? "Be the first to rate this album."
      : `${ratings.summary.ratingCount} rating${
          ratings.summary.ratingCount === 1 ? "" : "s"
        }`;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsedRating = Number.parseInt(selectedRating, 10);

    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 10) {
      setFormError("Choose a whole-number rating from 1 to 10.");
      return;
    }

    startTransition(async () => {
      const { errorMessage } = await submitAlbumRatingAction({
        ...album,
        rating: parsedRating,
      });

      if (errorMessage) {
        setFormError(errorMessage);
        return;
      }

      toast.success(hasExistingRating ? "Rating updated." : "Rating saved.");
      router.refresh();
    });
  };

  return (
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
            Community score
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            {averageLabel}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {ratingCountLabel}
          </Typography>
        </Box>

        {isSignedIn ? (
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={1.5}>
              <Typography variant="subtitle1" fontWeight={700}>
                {hasExistingRating ? "Update your rating" : "Rate this album"}
              </Typography>

              <TextField
                select
                label="Your rating"
                fullWidth
                value={selectedRating}
                onChange={(event) => setSelectedRating(event.target.value)}
                disabled={isPending}
                helperText={
                  hasExistingRating
                    ? `Current saved rating: ${ratings.currentUserRating?.rating}/10`
                    : "Choose a whole-number score from 1 to 10."
                }
              >
                <MenuItem value="" disabled>
                  Select a score
                </MenuItem>
                {RATING_OPTIONS.map((rating) => (
                  <MenuItem key={rating} value={String(rating)}>
                    {rating}/10
                  </MenuItem>
                ))}
              </TextField>

              {formError ? (
                <Typography color="error" variant="body2">
                  {formError}
                </Typography>
              ) : null}

              <Button
                type="submit"
                variant="contained"
                sx={{ alignSelf: "flex-start", borderRadius: 999, px: 2.5 }}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : hasExistingRating ? (
                  "Update rating"
                ) : (
                  "Save rating"
                )}
              </Button>
            </Stack>
          </Box>
        ) : (
          <Stack spacing={1.25} alignItems="flex-start">
            <Typography variant="body2" color="text.secondary">
              Sign up to add your own rating and keep it on your account.
            </Typography>
            <Button
              component={Link}
              href={signUpHref}
              variant="contained"
              sx={{ borderRadius: 999, px: 2.5 }}
            >
              Sign up to rate
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
