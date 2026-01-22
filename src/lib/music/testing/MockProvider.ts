import { MusicProvider, AlbumPreview, AlbumData } from "../types";
import MockData from "./mockAlbumData";

export class MockProvider implements MusicProvider {
  name = "mock";
  async searchAlbums(query: string, limit?: number): Promise<AlbumPreview[]> {
    return [];
  }

  async getAlbum(providerAlbumId: string): Promise<AlbumData | null> {
    const data = MockData;

    const found = data.find((item) => item.providerAlbumId === providerAlbumId);

    return found ?? null;
  }

  async getFeaturedAlbums(amount: number): Promise<AlbumData[]> {
    return MockData.slice(0, amount);
  }
}
