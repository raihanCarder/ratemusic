import { createSupabaseAdmin } from "@/src/auth/admin";
import { createSupabaseServer } from "@/src/auth/server";
import {
  AlbumData,
  AlbumDataInDatabase,
  AlbumDatabase,
  DailyAlbumEntry,
  Song,
} from "./types";
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
import {
  getDailyAlbumRank,
  getDateKeyFromDailyAlbumRank,
} from "./dailyAlbum";

type AlbumRowWithId = AlbumDataInDatabase & {
  id: string;
};

type FeaturedListItemRow = {
  list_id: string;
  album_id: string;
  rank: number;
  created_at: string;
  album: AlbumDataInDatabase | AlbumDataInDatabase[] | null;
};

const DAILY_HISTORY_FETCH_LIMIT = 5000;

export class Supabase implements AlbumDatabase {
  async findAlbumByProviderId(
    provider: string,
    id: string,
  ): Promise<AlbumData | null> {
    try {
      const db = await createSupabaseServer();
      const { data, error: databaseError } =
        await getAlbumDataFromProviderIdQuery({
          db,
          provider,
          id,
        });

      if (databaseError) {
        console.error(
          "Error fetching album by provider ID:",
          formatSupabaseError(databaseError),
        );
        return null;
      }

      if (!data) {
        return null;
      }

      return mapDatabaseRowToAlbumData(data);
    } catch (error) {
      console.error("Error in findAlbumByProviderId:", error);
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
      const persistedAlbums = await persistAlbumsToDatabase(db, albums);
      return persistedAlbums.map((album) => mapDatabaseRowToAlbumData(album));
    } catch (error) {
      console.error("Error in upsertAlbumsFromProvider:", error);
      return [];
    }
  }

  async getFeaturedAlbums(
    amount: number,
    listName: string,
  ): Promise<AlbumData[]> {
    try {
      const db = await createSupabaseAdmin();

      const { data: tempData, error: getAlbumsError } =
        await getFeaturedAlbumsQuery({ db, listSlug: listName, amount });

      if (getAlbumsError || !tempData) {
        console.error("Error fetching albums:", getAlbumsError);
        return [];
      }

      const data = tempData as Pick<FeaturedListItemRow, "album">[];

      return data
        .map((row) => getJoinedAlbumRow(row.album))
        .filter((album): album is AlbumDataInDatabase => Boolean(album))
        .map((album) => mapDatabaseRowToAlbumData(album));
    } catch (error) {
      console.error("Error in getFeaturedAlbums:", error);
      return [];
    }
  }

  async setFeaturedAlbums(albums: AlbumData[]): Promise<AlbumData[]> {
    try {
      const db = await createSupabaseAdmin();
      console.log(`[setFeaturedAlbums] Starting with ${albums.length} albums`);

      const upsertedAlbumsWithIds = await persistAlbumsToDatabase(db, albums);

      if (upsertedAlbumsWithIds.length === 0) {
        return [];
      }

      console.log(
        `[setFeaturedAlbums] Upserted ${upsertedAlbumsWithIds.length} albums`,
      );

      console.log("[setFeaturedAlbums] Creating/getting feed list...");
      const { data: list, error: listError } =
        await createOrGetFeaturedListQuery({
          db,
          slug: "feed",
          title: "Feed",
        });

      if (listError) {
        console.error("[setFeaturedAlbums] Error with feed list:", listError);
        return upsertedAlbumsWithIds.map((album) =>
          mapDatabaseRowToAlbumData(album),
        );
      }

      if (!list?.id) {
        console.error(
          "[setFeaturedAlbums] No list returned from createOrGetFeaturedListQuery",
          list,
        );
        return upsertedAlbumsWithIds.map((album) =>
          mapDatabaseRowToAlbumData(album),
        );
      }

      const { error: deleteError } = await db
        .from("featured_list_items")
        .delete()
        .eq("list_id", list.id);

      if (deleteError) {
        console.warn(
          "[setFeaturedAlbums] Error clearing old items:",
          deleteError,
        );
      }

      const listItems = upsertedAlbumsWithIds
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
        console.error(
          "[setFeaturedAlbums] Error inserting featured list items:",
          insertError,
        );
      }

      return upsertedAlbumsWithIds.map((album) => mapDatabaseRowToAlbumData(album));
    } catch (error) {
      console.error("[setFeaturedAlbums] Exception:", error);
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
        console.error("Error fetching daily album:", formatSupabaseError(error));
        return null;
      }

