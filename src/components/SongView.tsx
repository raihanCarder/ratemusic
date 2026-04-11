"use client";

import { Song } from "@/src/lib/music/types";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { formatTrackDuration } from "@/src/lib/music/dailyAlbum";

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
          secondary={song.durationMs ? formatTrackDuration(song.durationMs) : undefined}
        />
      </ListItem>
      {idx !== albumLength - 1 && <Divider />}
    </Box>
  );
}
