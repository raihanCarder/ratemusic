import { AlbumData } from "../types";
import sampleData from "./sampleData";

const MockData: AlbumData[] = sampleData.map((a) => ({
  provider: "mock",
  providerAlbumId: `mock-${a.id}`,
  title: a.title,
  albumCover: a.image,
  artist: a.artist,
  releaseDate: "00/00/0000",
  tracks: a.songs?.map((s, i) => ({
    name: s.title,
    trackNumber: i + 1,
    durationMs: s.durationMs,
  })),
}));

export default MockData;
