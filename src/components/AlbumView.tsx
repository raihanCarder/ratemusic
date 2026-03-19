"use client";

import type { AlbumData } from "@/src/lib/music/types";
import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import SongView from "./SongView";

export default function AlbumView({ album }: { album: AlbumData }) {
  /*
    AlbumView is Shown when you want a view of an album and all it's information.
  */
  const songs = album.songs ?? [];
  const albumLength = songs.length;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      {/* Cover */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Box
          sx={{
            width: 320,
            height: 320,
            position: "relative",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Image
            src={album.image}
            alt={`${album.title} by ${album.artist}`}
            fill
            sizes="320px"
            style={{ objectFit: "cover" }}
            priority
          />
        </Box>
      </Box>

      {/* Title + artist */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>
          {album.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {album.artist}
        </Typography>
      </Box>

      {/* Track list */}
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        Tracks
      </Typography>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <List disablePadding>
          {songs.length === 0 ? (
            <ListItem>
              <ListItemText primary="No tracks yet (will come from Spotify later)." />
            </ListItem>
          ) : (
            songs.map((song, idx) => (
              <SongView
                key={song.id}
                song={song}
                idx={idx}
                albumLength={albumLength}
              />
            ))
          )}
        </List>
      </Box>
    </Container>
  );
}
