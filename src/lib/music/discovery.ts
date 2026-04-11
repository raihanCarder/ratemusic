import { unstable_cache } from "next/cache";
import getMusicService from "./Music";
import MockData from "./testing/mockAlbumData";
import { logger } from "@/src/lib/logger";
import {
  DISCOVERY_FEED_CACHE_TAG,
  DISCOVERY_FEED_REVALIDATE_SECONDS,
  FEED_ALBUMS_AMOUNT,
} from "./constants";

const getCachedDiscoveryAlbums = unstable_cache(
  async (amount: number) => {
    const musicService = getMusicService();
    return musicService.getCachedFeedAlbums(amount);
  },
  ["discovery-feed"],
  {
    revalidate: DISCOVERY_FEED_REVALIDATE_SECONDS,
    tags: [DISCOVERY_FEED_CACHE_TAG],
  },
);

export async function getDiscoveryAlbums(amount = FEED_ALBUMS_AMOUNT) {
  try {
    const albums = await getCachedDiscoveryAlbums(amount);

    if (albums.length >= amount) {
      return albums;
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error reading cached discovery feed:", error);
    }
  }

  try {
    const musicService = getMusicService();
    const refreshedAlbums = await musicService.refreshFeedAlbums(amount);

    if (refreshedAlbums.length > 0) {
      return refreshedAlbums.slice(0, amount);
    }
  } catch (error) {
    logger.error("Error refreshing discovery feed:", error);
  }

  return MockData.slice(0, amount);
}
