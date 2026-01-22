import { AlbumData, AlbumDatabase, AlbumDataInDatabase } from "./types";
import { createSupabaseAdmin } from "@/src/auth/admin";
import { createSupabaseServer } from "@/src/auth/server";
import {
  getAlbumDataFromProviderIdQuery,
  upsertAlbumToDatabaseQuery,
  getFeaturedAlbumsQuery,
  getListIdQuery,
} from "./supabaseQueries";

type FeaturedListItemRow = {
  rank: number;
  album: AlbumDataInDatabase[];
};

export class Supabase implements AlbumDatabase {
  async findAlbumByProviderId(
    provider: string,
    providerAlbumId: string,
  ): Promise<AlbumData | null> {
    const db = await createSupabaseServer();
    const { data, error: databaseError } =
      await getAlbumDataFromProviderIdQuery({
        db,
        provider,
        providerAlbumId,
      });

    if (databaseError || !data) {
      return null;
    }

    const album = mapDatabaseRowToAlbumData(data);

    return album;
  }

  async upsertAlbumFromProvider(album: AlbumData): Promise<AlbumData | null> {
    const db = await createSupabaseAdmin();

    const row = mapAlbumDataToDatabaseRow(album);

    const { data, error: upsertError } = await upsertAlbumToDatabaseQuery({
      db,
      row,
    });

    if (upsertError || !data) return null;

    const newAlbum = mapDatabaseRowToAlbumData(data);

    return newAlbum;
  }

  async getFeaturedAlbums(
    amount: number,
    listName: string,
  ): Promise<AlbumData[]> {
    const db = await createSupabaseAdmin();

    const { data: list, error: getListError } = await getListIdQuery({
      db,
      listName,
    });

    if (getListError || !list) return [];

    const { data: tempData, error: getAlbumsError } =
      await getFeaturedAlbumsQuery({ db, listId: list.id, amount });

    if (getAlbumsError || !tempData) return [];

    const data = tempData as FeaturedListItemRow[];

    return data
      .map((row) => row.album?.[0])
      .filter((a): a is AlbumDataInDatabase => Boolean(a))
      .map((a) => mapDatabaseRowToAlbumData(a));
  }

  async setFeaturedAlbums(albums: AlbumData[]): Promise<AlbumData[]> {
    return [];
  }
}

function mapAlbumDataToDatabaseRow(album: AlbumData): AlbumDataInDatabase {
  return {
    provider: album.provider,
    provider_album_id: album.providerAlbumId,
    title: album.title,
    artist: album.artist,
    album_cover: album.albumCover,
    release_date: album.releaseDate ?? null, // db converts string to Date
    raw_payload: album.raw ?? null,
  };
}

function mapDatabaseRowToAlbumData(data: AlbumDataInDatabase): AlbumData {
  return {
    provider: data?.provider,
    providerAlbumId: data?.provider_album_id,
    title: data?.title,
    artist: data?.artist,
    albumCover: data?.album_cover ?? "",
    releaseDate: data?.release_date ? String(data.release_date) : null,
    raw: data?.raw_payload ?? null,
  };
}
