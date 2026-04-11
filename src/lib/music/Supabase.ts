import { createSupabaseAdmin } from "@/src/auth/admin";
import { createSupabaseServer } from "@/src/auth/server";
import type { AlbumData, AlbumDatabase, DailyAlbumEntry } from "./types";
import {
  createOrGetFeaturedListQuery,
  getAlbumDataFromProviderIdQuery,
  getFeaturedAlbumsQuery,
  getFeaturedListItemsQuery,
  upsertAlbumsToDatabaseQuery,
} from "./supabaseQueries";
import {
  DAILY_ALBUM_LIST_SLUG,
  DAILY_ALBUM_LIST_TITLE,
  FEED_ALBUMS_AMOUNT,
} from "./constants";
import { getDailyAlbumRank } from "./dailyAlbum";
import {
  type AlbumRowWithId,
  type FeaturedListItemRow,
  getJoinedAlbumRow,
  mapAlbumDataToDatabaseRow,
  mapDatabaseRowToAlbumData,
  mapFeaturedListItemRowToDailyAlbumEntry,
} from "./mappers";
import {
  formatSupabaseError,
  isUniqueViolationError,
} from "@/src/lib/db/errors";
import { logger } from "@/src/lib/logger";

const DAILY_HISTORY_FETCH_LIMIT = 5000;

export class Supabase implements AlbumDatabase {
  async findAlbumByProviderId(provider: string, id: string): Promise<AlbumData | null> {
    try {
      const db = await createSupabaseServer();
      const { data, error } = await getAlbumDataFromProviderIdQuery({ db, provider, id });

      if (error) {
        logger.error(
          "Error fetching album by provider ID:",
          formatSupabaseError(error),
        );
        return null;
      }

      if (!data) return null;

      return mapDatabaseRowToAlbumData(data);
    } catch (error) {
      logger.error("Error in findAlbumByProviderId:", error);
      return null;
    }
  }

  async upsertAlbumFromProvider(album: AlbumData): Promise<AlbumData | null> {
    const albums = await this.upsertAlbumsFromProvider([album]);
    return albums[0] ?? null;
  }

  async upsertAlbumsFromProvider(albums: AlbumData[]): Promise<AlbumData[]> {
    try {
      const db = await createSupabaseAdmin();
      const persisted = await persistAlbumsToDatabase(db, albums);
      return persisted.map((album) => mapDatabaseRowToAlbumData(album));
    } catch (error) {
      logger.error("Error in upsertAlbumsFromProvider:", error);
      return [];
    }
  }

  async getFeaturedAlbums(amount: number, listName: string): Promise<AlbumData[]> {
    try {
      const db = await createSupabaseAdmin();
      const { data: tempData, error } = await getFeaturedAlbumsQuery({
        db,
        listSlug: listName,
        amount,
      });

      if (error || !tempData) {
        logger.error("Error fetching albums:", error);
        return [];
      }

      const data = tempData as Pick<FeaturedListItemRow, "album">[];
      return data
        .map((row) => getJoinedAlbumRow(row.album))
        .filter(Boolean)
        .map((album) => mapDatabaseRowToAlbumData(album!));
    } catch (error) {
      logger.error("Error in getFeaturedAlbums:", error);
      return [];
    }
  }

  async setFeaturedAlbums(albums: AlbumData[]): Promise<AlbumData[]> {
    try {
      const db = await createSupabaseAdmin();
      logger.log(`[setFeaturedAlbums] Starting with ${albums.length} albums`);

      const upserted = await persistAlbumsToDatabase(db, albums);
      if (upserted.length === 0) return [];

      logger.log(`[setFeaturedAlbums] Upserted ${upserted.length} albums`);
      logger.log("[setFeaturedAlbums] Creating/getting feed list...");

      const { data: list, error: listError } = await createOrGetFeaturedListQuery({
        db,
        slug: "feed",
        title: "Feed",
      });

      if (listError || !list?.id) {
        logger.error("[setFeaturedAlbums] Error with feed list:", listError ?? list);
        return upserted.map(mapDatabaseRowToAlbumData);
      }

      const { error: deleteError } = await db
        .from("featured_list_items")
        .delete()
        .eq("list_id", list.id);

      if (deleteError) {
        logger.warn("[setFeaturedAlbums] Error clearing old items:", deleteError);
      }

      const listItems = upserted
        .map((album, index) => ({
          list_id: list.id,
          album_id: album.id,
          rank: index + 1,
        }))
        .slice(0, FEED_ALBUMS_AMOUNT);

      const { error: insertError } = await db
        .from("featured_list_items")
        .upsert(listItems, { onConflict: "list_id, album_id" });

      if (insertError) {
        logger.error(
          "[setFeaturedAlbums] Error inserting featured list items:",
          insertError,
        );
      }

      return upserted.map(mapDatabaseRowToAlbumData);
    } catch (error) {
      logger.error("[setFeaturedAlbums] Exception:", error);
      return [];
    }
  }

  async getDailyAlbum(dateKey: string): Promise<DailyAlbumEntry | null> {
    try {
      const db = await createSupabaseAdmin();
      const rank = getDailyAlbumRank(dateKey);
      const { data, error } = await getFeaturedListItemsQuery({
        db,
        listSlug: DAILY_ALBUM_LIST_SLUG,
        rank,
        amount: 10,
        ascending: true,
      });

      if (error || !data) {
        logger.error("Error fetching daily album:", formatSupabaseError(error));
        return null;
      }

      const rows = (data as FeaturedListItemRow[]).sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

      return mapFeaturedListItemRowToDailyAlbumEntry(rows[0]);
    } catch (error) {
      logger.error("Error in getDailyAlbum:", error);
      return null;
    }
  }

