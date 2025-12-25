import sampleData from "./sampleData";
import AlbumGrid from "@/components/AlbumGrid";

export default function Page() {
  return (
    <>
      <AlbumGrid albums={sampleData} />
    </>
  );
}
