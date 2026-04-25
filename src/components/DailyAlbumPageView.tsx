import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import type { DailyAlbumPageData } from "@/src/lib/music/types";
import type { AlbumRatingsPageData } from "@/src/lib/reviews/types";
import DailyAlbumHero from "./daily/DailyAlbumHero";
import DailyTrackSpotlight from "./daily/DailyTrackSpotlight";
import DailyArchive from "./daily/DailyArchive";

type DailyAlbumPageViewProps = {
  dailyAlbum: DailyAlbumPageData;
  ratings: AlbumRatingsPageData;
  isSignedIn: boolean;
  signUpHref: string;
};

export default function DailyAlbumPageView({
  dailyAlbum,
  ratings,
  isSignedIn,
  signUpHref,
}: DailyAlbumPageViewProps) {
  const { today, history } = dailyAlbum;
  const songs = today.album.songs ?? [];

  return (
    <Box component="main" sx={{ pb: { xs: 6, md: 9 } }}>
      <DailyAlbumHero
        album={today.album}
        dateKey={today.dateKey}
        ratings={ratings}
        isSignedIn={isSignedIn}
        signUpHref={signUpHref}
      />

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
        </Box>
      </Container>
    </Box>
  );
}
