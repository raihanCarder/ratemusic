import sampleData from "./sampleData";
import AlbumGrid from "@/components/AlbumGrid";

export default function AlbumFeed() {
  /* 
    Discovery Page
  */
  return (
    <>
      <AlbumGrid albums={sampleData} />
    </>
  );
}
