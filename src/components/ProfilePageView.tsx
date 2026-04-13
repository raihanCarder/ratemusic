"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FavoriteAlbum } from "@/src/lib/favorites/types";
import type { Profile, RecentAlbumRating } from "@/src/lib/profiles/types";
import { formatJoinedDate } from "@/src/lib/profiles/format";
import ProfileAvatar from "./ProfileAvatar";
import ProfileEditDialog from "./ProfileEditDialog";

type ProfilePageViewProps = {
  profile: Profile;
  editable?: boolean;
};

type ScoreDistributionChartProps = {
  averageRating: number | null;
  distribution: Profile["stats"]["distribution"];
};

type FavoriteAlbumsRailProps = {
  albums: FavoriteAlbum[];
  emptyMessage: string;
};

type RecentRatingsRailProps = {
  ratings: RecentAlbumRating[];
  emptyMessage: string;
};

const railScrollStyles = {
  overflowX: "auto",
  scrollSnapType: "x mandatory",
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": {
    height: 8,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 999,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
};

function SummaryStat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(255,255,255,0.03)",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ letterSpacing: 0.4, textTransform: "uppercase" }}
      >
        {label}
      </Typography>
      <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 800, lineHeight: 1 }}>
        {value}
      </Typography>
      {note ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.55, display: "block" }}
        >
          {note}
        </Typography>
      ) : null}
    </Box>
  );
}

