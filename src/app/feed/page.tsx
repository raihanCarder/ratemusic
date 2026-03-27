import AlbumGrid from "@/src/components/AlbumGrid";
import { getDiscoveryAlbums } from "@/src/lib/music/discovery";

export default async function AlbumFeed() {
  const albums = await getDiscoveryAlbums();

  return <AlbumGrid albums={albums} />;
}
