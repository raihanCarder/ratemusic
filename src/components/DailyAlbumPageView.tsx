import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { DailyAlbumPageData } from "@/src/lib/music/types";
import DailyAlbumHero from "./daily/DailyAlbumHero";
import DailyTrackSpotlight from "./daily/DailyTrackSpotlight";
import DailyArchive from "./daily/DailyArchive";
import DailyRightColumn from "./daily/DailyRightColumn";

type DailyAlbumPageViewProps = {
  dailyAlbum: DailyAlbumPageData;
};

export default function DailyAlbumPageView({ dailyAlbum }: DailyAlbumPageViewProps) {
  const { today, history } = dailyAlbum;
  const songs = today.album.songs ?? [];

  return (
    <Box component="main" sx={{ pb: { xs: 6, md: 9 } }}>
      <DailyAlbumHero album={today.album} dateKey={today.dateKey} />

      <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "1.25fr 0.9fr" },
            gap: 3,
          }}
        >
          <Box sx={{ display: "grid", gap: 3 }}>
            <DailyTrackSpotlight songs={songs} />
            <DailyArchive history={history} />
          </Box>

          <DailyRightColumn />
        </Box>
      </Container>
    </Box>
  );
}
