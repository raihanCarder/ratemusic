import AlbumGrid from "@/src/components/AlbumGrid";
import getMusicService from "@/src/lib/music/Music";
import MockData from "@/src/lib/music/testing/mockAlbumData";

export default async function AlbumFeed() {
  /* 
    Discovery Page
    
    Fetches featured albums from MusicService, which abstracts:
    - The music provider (Spotify, Mock, etc.)
    - The caching layer (Supabase)
    
    Falls back to mock data if Supabase fails.
  */
  let albums = MockData;

  try {
    const musicService = getMusicService();
    const fetchedAlbums = await musicService.getFeedAlbums();
    if (fetchedAlbums.length > 0) {
      albums = fetchedAlbums;
    }
  } catch (error) {
    console.error(
      "Failed to fetch albums from Supabase, using mock data:",
      error,
    );
    // Fallback to MockData (already set above)
  }

  return (
    <>
      <AlbumGrid albums={albums} />
    </>
  );
}
