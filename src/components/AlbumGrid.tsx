"use client";

import type { AlbumData } from "@/src/lib/music/types";
import Box from "@mui/material/Box";
import AlbumCard from "./AlbumCard";
import Link from "next/link";

type AlbumGridProps = { albums: AlbumData[] };

export default function AlbumGrid({ albums }: AlbumGridProps) {
  /*
    Grid view shown on Discovery Page. Each AlbumCard surrounded with Link that let's
    user go straight to a page with that album. Link uses album id to create link to 
    seperate page.
  */

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
            <Link key={album.id} href={`/album/${album.id}`}>
              <AlbumCard album={album} />
            </Link>
          ))}
        </Box>
      </Box>
    </main>
  );
}
