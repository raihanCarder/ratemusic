import { AlbumDatabase, MusicProvider, AlbumPreview, AlbumData } from "./types";

const FEED_ALBUMS_AMOUNT = 25;

export class MusicService {
  constructor(
    private provider: MusicProvider,
    private db: AlbumDatabase,
  ) {}

  async searchAlbums(query: string, limit = 5): Promise<AlbumPreview[] | null> {
    return this.provider.searchAlbums(query, limit);
  }

  async getAlbum(providerAlbumId: string): Promise<AlbumData | null> {
    const cachedAlbum = await this.db.findAlbumByProviderId(
      this.provider.name,
      providerAlbumId,
    );

    if (cachedAlbum) {
      return cachedAlbum;
    }

    const newAlbum = await this.provider.getAlbum(providerAlbumId);

    if (!newAlbum) return null;

    return this.db.upsertAlbumFromProvider(newAlbum);
  }

  async getFeedAlbums(amount = FEED_ALBUMS_AMOUNT): Promise<AlbumData[]> {
    const cachedFeedAlbums = await this.db.getFeaturedAlbums(amount, "feed");

    if (cachedFeedAlbums.length >= amount) {
      return cachedFeedAlbums.slice(0, amount);
    }

    // initialize albums once

    const initalizedAlbumsForFeed =
      await this.provider.getFeaturedAlbums(amount);

    const feedAlbums = await this.db.setFeaturedAlbums(initalizedAlbumsForFeed);

    return feedAlbums;
  }
}