      const rows = (data as FeaturedListItemRow[]).sort(
        (left, right) =>
          new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
      );

      const entry = rows[0];
      if (!entry) {
        return null;
      }

      return mapFeaturedListItemRowToDailyAlbumEntry(entry);
    } catch (error) {
      console.error("Error in getDailyAlbum:", error);
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
        console.error("Error fetching daily album history:", error);
        return [];
      }

      return (data as FeaturedListItemRow[])
        .map((row) => mapFeaturedListItemRowToDailyAlbumEntry(row))
        .filter((entry): entry is DailyAlbumEntry => Boolean(entry));
    } catch (error) {
      console.error("Error in getDailyAlbumHistory:", error);
      return [];
    }
  }

  async createDailyAlbum(
    dateKey: string,
    album: AlbumData,
  ): Promise<DailyAlbumEntry | null> {
    try {
      const existingAlbum = await this.getDailyAlbum(dateKey);
      if (existingAlbum) {
        return existingAlbum;
      }

      const db = await createSupabaseAdmin();
      const rank = getDailyAlbumRank(dateKey);

      const { data: list, error: listError } = await createOrGetFeaturedListQuery({
        db,
        slug: DAILY_ALBUM_LIST_SLUG,
        title: DAILY_ALBUM_LIST_TITLE,
      });

      if (listError || !list?.id) {
        console.error("Error creating daily album list:", listError);
        return null;
      }

      const persistedAlbum = (await persistAlbumsToDatabase(db, [album]))[0];
      if (!persistedAlbum) {
        return null;
      }

      const { error: insertError } = await db.from("featured_list_items").insert({
        list_id: list.id,
        album_id: persistedAlbum.id,
        rank,
      });

      if (insertError) {
        const albumForDate = await this.getDailyAlbum(dateKey);

        if (albumForDate) {
          return albumForDate;
        }

        if (isUniqueViolationError(insertError)) {
          return null;
        }

        console.error(
          "Error inserting daily album item:",
          formatSupabaseError(insertError),
        );
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
        console.error(
          "Error reading back daily album entries:",
          todaysItemsError,
        );
        return null;
      }

      const rows = (todaysItems as FeaturedListItemRow[]).sort(
        (left, right) =>
          new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
      );
      const keeper = rows[0];

      if (!keeper) {
        return null;
      }

      const duplicateAlbumIds = rows
        .slice(1)
        .map((row) => row.album_id)
        .filter((albumId) => albumId !== keeper.album_id);

      if (duplicateAlbumIds.length > 0) {
        const { error: deleteError } = await db
          .from("featured_list_items")
          .delete()
          .eq("list_id", list.id)
          .eq("rank", rank)
          .in("album_id", duplicateAlbumIds);

        if (deleteError) {
          console.error("Error cleaning duplicate daily album entries:", deleteError);
        }
      }

      return mapFeaturedListItemRowToDailyAlbumEntry(keeper);
    } catch (error) {
      console.error("Error in createDailyAlbum:", error);
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
        console.error("Error fetching daily album archive:", historyError);
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
        console.error("Error fetching daily album candidates:", albumsError);
        return [];
      }

      return (albumsData as AlbumRowWithId[])
        .filter((album) => !usedAlbumIds.has(album.id))
        .map((album) => mapDatabaseRowToAlbumData(album));
    } catch (error) {
      console.error("Error in getDailyAlbumCandidates:", error);
      return [];
    }
  }
}

