import AlbumView from "@/src/components/AlbumView";
import { notFound } from "next/navigation";
import getMusicService from "@/src/lib/music/Music";
import MockData from "@/src/lib/music/testing/mockAlbumData";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  /*
    AlbumPage is the page with a specific album in mind.
    Fetches from MusicService with fallback to mock data.
  */
  const { id } = await params;

  let album = null;

  try {
    const musicService = getMusicService();
    album = await musicService.getAlbum(id);
  } catch (error) {
    console.error("Failed to fetch album from Supabase:", error);
    // Fallback to mock data
    album = MockData.find((a) => a.id === id) || null;
  }

  if (!album) notFound();

  return <AlbumView album={album} />;
}
