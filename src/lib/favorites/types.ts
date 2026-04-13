import type { AlbumData } from "@/src/lib/music/types";

export type FavoriteAlbum = {
  albumId: string;
  title: string;
  artist: string;
  image: string;
  favoritedAt: string;
};

export type FavoritableAlbumData = Pick<
  AlbumData,
  "provider" | "id" | "title" | "artist" | "image" | "releaseDate"
>;

export type AlbumFavoritesPageData = {
  isFavorited: boolean;
  currentUserFavorites: FavoriteAlbum[];
};

export type SubmitAlbumFavoriteInput = FavoritableAlbumData & {
  replaceAlbumId?: string | null;
};
