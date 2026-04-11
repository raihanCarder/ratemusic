import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { AlbumData } from "@/src/lib/music/types";
import {
  formatAlbumOfDayDate,
  formatAlbumReleaseDate,
  getAlbumRuntimeLabel,
} from "@/src/lib/music/dailyAlbum";

type DailyAlbumHeroProps = {
  album: AlbumData;
  dateKey: string;
};

export default function DailyAlbumHero({ album, dateKey }: DailyAlbumHeroProps) {
  const songs = album.songs ?? [];

  const stats = [
    { label: "Artist", value: album.artist },
    { label: "Released", value: formatAlbumReleaseDate(album.releaseDate) },
    {
      label: "Tracklist",
      value: songs.length > 0 ? `${songs.length} tracks` : "Track info loading",
    },
    { label: "Runtime", value: getAlbumRuntimeLabel(songs) },
  ];

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
          {/* Cover */}
          <Box sx={{ mx: { xs: "auto", lg: 0 }, width: "100%", maxWidth: 360 }}>
            <Box
              sx={{
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: 6,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 28px 80px rgba(0, 0, 0, 0.45)",
              }}
            >
              <Image
                src={album.image}
                alt={`${album.title} by ${album.artist}`}
                fill
                priority
                sizes="(max-width: 1200px) 90vw, 360px"
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Box>

          {/* Info */}
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
              sx={{
                mt: 2.5,
                maxWidth: 760,
                color: "rgba(255,255,255,0.76)",
                lineHeight: 1.7,
              }}
            >
              Music4You&apos;s daily ritual is simple: one record gets the spotlight,
              it stays pinned for the Toronto day, and once it enters the archive it
              does not get picked again unless the catalog ever runs dry. This page is
              the living front page for that rotation.
            </Typography>

            {/* Stats */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(4, minmax(0, 1fr))",
                },
                gap: 1.5,
                mt: 3,
              }}
            >
              {stats.map((stat) => (
                <Paper
                  key={stat.label}
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
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mt: 0.75, fontWeight: 700, color: "white" }}
                  >
                    {stat.value}
                  </Typography>
                </Paper>
              ))}
            </Box>

            {/* CTAs */}
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
