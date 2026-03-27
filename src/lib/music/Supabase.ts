import { AlbumData, AlbumDatabase, AlbumDataInDatabase } from "./types";
import { createSupabaseAdmin } from "@/src/auth/admin";
import { createSupabaseServer } from "@/src/auth/server";
import {
  getAlbumDataFromProviderIdQuery,
  upsertAlbumToDatabaseQuery,
  upsertAlbumsToDatabaseQuery,
  getFeaturedAlbumsQuery,
  createOrGetFeaturedListQuery,
} from "./supabaseQueries";
import { FEED_ALBUMS_AMOUNT } from "./constants";

type FeaturedListItemRow = {
  rank: number;
  album: AlbumDataInDatabase[];
};

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

      if (databaseError || !data) {
        console.error("Error fetching album by provider ID:", databaseError);
        return null;
      }

      const album = mapDatabaseRowToAlbumData(data);
      return album;
    } catch (error) {
      console.error("Error in findAlbumByProviderId:", error);
      return null;
    }
  }

  async upsertAlbumFromProvider(album: AlbumData): Promise<AlbumData | null> {
    try {
      const db = await createSupabaseAdmin();

      const row = mapAlbumDataToDatabaseRow(album);

      const { data, error: upsertError } = await upsertAlbumToDatabaseQuery({
        db,
        row,
      });

      if (upsertError || !data) {
        console.error("Error upserting album:", upsertError);
        return null;
      }

      const newAlbum = mapDatabaseRowToAlbumData(data);
      return newAlbum;
    } catch (error) {
      console.error("Error in upsertAlbumFromProvider:", error);
      return null;
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

      const data = tempData as FeaturedListItemRow[];

      return data
        .map((row) => row.album?.[0])
        .filter((a): a is AlbumDataInDatabase => Boolean(a))
        .map((a) => mapDatabaseRowToAlbumData(a));
    } catch (error) {
      console.error("Error in getFeaturedAlbums:", error);
      return [];
    }
  }

  async setFeaturedAlbums(albums: AlbumData[]): Promise<AlbumData[]> {
    try {
      const db = await createSupabaseAdmin();
      console.log(`[setFeaturedAlbums] Starting with ${albums.length} albums`);

      const rows = albums.map((album) => mapAlbumDataToDatabaseRow(album));
      const {
        data: upsertedAlbums,
        error: bulkUpsertError,
      } = await upsertAlbumsToDatabaseQuery({
        db,
        rows,
      });

      if (bulkUpsertError || !upsertedAlbums) {
        console.error("Error upserting featured albums:", bulkUpsertError);
        return [];
      }

      const albumByKey = new Map(
        upsertedAlbums.map((album) => [
          `${album.provider}:${album.provider_album_id}`,
          album as AlbumDataInDatabase & { id: string },
        ]),
      );
      const upsertedAlbumsWithIds = rows
        .map((row) => albumByKey.get(`${row.provider}:${row.provider_album_id}`))
        .filter((album): album is AlbumDataInDatabase & { id: string } =>
          Boolean(album),
        );

      console.log(
        `[setFeaturedAlbums] Upserted ${upsertedAlbumsWithIds.length} albums`,
      );

      // Create or get the "feed" featured list
      console.log("[setFeaturedAlbums] Creating/getting feed list...");
      const { data: list, error: listError } =
        await createOrGetFeaturedListQuery({
          db,
          slug: "feed",
          title: "Feed",
        });

      if (listError) {
        console.error("[setFeaturedAlbums] Error with feed list:", listError);
        return upsertedAlbumsWithIds.map((a) => mapDatabaseRowToAlbumData(a));
      }

      if (!list || !list.id) {
        console.error(
          "[setFeaturedAlbums] No list returned from createOrGetFeaturedListQuery",
          list,
        );
        return upsertedAlbumsWithIds.map((a) => mapDatabaseRowToAlbumData(a));
      }

      console.log(`[setFeaturedAlbums] Using list ID: ${list.id}`);

      // Clear existing featured list items
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

      // Insert new featured list items with album IDs
      const listItems = upsertedAlbumsWithIds
        .map((album, index) => ({
          list_id: list.id,
          album_id: album.id,
          rank: index + 1,
        }))
        .slice(0, FEED_ALBUMS_AMOUNT);

      console.log(
        `[setFeaturedAlbums] Inserting ${listItems.length} featured list items`,
      );

      const { error: insertError } = await db
        .from("featured_list_items")
        .upsert(listItems, { onConflict: "list_id, album_id" });

      if (insertError) {
        console.error(
          "[setFeaturedAlbums] Error inserting featured list items:",
          insertError,
        );
      } else {
        console.log(
          `[setFeaturedAlbums] Successfully linked ${listItems.length} albums to feed list`,
        );
      }

      // Always return the upserted albums
      return upsertedAlbumsWithIds.map((a) => mapDatabaseRowToAlbumData(a));
    } catch (error) {
      console.error("[setFeaturedAlbums] Exception:", error);
      return [];
    }
  }
}

function mapAlbumDataToDatabaseRow(album: AlbumData): AlbumDataInDatabase {
  // Validate date - if it's invalid (like "00/00/0000"), convert to null
  let releaseDate = album.releaseDate ?? null;
  if (releaseDate) {
    const dateObj = new Date(releaseDate);
    if (isNaN(dateObj.getTime())) {
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
    raw_payload: album.raw ?? null,
  };
}

function mapDatabaseRowToAlbumData(data: AlbumDataInDatabase): AlbumData {
  return {
    provider: data?.provider,
    id: data?.provider_album_id,
    title: data?.title,
    artist: data?.artist,
    image: data?.album_cover ?? "",
    releaseDate: data?.release_date ? String(data.release_date) : null,
    songs: [],
    raw: data?.raw_payload ?? null,
  };
}
