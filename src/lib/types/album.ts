import type { Song } from "./song";

export type Album = {
  id: string;
  title: string;
  artist: string;
  image: string;
  songs?: Song[];
};
