import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { Song } from "@/src/lib/music/types";
import { formatTrackDuration } from "@/src/lib/music/dailyAlbum";

const TRACK_DISPLAY_LIMIT = 8;

type DailyTrackSpotlightProps = {
  songs: Song[];
};

export default function DailyTrackSpotlight({ songs }: DailyTrackSpotlightProps) {
  return (
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
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25, maxWidth: 700 }}>
        Today&apos;s page is already set up to carry the album and song-level
        conversation. Ratings, notes, and deeper commentary can slot into this
        structure later without rethinking the layout.
      </Typography>

      <Box sx={{ mt: 2.5, display: "grid", gap: 1 }}>
        {songs.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 4, bgcolor: "rgba(255,255,255,0.02)" }}
          >
            <Typography variant="body2" color="text.secondary">
              Track data will appear here as richer provider metadata comes in.
            </Typography>
          </Paper>
        ) : (
          songs.slice(0, TRACK_DISPLAY_LIMIT).map((song, index) => (
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
  );
}
