import { AlbumData } from "../types";
import sampleData from "./sampleData";

const MockData: AlbumData[] = sampleData.map((a) => ({
  provider: "mock",
  id: `mock-${a.id}`,
  title: a.title,
  image: a.image,
  artist: a.artist,
  releaseDate: null,
  songs: a.songs?.map((s, i) => ({
    id: `${a.id}-${i}`,
    title: s.title,
    trackNumber: i + 1,
    durationMs: s.durationMs,
  })),
}));

export default MockData;
