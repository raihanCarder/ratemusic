// data shown from search
export type AlbumPreview = {
  provider: string;
  id: string;
  title: string;
  image: string;
  artist: string;
  releaseDate?: string | null;
};

// Song data for tracks
export type Song = {
  id: string;
  title: string;
  trackNumber?: number;
  durationMs?: number;
};

// all album data (unified for UI and music service)
export type AlbumData = AlbumPreview & {
  songs?: Song[];
  raw?: unknown | null;
};

// What AlbumData looks like in Database
export type AlbumDataInDatabase = {
  provider: string;
  provider_album_id: string;
  title: string;
  artist: string;
  album_cover: string;
  release_date: string | null;
  raw_payload: unknown | null;
};

// database with albums
export interface AlbumDatabase {
  findAlbumByProviderId(
    provider: string,
    id: string,
  ): Promise<AlbumData | null>;
  upsertAlbumFromProvider(album: AlbumData): Promise<AlbumData | null>;
  getFeaturedAlbums(amount: number, listName: string): Promise<AlbumData[]>;
  setFeaturedAlbums(albums: AlbumData[]): Promise<AlbumData[]>;
}

// Music API
export interface MusicProvider {
  name: string;
  searchAlbums(query: string, limit?: number): Promise<AlbumPreview[]>;
  getAlbum(id: string): Promise<AlbumData | null>;
  getFeaturedAlbums(amount: number): Promise<AlbumData[]>;
}
