import Image from "next/image";
import Box from "@mui/material/Box";
import type { AlbumData } from "@/src/lib/music/types";

type DailyHeroCoverProps = {
  album: AlbumData;
};

export default function DailyHeroCover({ album }: DailyHeroCoverProps) {
  return (
    <Box sx={{ mx: { xs: "auto", lg: 0 }, width: "100%", maxWidth: 360 }}>
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
  );
}
