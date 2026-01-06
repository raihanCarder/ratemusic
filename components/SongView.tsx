import { Song } from "@/types/song";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

type SongViewProps = {
  idx: number;
  song: Song;
  albumLength: number;
};

export default function SongView({ idx, song, albumLength }: SongViewProps) {
  /*
    Song design for each song shown on AlbumView.
  */
  return (
    <Box key={song.id}>
      <ListItem>
        <ListItemText
          primary={`${idx + 1}. ${song.title}`}
          secondary={song.durationMs ? formatMs(song.durationMs) : undefined}
        />
      </ListItem>
      {idx !== albumLength - 1 && <Divider />}
    </Box>
  );
}

function formatMs(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
