// data shown from search
export type AlbumPreview = {
  provider: string;
  providerAlbumId: string;
  title: string;
  albumCover: string;
  artist: string;
  releaseDate?: string | null;
};

// all album data

export type AlbumData = AlbumPreview & {
  tracks?: { name: string; trackNumber?: number; durationMs?: number }[];
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
    providerAlbumId: string,
  ): Promise<AlbumData | null>;
  upsertAlbumFromProvider(album: AlbumData): Promise<AlbumData | null>;
  getFeaturedAlbums(amount: number, listName: string): Promise<AlbumData[]>;
  setFeaturedAlbums(albums: AlbumData[]): Promise<AlbumData[]>;
}

// Music API
export interface MusicProvider {
  name: string;
  searchAlbums(query: string, limit?: number): Promise<AlbumPreview[]>;
  getAlbum(providerAlbumId: string): Promise<AlbumData | null>;
  getFeaturedAlbums(amount: number): Promise<AlbumData[]>;
}
