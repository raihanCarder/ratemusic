const MILLISECONDS_PER_DAY = 86_400_000;
const DAILY_ALBUM_TIME_ZONE = "America/Toronto";

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid date key: ${dateKey}`);
  }

  return { year, month, day };
}

function getStableDateFromDateKey(dateKey: string) {
  const { year, month, day } = parseDateKey(dateKey);
  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function getCurrentDailyAlbumDateKey(referenceDate = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: DAILY_ALBUM_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(referenceDate);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    return referenceDate.toISOString().slice(0, 10);
  }

  return `${year}-${month}-${day}`;
}

export function getDailyAlbumRank(dateKey: string) {
  const { year, month, day } = parseDateKey(dateKey);
  return Math.floor(Date.UTC(year, month - 1, day) / MILLISECONDS_PER_DAY);
}

export function getDateKeyFromDailyAlbumRank(rank: number) {
  const date = new Date(rank * MILLISECONDS_PER_DAY);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatAlbumOfDayDate(dateKey: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: DAILY_ALBUM_TIME_ZONE,
    }).format(getStableDateFromDateKey(dateKey));
  } catch {
    return dateKey;
  }
}

export function formatAlbumReleaseDate(releaseDate?: string | null) {
  if (!releaseDate) {
    return "Unknown release date";
  }

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${releaseDate}T00:00:00.000Z`));
  } catch {
    return releaseDate;
  }
}

export function formatTrackDuration(durationMs?: number) {
  if (!durationMs || durationMs <= 0) {
    return null;
  }

  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function getAlbumRuntimeLabel(
  songs: Array<{ durationMs?: number }> | undefined,
) {
  if (!songs || songs.length === 0) {
    return "Runtime coming soon";
  }

  const totalDurationMs = songs.reduce(
    (sum, song) => sum + (song.durationMs ?? 0),
    0,
  );

  if (!totalDurationMs) {
    return "Runtime coming soon";
  }

  const totalMinutes = Math.round(totalDurationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours} hr ${minutes} min`;
}
