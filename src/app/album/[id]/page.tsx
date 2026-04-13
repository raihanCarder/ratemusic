import AlbumView from "@/src/components/AlbumView";
import { buildAuthHref } from "@/src/lib/auth/next";
import { getUser } from "@/src/auth/server";
import { notFound } from "next/navigation";
import getMusicService from "@/src/lib/music/Music";
import { getAlbumFavoritesPageData } from "@/src/lib/favorites/server";
import { getAlbumRatingsPageData } from "@/src/lib/reviews/server";
import MockData from "@/src/lib/music/testing/mockAlbumData";
import { logger } from "@/src/lib/logger";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let album = null;

  try {
    const musicService = getMusicService();
    album = await musicService.getAlbum(id);
  } catch (error) {
    logger.error("Failed to fetch album:", error);
    album = MockData.find((a) => a.id === id) || null;
  }

  if (!album) notFound();

  const user = await getUser();
  const [favorites, ratings] = await Promise.all([
    getAlbumFavoritesPageData(album, user?.id ?? null),
    getAlbumRatingsPageData(album, user?.id ?? null),
  ]);

  return (
    <AlbumView
      album={album}
      favorites={favorites}
      ratings={ratings}
      isSignedIn={Boolean(user)}
      signUpHref={buildAuthHref("/signup", `/album/${id}`)}
    />
  );
}
