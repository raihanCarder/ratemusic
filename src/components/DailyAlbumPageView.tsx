import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { DailyAlbumPageData } from "@/src/lib/music/types";
import {
  formatAlbumOfDayDate,
  formatAlbumReleaseDate,
  formatTrackDuration,
  getAlbumRuntimeLabel,
} from "@/src/lib/music/dailyAlbum";

type DailyAlbumPageViewProps = {
  dailyAlbum: DailyAlbumPageData;
};

export default function DailyAlbumPageView({
  dailyAlbum,
}: DailyAlbumPageViewProps) {
  const { today, history } = dailyAlbum;
  const album = today.album;
  const songs = album.songs ?? [];
  const runtimeLabel = getAlbumRuntimeLabel(songs);

  const primaryStats = [
    { label: "Artist", value: album.artist },
    {
      label: "Released",
      value: formatAlbumReleaseDate(album.releaseDate),
    },
    {
      label: "Tracklist",
      value: songs.length > 0 ? `${songs.length} tracks` : "Track info loading",
    },
    { label: "Runtime", value: runtimeLabel },
  ];

  return (
    <Box component="main" sx={{ pb: { xs: 6, md: 9 } }}>
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
            <Box
              sx={{
                mx: { xs: "auto", lg: 0 },
                width: "100%",
                maxWidth: 360,
              }}
            >
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

            <Box>
              <Chip
                label={`Album of the Day • ${formatAlbumOfDayDate(today.dateKey)}`}
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
                sx={{
                  mt: 1.25,
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 500,
                }}
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
                does not get picked again unless the catalog ever runs dry. This page
                is the living front page for that rotation.
              </Typography>

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
                {primaryStats.map((stat) => (
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

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ mt: 3 }}
              >
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

                <Link
                  href="/"
                  style={{ textDecoration: "none", width: "fit-content" }}
                >
                  <Button
                    component="span"
                    variant="outlined"
                    sx={{
                      borderRadius: 999,
                      px: 2.75,
                      py: 1.25,
                      fontWeight: 700,
                    }}
                  >
                    Back to discovery
                  </Button>
                </Link>
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "1.25fr 0.9fr" },
            gap: 3,
          }}
        >
          <Box sx={{ display: "grid", gap: 3 }}>
            <Paper
              sx={{
                p: { xs: 2.25, md: 3 },
                borderRadius: 5,
                border: "1px solid",
                borderColor: "divider",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Track spotlight
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.25, maxWidth: 700 }}
              >
                Today&apos;s page is already set up to carry the album and song-level
                conversation. Ratings, notes, and deeper commentary can slot into this
                structure later without rethinking the layout.
              </Typography>

              <Box sx={{ mt: 2.5, display: "grid", gap: 1 }}>
                {songs.length === 0 ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      bgcolor: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Track data will appear here as richer provider metadata comes in.
                    </Typography>
                  </Paper>
                ) : (
                  songs.slice(0, 8).map((song, index) => (
                    <Box
                      key={song.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "40px minmax(0, 1fr) auto",
                        gap: 1.5,
                        alignItems: "center",
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.5)", fontWeight: 700 }}
                      >
                        {String(song.trackNumber ?? index + 1).padStart(2, "0")}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {song.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatTrackDuration(song.durationMs) ?? "--:--"}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Paper>

            <Paper
              sx={{
                p: { xs: 2.25, md: 3 },
                borderRadius: 5,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Daily archive
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
                Previous picks stay in the archive so the rotation can keep moving
                forward instead of circling the same records.
              </Typography>

              {history.length === 0 ? (
                <Paper
                  variant="outlined"
                  sx={{
                    mt: 2.5,
                    p: 2,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No archive entries yet. Today&apos;s album is opening night.
                  </Typography>
                </Paper>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, minmax(0, 1fr))",
                      lg: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 2,
                    mt: 2.5,
                  }}
                >
                  {history.map((entry) => (
                    <Link
                      key={`${entry.dateKey}-${entry.album.id}`}
                      href={`/album/${entry.album.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Paper
                        sx={{
                          p: 1.5,
                          height: "100%",
                          borderRadius: 4,
                          border: "1px solid rgba(255,255,255,0.08)",
                          bgcolor: "rgba(255,255,255,0.02)",
                          transition: "transform 140ms ease, border-color 140ms ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            borderColor: "rgba(126, 241, 164, 0.32)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "1 / 1",
                            borderRadius: 3,
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={entry.album.image}
                            alt={`${entry.album.title} by ${entry.album.artist}`}
                            fill
                            sizes="(max-width: 900px) 50vw, 240px"
                            style={{ objectFit: "cover" }}
                          />
                        </Box>
                        <Typography
                          variant="overline"
                          sx={{
                            display: "block",
                            mt: 1.25,
                            color: "rgba(126, 241, 164, 0.7)",
                            letterSpacing: 1.1,
                          }}
                        >
                          {formatAlbumOfDayDate(entry.dateKey)}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{ mt: 0.25, fontWeight: 800 }}
                        >
                          {entry.album.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {entry.album.artist}
                        </Typography>
                      </Paper>
                    </Link>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>

          <Box sx={{ display: "grid", gap: 3 }}>
            <Paper
              sx={{
                p: { xs: 2.25, md: 3 },
                borderRadius: 5,
                border: "1px solid",
                borderColor: "divider",
                background:
                  "linear-gradient(180deg, rgba(121, 233, 156, 0.08), rgba(255,255,255,0.01))",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Scoreboard
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
                This block is ready for average rating, review count, and daily
                discussion once the review layer is connected.
              </Typography>

              <Divider sx={{ my: 2.5 }} />

              <Stack spacing={1.5}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Community score
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 900 }}>
                    Pending
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Review status
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 700 }}>
                    Ready for ratings and notes
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            <Paper
              sx={{
                p: { xs: 2.25, md: 3 },
                borderRadius: 5,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                About the ritual
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.25, lineHeight: 1.8 }}
              >
                Music4You is aiming for the same kind of daily pull that Letterboxd
                gives film lovers: a visible taste profile, a social record of what
                matters, and a reason to come back each day for one more recommendation.
                Album of the Day is the editorial anchor for that.
              </Typography>

              <Box sx={{ mt: 2.5, display: "grid", gap: 1.25 }}>
                {[
                  "One album is selected and locked for the full Toronto day.",
                  "Selections are archived in a dedicated featured list so they can be revisited later.",
                  "Albums already in the archive are skipped on future days until the catalog runs out.",
                ].map((line) => (
                  <Box
                    key={line}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      bgcolor: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <Typography variant="body2">{line}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
