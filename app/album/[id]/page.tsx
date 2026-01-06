import sampleData from "@/app/feed/sampleData";
import AlbumView from "@/components/AlbumView";
import { notFound } from "next/navigation";

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  /*
    AlbumPage is the page with a specific album in mind. 
  */
  const { id } = await params;

  const album = sampleData.find((album) => album.id === id);
  if (!album) notFound();

  return <AlbumView album={album} />;
}
