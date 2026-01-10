import sampleData from "./sampleData";
import AlbumGrid from "@/src/components/AlbumGrid";

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
