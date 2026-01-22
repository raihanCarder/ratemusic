import { AlbumData, AlbumPreview, MusicProvider } from "./types";

export class Spotify implements MusicProvider {
  name = "spotify";
  async searchAlbums(query: string, limit?: number): Promise<AlbumPreview[]> {
    return [];
  }

  async getAlbum(providerAlbumId: string): Promise<AlbumData | null> {
    return null;
  }

  async getFeaturedAlbums(amount: number): Promise<AlbumData[]> {
    return [];
  }
}
