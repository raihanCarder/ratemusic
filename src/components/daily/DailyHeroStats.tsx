import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { AlbumData, Song } from "@/src/lib/music/types";
import { formatAlbumReleaseDate, getAlbumRuntimeLabel } from "@/src/lib/music/dailyAlbum";

type DailyHeroStatsProps = {
  album: AlbumData;
  songs: Song[];
};

export default function DailyHeroStats({ album, songs }: DailyHeroStatsProps) {
  const items = [
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
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(2, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
        },
        gap: 1.5,
        mt: 3,
      }}
    >
      {items.map((item) => (
        <Paper
          key={item.label}
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
            {item.label}
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.75, fontWeight: 700, color: "white" }}>
            {item.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
