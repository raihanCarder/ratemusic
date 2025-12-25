"use client";

import type { Album } from "@/types/album";
import Box from "@mui/material/Box";
import AlbumCard from "./AlbumCard";
type AlbumGridProps = { albums: Album[] };

export default function AlbumGrid({ albums }: AlbumGridProps) {
  return (
    <main>
      <Box
        sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 3, overflowX: "hidden" }}
      >
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            width: "100%",
            overflowX: "hidden",
          }}
        >
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </Box>
      </Box>
    </main>
  );
}