  async getDailyAlbumHistory(limit: number): Promise<DailyAlbumEntry[]> {
    try {
      const db = await createSupabaseAdmin();
      const { data, error } = await getFeaturedListItemsQuery({
        db,
        listSlug: DAILY_ALBUM_LIST_SLUG,
        amount: limit,
        ascending: false,
      });

      if (error || !data) {
        logger.error("Error fetching daily album history:", error);
        return [];
      }

      return (data as FeaturedListItemRow[])
        .map(mapFeaturedListItemRowToDailyAlbumEntry)
        .filter((entry): entry is DailyAlbumEntry => Boolean(entry));
    } catch (error) {
      logger.error("Error in getDailyAlbumHistory:", error);
      return [];
    }
  }

  async createDailyAlbum(dateKey: string, album: AlbumData): Promise<DailyAlbumEntry | null> {
    try {
      const existing = await this.getDailyAlbum(dateKey);
      if (existing) return existing;

      const db = await createSupabaseAdmin();
      const rank = getDailyAlbumRank(dateKey);

      const { data: list, error: listError } = await createOrGetFeaturedListQuery({
        db,
        slug: DAILY_ALBUM_LIST_SLUG,
        title: DAILY_ALBUM_LIST_TITLE,
      });

      if (listError || !list?.id) {
        logger.error("Error creating daily album list:", listError);
        return null;
      }

      const persistedAlbum = (await persistAlbumsToDatabase(db, [album]))[0];
      if (!persistedAlbum) return null;

      const { error: insertError } = await db
        .from("featured_list_items")
        .insert({ list_id: list.id, album_id: persistedAlbum.id, rank });

      if (insertError) {
        const albumForDate = await this.getDailyAlbum(dateKey);
        if (albumForDate) return albumForDate;

        if (!isUniqueViolationError(insertError)) {
          logger.error(
            "Error inserting daily album item:",
            formatSupabaseError(insertError),
          );
        }
        return null;
      }

      const { data: todaysItems, error: todaysItemsError } =
        await getFeaturedListItemsQuery({
          db,
          listSlug: DAILY_ALBUM_LIST_SLUG,
          rank,
          amount: 10,
          ascending: true,
        });

      if (todaysItemsError || !todaysItems) {
        logger.error("Error reading back daily album entries:", todaysItemsError);
        return null;
      }

      const rows = (todaysItems as FeaturedListItemRow[]).sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );

      const keeper = rows[0];
      if (!keeper) return null;

      const duplicateAlbumIds = rows
        .slice(1)
        .map((row) => row.album_id)
        .filter((id) => id !== keeper.album_id);

      if (duplicateAlbumIds.length > 0) {
        const { error: deleteError } = await db
          .from("featured_list_items")
          .delete()
          .eq("list_id", list.id)
          .eq("rank", rank)
          .in("album_id", duplicateAlbumIds);

        if (deleteError) {
          logger.error("Error cleaning duplicate daily album entries:", deleteError);
        }
      }

      return mapFeaturedListItemRowToDailyAlbumEntry(keeper);
    } catch (error) {
      logger.error("Error in createDailyAlbum:", error);
      return null;
    }
  }

  async getDailyAlbumCandidates(): Promise<AlbumData[]> {
    try {
      const db = await createSupabaseAdmin();
      const { data: historyData, error: historyError } =
        await getFeaturedListItemsQuery({
          db,
          listSlug: DAILY_ALBUM_LIST_SLUG,
          amount: DAILY_HISTORY_FETCH_LIMIT,
          ascending: false,
        });

      if (historyError) {
        logger.error("Error fetching daily album archive:", historyError);
      }

      const usedAlbumIds = new Set(
        ((historyData as FeaturedListItemRow[] | null) ?? []).map(
          (row) => row.album_id,
        ),
      );

      const { data: albumsData, error: albumsError } = await db
        .from("albums")
        .select(
          "id, provider, provider_album_id, title, artist, album_cover, release_date, raw_payload",
        );

      if (albumsError || !albumsData) {
        logger.error("Error fetching daily album candidates:", albumsError);
        return [];
      }

      return (albumsData as AlbumRowWithId[])
        .filter((album) => !usedAlbumIds.has(album.id))
        .map(mapDatabaseRowToAlbumData);
    } catch (error) {
      logger.error("Error in getDailyAlbumCandidates:", error);
      return [];
    }
  }
}

async function persistAlbumsToDatabase(
  db: ReturnType<typeof createSupabaseAdmin>,
  albums: AlbumData[],
): Promise<AlbumRowWithId[]> {
  if (albums.length === 0) return [];

  const rows = albums.map(mapAlbumDataToDatabaseRow);
  const { data, error } = await upsertAlbumsToDatabaseQuery({ db, rows });

  if (error || !data) {
    logger.error("Error upserting albums:", formatSupabaseError(error));
    return [];
  }

  const albumByKey = new Map(
    (data as AlbumRowWithId[]).map((album) => [
      `${album.provider}:${album.provider_album_id}`,
      album,
    ]),
  );

  return rows
    .map((row) => albumByKey.get(`${row.provider}:${row.provider_album_id}`))
    .filter((album): album is AlbumRowWithId => Boolean(album));
}
