import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { AlbumRatingsPageData } from "@/src/lib/reviews/types";

type DailyHeroRatingsProps = {
  ratings: AlbumRatingsPageData;
  isSignedIn: boolean;
  signUpHref: string;
};

export default function DailyHeroRatings({
  ratings,
  isSignedIn,
  signUpHref,
}: DailyHeroRatingsProps) {
  const communityScore =
    ratings.summary.averageRating === null
      ? "No ratings yet"
      : `${ratings.summary.averageRating.toFixed(2)} / 10`;

  const ratingCountLabel =
    ratings.summary.ratingCount === 0
      ? null
      : `${ratings.summary.ratingCount} rating${ratings.summary.ratingCount === 1 ? "" : "s"}`;

  const yourRatingValue = ratings.currentUserRating
    ? `${ratings.currentUserRating.rating} / 10`
    : isSignedIn
      ? "Not rated yet"
      : "Sign in to rate";

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 1.5,
        mt: 3,
      }}
    >
      <Paper
        sx={{
          p: 2,
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.08)",
          bgcolor: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Typography
          variant="caption"
          sx={{ textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)" }}
        >
          Community
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.75, fontWeight: 700, color: "white" }}>
          {communityScore}
        </Typography>
        {ratingCountLabel && (
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>
            {ratingCountLabel}
          </Typography>
        )}
      </Paper>

      <Paper
        sx={{
          p: 2,
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.08)",
          bgcolor: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Typography
          variant="caption"
          sx={{ textTransform: "uppercase", letterSpacing: 1, color: "rgba(255,255,255,0.5)" }}
        >
          Your rating
        </Typography>
        <Typography variant="body1" sx={{ mt: 0.75, fontWeight: 700, color: "white" }}>
          {yourRatingValue}
        </Typography>
        {!isSignedIn && (
          <Link href={signUpHref} style={{ textDecoration: "none" }}>
            <Typography variant="caption" sx={{ color: "rgba(126, 241, 164, 0.8)" }}>
              Create account →
            </Typography>
          </Link>
        )}
      </Paper>
    </Box>
  );
}
