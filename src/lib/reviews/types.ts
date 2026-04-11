import type { AlbumData } from "@/src/lib/music/types";

export type RateableAlbumData = Pick<
  AlbumData,
  "provider" | "id" | "title" | "artist" | "image" | "releaseDate"
>;

export type AlbumRatingSummary = {
  averageRating: number | null;
  ratingCount: number;
};

export type AlbumUserRating = {
  rating: number;
};

export type AlbumRatingsPageData = {
  summary: AlbumRatingSummary;
  currentUserRating: AlbumUserRating | null;
};

export type SubmitAlbumRatingInput = RateableAlbumData & {
  rating: number;
};
