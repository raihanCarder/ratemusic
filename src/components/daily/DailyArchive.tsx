import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { DailyAlbumEntry } from "@/src/lib/music/types";
import { formatAlbumOfDayDate } from "@/src/lib/music/dailyAlbum";

type DailyArchiveProps = {
  history: DailyAlbumEntry[];
};

export default function DailyArchive({ history }: DailyArchiveProps) {
  return (
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
        Previous picks stay in the archive so the rotation can keep moving forward
        instead of circling the same records.
      </Typography>

      {history.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{ mt: 2.5, p: 2, borderRadius: 4, bgcolor: "rgba(255,255,255,0.02)" }}
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
                <Typography variant="subtitle1" sx={{ mt: 0.25, fontWeight: 800 }}>
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
  );
}
