import { AlbumDatabase, MusicProvider, AlbumPreview, AlbumData } from "./types";
import { FEED_ALBUMS_AMOUNT } from "./constants";

export class MusicService {
  constructor(
    private provider: MusicProvider,
    private db: AlbumDatabase,
  ) {}

  async searchAlbums(query: string, limit = 5): Promise<AlbumPreview[] | null> {
    return this.provider.searchAlbums(query, limit);
  }

  async getAlbum(id: string): Promise<AlbumData | null> {
    const cachedAlbum = await this.db.findAlbumByProviderId(
      this.provider.name,
      id,
    );

    if (cachedAlbum) {
      return cachedAlbum;
    }

    const newAlbum = await this.provider.getAlbum(id);

    if (!newAlbum) return null;

    return this.db.upsertAlbumFromProvider(newAlbum);
  }

  async getCachedFeedAlbums(amount = FEED_ALBUMS_AMOUNT): Promise<AlbumData[]> {
    return this.db.getFeaturedAlbums(amount, "feed");
  }

  async refreshFeedAlbums(amount = FEED_ALBUMS_AMOUNT): Promise<AlbumData[]> {
    const initializedAlbumsForFeed = await this.provider.getFeaturedAlbums(
      amount,
    );

    return this.db.setFeaturedAlbums(initializedAlbumsForFeed);
  }

  async getFeedAlbums(amount = FEED_ALBUMS_AMOUNT): Promise<AlbumData[]> {
    const cachedFeedAlbums = await this.getCachedFeedAlbums(amount);

    if (cachedFeedAlbums.length >= amount) {
      return cachedFeedAlbums.slice(0, amount);
    }

    return this.refreshFeedAlbums(amount);
  }
}
