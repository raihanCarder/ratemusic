import {
  AlbumDatabase,
  MusicProvider,
  AlbumPreview,
  AlbumData,
  DailyAlbumPageData,
} from "./types";
import {
  DAILY_ALBUM_HISTORY_LIMIT,
  DAILY_ALBUM_PROVIDER_POOL_SIZE,
  FEED_ALBUMS_AMOUNT,
} from "./constants";
import { getCurrentDailyAlbumDateKey, getDailyAlbumRank } from "./dailyAlbum";

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

    if (cachedAlbum && (cachedAlbum.songs?.length ?? 0) > 0) {
      return cachedAlbum;
    }

    const providerAlbum = await this.provider.getAlbum(id);

    if (!providerAlbum) {
      return cachedAlbum;
    }

    return (await this.db.upsertAlbumFromProvider(providerAlbum)) ?? providerAlbum;
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

  async getAlbumOfTheDayPageData(): Promise<DailyAlbumPageData | null> {
    const dateKey = getCurrentDailyAlbumDateKey();
    let today = await this.db.getDailyAlbum(dateKey);
    const latestArchivedAlbum = !today
      ? (await this.db.getDailyAlbumHistory(1))[0] ?? null
      : null;
    let providerAlbums: AlbumData[] = [];

    if (!today) {
      let candidates = await this.db.getDailyAlbumCandidates();

      if (candidates.length === 0) {
        providerAlbums = await this.provider.getFeaturedAlbums(
          DAILY_ALBUM_PROVIDER_POOL_SIZE,
        );

        if (providerAlbums.length > 0) {
          await this.db.upsertAlbumsFromProvider(providerAlbums);
          candidates = await this.db.getDailyAlbumCandidates();
        }
      }

      const selectionPool = candidates.length > 0 ? candidates : providerAlbums;
      const shuffledCandidates = shuffleAlbums(selectionPool);

      for (const candidate of shuffledCandidates) {
        today = await this.db.createDailyAlbum(dateKey, candidate);

        if (today) {
          break;
        }
      }

      if (!today) {
        today = await this.db.getDailyAlbum(dateKey);
      }

      if (!today && latestArchivedAlbum) {
        today = latestArchivedAlbum;
      }

      if (!today && shuffledCandidates.length > 0) {
        const fallbackAlbum = shuffledCandidates[0];
        today = {
          dateKey,
          createdAt: new Date().toISOString(),
          rank: getDailyAlbumRank(dateKey),
          album: fallbackAlbum,
        };
      }
    }

    if (!today) {
      return null;
    }

    const fullAlbum = (await this.getAlbum(today.album.id)) ?? today.album;
    const history = await this.db.getDailyAlbumHistory(
      DAILY_ALBUM_HISTORY_LIMIT + 1,
    );

    return {
      today: {
        ...today,
        album: fullAlbum,
      },
      history: history
        .filter((entry) => entry.dateKey !== today?.dateKey)
        .slice(0, DAILY_ALBUM_HISTORY_LIMIT),
    };
  }
}

function shuffleAlbums(albums: AlbumData[]) {
  const copy = [...albums];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = copy[index];
    copy[index] = copy[randomIndex];
    copy[randomIndex] = current;
  }

  return copy;
}