function ScoreDistributionChart({
  averageRating,
  distribution,
}: ScoreDistributionChartProps) {
  const defaultActiveScore = useMemo(() => {
    const nonEmptyBuckets = distribution.filter((bucket) => bucket.count > 0);

    if (nonEmptyBuckets.length === 0) {
      return null;
    }

    return nonEmptyBuckets.reduce((best, bucket) =>
      bucket.count > best.count ? bucket : best,
    ).score;
  }, [distribution]);
  const [activeScore, setActiveScore] = useState<number | null>(
    defaultActiveScore,
  );
  const maxCount = Math.max(...distribution.map((bucket) => bucket.count), 0);
  const activeBucket =
    distribution.find((bucket) => bucket.score === activeScore) ?? null;

  return (
    <Box
      sx={{
        width: { xs: "100%", lg: "66.6667%" },
        p: 1.75,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(255,255,255,0.03)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            All Ratings
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {averageRating !== null
              ? `Average ${averageRating.toFixed(2)} across all ratings`
              : "No ratings yet"}
          </Typography>
        </Box>

        <Box
          sx={{
            px: 1.1,
            py: 0.75,
            borderRadius: 999,
            border: "1px solid",
            borderColor: activeBucket
              ? "rgba(139, 224, 164, 0.28)"
              : "rgba(255,255,255,0.08)",
            bgcolor: activeBucket
              ? "rgba(139, 224, 164, 0.10)"
              : "rgba(255,255,255,0.02)",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: activeBucket ? "rgb(235, 248, 239)" : "text.secondary",
              fontWeight: activeBucket ? 700 : 500,
              lineHeight: 1.35,
            }}
          >
            {activeBucket
              ? `${activeBucket.count} Album${
                  activeBucket.count === 1 ? "" : "s"
                }`
              : "Hover or tap a bar to inspect"}
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(10, minmax(0, 1fr))",
          gap: 0.75,
          alignItems: "end",
          mt: 1.75,
          minHeight: 118,
        }}
      >
        {distribution.map((bucket) => {
          const isActive = bucket.score === activeBucket?.score;
          const barHeight =
            maxCount > 0
              ? Math.max(
                  (bucket.count / maxCount) * 76,
                  bucket.count > 0 ? 12 : 4,
                )
              : 4;

          return (
            <Box
              key={bucket.score}
              component="button"
              type="button"
              onMouseEnter={() => setActiveScore(bucket.score)}
              onFocus={() => setActiveScore(bucket.score)}
              onClick={() => setActiveScore(bucket.score)}
              sx={{
                appearance: "none",
                border: 0,
                bgcolor: "transparent",
                p: 0,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.7,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 26,
                  height: `${barHeight}px`,
                  borderRadius: 999,
                  alignSelf: "center",
                  bgcolor: isActive
                    ? "rgb(159, 244, 184)"
                    : bucket.count > 0
                      ? "rgba(255,255,255,0.24)"
                      : "rgba(255,255,255,0.10)",
                  boxShadow: isActive
                    ? "0 10px 24px rgba(139, 224, 164, 0.24)"
                    : "none",
                  transition:
                    "background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
                  transform: isActive ? "translateY(-2px)" : "translateY(0)",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: isActive ? "rgb(159, 244, 184)" : "text.secondary",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {bucket.score}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function FavoriteAlbumsRail({ albums, emptyMessage }: FavoriteAlbumsRailProps) {
  return (
    <Box sx={{ mt: 2.25 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
        Favourite albums
      </Typography>

      {albums.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            gap: 1.1,
            mt: 1.35,
            px: 0.25,
            py: 0.35,
            ...railScrollStyles,
          }}
        >
          {albums.map((album) => (
            <Link
              key={`${album.albumId}-${album.favoritedAt}`}
              href={`/album/${album.albumId}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  width: 228,
                  minWidth: 228,
                  minHeight: 84,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.15,
                  p: 1.1,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "rgba(255,255,255,0.03)",
                  scrollSnapAlign: "start",
                  transition:
                    "border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    borderColor: "rgba(139, 224, 164, 0.30)",
                    bgcolor: "rgba(139, 224, 164, 0.08)",
                    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.16)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 62,
                    height: 62,
                    flexShrink: 0,
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "rgba(255,255,255,0.05)",
                  }}
                >
                  {album.image ? (
                    <Image
                      src={album.image}
                      alt={`${album.title} by ${album.artist}`}
                      fill
                      sizes="62px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        px: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        align="center"
                        color="text.secondary"
                      >
                        No cover
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.25,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {album.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mt: 0.45,
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {album.artist}
                  </Typography>
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            mt: 1.35,
            minHeight: 84,
            display: "grid",
            placeItems: "center",
            p: 1.5,
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "rgba(255,255,255,0.02)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

function RecentRatingsRail({ ratings, emptyMessage }: RecentRatingsRailProps) {
  return (
    <Paper
      sx={{
        p: { xs: 2, md: 2.35 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={0.6}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Recent ratings
          </Typography>
        </Box>
      </Stack>

      {ratings.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            gap: 1.25,
            mt: 1.7,
            pb: 0.5,
            ...railScrollStyles,
          }}
        >
          {ratings.map((rating) => (
            <Link
              key={`${rating.albumId}-${rating.ratedAt}`}
              href={`/album/${rating.albumId}`}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  width: { xs: 154, sm: 164, md: 172 },
                  minWidth: { xs: 154, sm: 164, md: 172 },
                  height: 280,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "rgba(255,255,255,0.03)",
                  scrollSnapAlign: "start",
                  transition:
                    "border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    borderColor: "rgba(139, 224, 164, 0.30)",
                    bgcolor: "rgba(139, 224, 164, 0.08)",
                    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.16)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    flexShrink: 0,
                    bgcolor: "rgba(255,255,255,0.04)",
                  }}
                >
                  {rating.image ? (
                    <Image
                      src={rating.image}
                      alt={`${rating.title} by ${rating.artist}`}
                      fill
                      sizes="172px"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        px: 2,
                      }}
                    >
                      <Typography
                        variant="caption"
                        align="center"
                        color="text.secondary"
                      >
                        No cover
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    p: 1.1,
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.25,
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {rating.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mt: 0.45,
                      display: "block",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {rating.artist}
                  </Typography>
                  <Chip
                    label={`${rating.rating}/10`}
                    size="small"
                    sx={{
                      mt: "auto",
                      width: "fit-content",
                      borderRadius: 999,
                      bgcolor: "rgba(139, 224, 164, 0.12)",
                    }}
                  />
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            mt: 1.7,
            minHeight: 212,
            display: "grid",
            placeItems: "center",
            p: 2,
            borderRadius: 3,
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "rgba(255,255,255,0.02)",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default function ProfilePageView({
  profile,
  editable = false,
}: ProfilePageViewProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const joinedDate = formatJoinedDate(profile.createdAt);
  const favoriteAlbums = Array.isArray(profile.favoriteAlbums)
    ? profile.favoriteAlbums
    : [];
  const recentRatings = Array.isArray(profile.recentRatings)
    ? profile.recentRatings
    : [];
  const averageScoreLabel =
    profile.stats.averageRating !== null
      ? profile.stats.averageRating.toFixed(2)
      : "--";

  return (
    <Box component="main" sx={{ py: { xs: 2.25, md: 3.5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 2, md: 2.25 }}>
          <Paper
            sx={{
              p: { xs: 2, md: 2.5 },
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.18)",
            }}
          >
            <Stack spacing={2.25}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <ProfileAvatar
                  src={profile.avatarUrl}
                  name={profile.preferredName}
                  size={84}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
                  }}
                />

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="overline"
                    sx={{
                      color: "rgba(159, 244, 184, 0.88)",
                      letterSpacing: 1.1,
                    }}
                  >
                    {editable ? "Your Music4You identity" : "Music4You profile"}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ mt: 0.3, fontWeight: 800, lineHeight: 1 }}
                  >
                    {profile.preferredName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.55 }}
                  >
                    @{profile.username}
                  </Typography>
                </Box>

                {editable ? (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditOpen(true)}
                    sx={{
                      borderRadius: 999,
                      px: 2.2,
                      alignSelf: { xs: "stretch", sm: "flex-start" },
                    }}
                  >
                    Edit profile
                  </Button>
                ) : null}
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", lg: "0.85fr 1.15fr" },
                  gap: 2,
                }}
              >
                <Stack spacing={1.5}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, maxWidth: 580 }}
                  >
                    {profile.bio ??
                      (editable
                        ? "Tell people what records you keep returning to, what scenes shaped you, and what you are chasing next."
                        : "This listener has not written a bio yet. Their taste will have to do the talking for now.")}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={`Joined ${joinedDate}`}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 1.15,
                    }}
                  >
                    <SummaryStat
                      label="Albums rated"
                      value={String(profile.stats.reviewCount)}
                    />
                    <SummaryStat
                      label="Average score"
                      value={averageScoreLabel}
                      note={
                        profile.stats.averageRating === null
                          ? "No ratings yet"
                          : "Across all reviews"
                      }
                    />
                  </Box>
                </Stack>
              </Box>

              <ScoreDistributionChart
                averageRating={profile.stats.averageRating}
                distribution={profile.stats.distribution}
              />

              <FavoriteAlbumsRail
                albums={favoriteAlbums}
                emptyMessage={
                  editable
                    ? "Pick up to four albums from album pages and they will live here."
                    : "This profile has not pinned favourite albums yet."
                }
              />
            </Stack>
          </Paper>

          <RecentRatingsRail
            ratings={recentRatings}
            emptyMessage={
              editable
                ? "Once you start rating albums, your latest activity will show up here."
                : "This profile has not rated any albums yet."
            }
          />
        </Stack>
      </Container>

      {editable && isEditOpen ? (
        <ProfileEditDialog
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          profile={profile}
        />
      ) : null}
    </Box>
  );
}
