import type {
  AlbumData,
  AlbumDataInDatabase,
  DailyAlbumEntry,
  Song,
} from "./types";
import { getDateKeyFromDailyAlbumRank } from "./dailyAlbum";

export type AlbumRowWithId = AlbumDataInDatabase & { id: string };

export type FeaturedListItemRow = {
  list_id: string;
  album_id: string;
  rank: number;
  created_at: string;
  album: AlbumDataInDatabase | AlbumDataInDatabase[] | null;
};

export function getJoinedAlbumRow(
  album: AlbumDataInDatabase | AlbumDataInDatabase[] | null | undefined,
): AlbumDataInDatabase | null {
  if (!album) return null;
  if (Array.isArray(album)) return album[0] ?? null;
  return album;
}

export function mapFeaturedListItemRowToDailyAlbumEntry(
  row: FeaturedListItemRow | null | undefined,
): DailyAlbumEntry | null {
  const album = getJoinedAlbumRow(row?.album);
  if (!row || !album) return null;

  return {
    dateKey: getDateKeyFromDailyAlbumRank(row.rank),
    createdAt: row.created_at,
    rank: row.rank,
    album: mapDatabaseRowToAlbumData(album),
  };
}

export function mapAlbumDataToDatabaseRow(album: AlbumData): AlbumDataInDatabase {
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

export function mapDatabaseRowToAlbumData(data: AlbumDataInDatabase): AlbumData {
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

function buildRawPayload(album: AlbumData) {
  const songs = album.songs?.length ? album.songs : undefined;

  if (!songs) return album.raw ?? null;

  if (album.raw && typeof album.raw === "object" && !Array.isArray(album.raw)) {
    return { ...(album.raw as Record<string, unknown>), songs };
  }

  if (album.raw) return { source: album.raw, songs };

  return { songs };
}

function extractSongsFromRawPayload(rawPayload: unknown): Song[] {
  if (!rawPayload || typeof rawPayload !== "object" || Array.isArray(rawPayload)) {
    return [];
  }

  const songs = (rawPayload as { songs?: unknown }).songs;
  if (!Array.isArray(songs)) return [];

  return songs
    .map((song, index) => normalizeSong(song, index))
    .filter((song): song is Song => Boolean(song));
}

function normalizeSong(song: unknown, index: number): Song | null {
  if (!song || typeof song !== "object" || Array.isArray(song)) return null;

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
      typeof maybeSong.trackNumber === "number" ? maybeSong.trackNumber : index + 1,
    durationMs:
      typeof maybeSong.durationMs === "number" ? maybeSong.durationMs : undefined,
  };
}
