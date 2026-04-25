import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { AlbumData } from "@/src/lib/music/types";
import type { AlbumRatingsPageData } from "@/src/lib/reviews/types";
import { formatAlbumOfDayDate } from "@/src/lib/music/dailyAlbum";
import DailyHeroCover from "./DailyHeroCover";
import DailyHeroStats from "./DailyHeroStats";
import DailyHeroRatings from "./DailyHeroRatings";

type DailyAlbumHeroProps = {
  album: AlbumData;
  dateKey: string;
  ratings: AlbumRatingsPageData;
  isSignedIn: boolean;
  signUpHref: string;
};

export default function DailyAlbumHero({
  album,
  dateKey,
  ratings,
  isSignedIn,
  signUpHref,
}: DailyAlbumHeroProps) {
  const songs = album.songs ?? [];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid",
        borderColor: "divider",
        background:
          "radial-gradient(circle at top left, rgba(126, 241, 164, 0.28), rgba(9, 9, 9, 0) 35%), radial-gradient(circle at top right, rgba(255, 119, 87, 0.18), rgba(9, 9, 9, 0) 28%), linear-gradient(180deg, #131313 0%, #090909 72%)",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "360px minmax(0, 1fr)" },
            gap: { xs: 3, md: 4 },
            alignItems: "center",
          }}
        >
          <DailyHeroCover album={album} />

          <Box>
            <Chip
              label={`Album of the Day • ${formatAlbumOfDayDate(dateKey)}`}
              sx={{
                bgcolor: "rgba(126, 241, 164, 0.16)",
                color: "rgb(202, 255, 216)",
                borderRadius: 999,
                fontWeight: 700,
              }}
            />

            <Typography
              variant="h2"
              sx={{
                mt: 2,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                fontSize: { xs: "2.8rem", md: "4.8rem" },
              }}
            >
              {album.title}
            </Typography>

            <Typography
              variant="h5"
              sx={{ mt: 1.25, color: "rgba(255,255,255,0.72)", fontWeight: 500 }}
            >
              {album.artist}
            </Typography>

            <Typography
              variant="body1"
              sx={{ mt: 2.5, maxWidth: 760, color: "rgba(255,255,255,0.76)", lineHeight: 1.7 }}
            >
              Music4You&apos;s daily ritual is simple: one record gets the spotlight,
              it stays pinned for the Toronto day, and once it enters the archive it
              does not get picked again unless the catalog ever runs dry. This page is
              the living front page for that rotation.
            </Typography>

            <DailyHeroStats album={album} songs={songs} />

            <DailyHeroRatings ratings={ratings} isSignedIn={isSignedIn} signUpHref={signUpHref} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
              <Link
                href={`/album/${album.id}`}
                style={{ textDecoration: "none", width: "fit-content" }}
              >
                <Button
                  component="span"
                  variant="contained"
                  sx={{
                    borderRadius: 999,
                    px: 2.75,
                    py: 1.25,
                    fontWeight: 700,
                    bgcolor: "rgb(121, 233, 156)",
                    color: "black",
                  }}
                >
                  Open album page
                </Button>
              </Link>

              <Link href="/" style={{ textDecoration: "none", width: "fit-content" }}>
                <Button
                  component="span"
                  variant="outlined"
                  sx={{ borderRadius: 999, px: 2.75, py: 1.25, fontWeight: 700 }}
                >
                  Back to discovery
                </Button>
              </Link>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
