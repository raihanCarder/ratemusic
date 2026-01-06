"use client";

import { Album } from "@/types/album";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Box from "@mui/material/Box";
import Image from "next/image";

type AlbumCardProps = { album: Album };

export default function AlbumCard({ album }: AlbumCardProps) {
  /*
    AlbumCard are Card's shown on Discovery page that represent each album.
    Information shown includes image, name, and artist,
  */
  return (
    <Box
      key={album.id}
      sx={{
        minWidth: 0,
        cursor: "pointer",
        transition: "transform 140ms ease, filter 140ms ease",
        "&:hover img": { filter: "brightness(0.92)" },
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          aspectRatio: "1 / 1",
          overflow: "hidden",
          borderRadius: 1.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            width: "100%",
            aspectRatio: "1 / 1",
            position: "relative",
            overflow: "hidden",
            borderRadius: 1.5,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Image
            src={album.image}
            alt={`${album.title} by ${album.artist}`}
            fill
            sizes="(min-width: 1200px) 20vw, (min-width: 900px) 25vw, 33vw"
            style={{
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>

      <ImageListItemBar
        title={album.title}
        subtitle={album.artist}
        position="below"
        sx={{
          px: 0,
          mt: 1,
          ".MuiImageListItemBar-title": {
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          },
          ".MuiImageListItemBar-subtitle": {
            fontSize: 12.5,
            opacity: 0.75,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          },
        }}
      />
    </Box>
  );
}
