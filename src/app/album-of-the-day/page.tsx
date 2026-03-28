import type { Metadata } from "next";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import DailyAlbumPageView from "@/src/components/DailyAlbumPageView";
import getMusicService from "@/src/lib/music/Music";

export const metadata: Metadata = {
  title: "Album of the Day | Music4You",
  description: "A stored daily album rotation for Music4You.",
};

export const dynamic = "force-dynamic";

export default async function DailyAlbumPage() {
  const musicService = getMusicService();
  const dailyAlbum = await musicService.getAlbumOfTheDayPageData();

  if (!dailyAlbum) {
    return (
      <Box component="main" sx={{ py: 6 }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 4,
              borderRadius: 5,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Album of the Day is not ready yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5 }}>
              The app could not find a stored catalog to pull from. Load some albums
              into the discovery feed first, then come back here and the daily archive
              will start building itself.
            </Typography>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                component="span"
                variant="contained"
                sx={{ mt: 3, borderRadius: 999, px: 2.5 }}
              >
                Go to discovery
              </Button>
            </Link>
          </Paper>
        </Container>
      </Box>
    );
  }

  return <DailyAlbumPageView dailyAlbum={dailyAlbum} />;
}