async function persistAlbumsToDatabase(
  db: ReturnType<typeof createSupabaseAdmin>,
  albums: AlbumData[],
): Promise<AlbumRowWithId[]> {
  if (albums.length === 0) {
    return [];
  }

  const rows = albums.map((album) => mapAlbumDataToDatabaseRow(album));
  const { data, error } = await upsertAlbumsToDatabaseQuery({
    db,
    rows,
  });

  if (error || !data) {
    console.error("Error upserting albums:", formatSupabaseError(error));
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

function mapFeaturedListItemRowToDailyAlbumEntry(
  row: FeaturedListItemRow | null | undefined,
): DailyAlbumEntry | null {
  const album = getJoinedAlbumRow(row?.album);

  if (!row || !album) {
    return null;
  }

  return {
    dateKey: getDateKeyFromDailyAlbumRank(row.rank),
    createdAt: row.created_at,
    rank: row.rank,
    album: mapDatabaseRowToAlbumData(album),
  };
}

function mapAlbumDataToDatabaseRow(album: AlbumData): AlbumDataInDatabase {
  let releaseDate = album.releaseDate ?? null;
  if (releaseDate) {
    const dateObject = new Date(releaseDate);
    if (Number.isNaN(dateObject.getTime())) {
      console.warn(
        `Invalid date "${releaseDate}" for album "${album.title}", setting to null`,
      );
      releaseDate = null;
    }
  }

  return {
    provider: album.provider,
    provider_album_id: album.id,
    title: album.title,
    artist: album.artist,
    album_cover: album.image,
    release_date: releaseDate,
    raw_payload: buildRawPayload(album),
  };
}

function buildRawPayload(album: AlbumData) {
  const songs = album.songs?.length ? album.songs : undefined;

  if (!songs) {
    return album.raw ?? null;
  }

  if (album.raw && typeof album.raw === "object" && !Array.isArray(album.raw)) {
    return {
      ...(album.raw as Record<string, unknown>),
      songs,
    };
  }

  if (album.raw) {
    return {
      source: album.raw,
      songs,
    };
  }

  return { songs };
}

function mapDatabaseRowToAlbumData(data: AlbumDataInDatabase): AlbumData {
  const songs = extractSongsFromRawPayload(data?.raw_payload);

  return {
    provider: data?.provider,
    id: data?.provider_album_id,
    title: data?.title,
    artist: data?.artist,
    image: data?.album_cover ?? "",
    releaseDate: data?.release_date ? String(data.release_date) : null,
    songs,
    raw: data?.raw_payload ?? null,
  };
}

function extractSongsFromRawPayload(rawPayload: unknown): Song[] {
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
    return [];
  }

  const songs = (rawPayload as { songs?: unknown }).songs;
  if (!Array.isArray(songs)) {
    return [];
  }

  return songs
    .map((song, index) => normalizeSong(song, index))
    .filter((song): song is Song => Boolean(song));
}

function normalizeSong(song: unknown, index: number): Song | null {
  if (!song || typeof song !== "object" || Array.isArray(song)) {
    return null;
  }

  const maybeSong = song as Partial<Song>;
  if (typeof maybeSong.title !== "string" || maybeSong.title.trim() === "") {
    return null;
  }

  return {
    id:
      typeof maybeSong.id === "string" && maybeSong.id.trim() !== ""
        ? maybeSong.id
        : `track-${index + 1}-${maybeSong.title}`,
    title: maybeSong.title,
    trackNumber:
      typeof maybeSong.trackNumber === "number"
        ? maybeSong.trackNumber
        : index + 1,
    durationMs:
      typeof maybeSong.durationMs === "number"
        ? maybeSong.durationMs
        : undefined,
  };
}

function getJoinedAlbumRow(
  album: AlbumDataInDatabase | AlbumDataInDatabase[] | null | undefined,
) {
  if (!album) {
    return null;
  }

  if (Array.isArray(album)) {
    return album[0] ?? null;
  }

  return album;
}

function isUniqueViolationError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { code?: unknown; message?: unknown; details?: unknown };
  const code = typeof maybeError.code === "string" ? maybeError.code : "";
  const message =
    typeof maybeError.message === "string" ? maybeError.message.toLowerCase() : "";
  const details =
    typeof maybeError.details === "string" ? maybeError.details.toLowerCase() : "";

  return (
    code === "23505" ||
    message.includes("duplicate key") ||
    details.includes("duplicate key")
  );
}

function formatSupabaseError(error: unknown) {
  if (!error || typeof error !== "object") {
    return error;
  }

  const maybeError = error as {
    code?: unknown;
    message?: unknown;
    details?: unknown;
    hint?: unknown;
  };

  return {
    code: typeof maybeError.code === "string" ? maybeError.code : "",
    message: typeof maybeError.message === "string" ? maybeError.message : "",
    details: typeof maybeError.details === "string" ? maybeError.details : "",
    hint: typeof maybeError.hint === "string" ? maybeError.hint : "",
  };
}
