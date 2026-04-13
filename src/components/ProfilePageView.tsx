"use client";

import { useState } from "react";
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
import type { Profile } from "@/src/lib/profiles/types";
import { formatJoinedDate } from "@/src/lib/profiles/format";
import ProfileAvatar from "./ProfileAvatar";
import ProfileEditDialog from "./ProfileEditDialog";

type ProfilePageViewProps = {
  profile: Profile;
  editable?: boolean;
};

type ProfileAlbumGridSectionProps = {
  title: string;
  emptyMessage: string;
  albums: FavoriteAlbum[];
};

function ProfileAlbumGridSection({
  title,
  emptyMessage,
  albums,
}: ProfileAlbumGridSectionProps) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
        {albums.length > 0
          ? "The four records this listener wants front and center on their profile."
          : emptyMessage}
      </Typography>

      {albums.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: 1.5,
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            mt: 2.5,
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
                  borderRadius: 3,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "rgba(255,255,255,0.03)",
                  transition: "transform 180ms ease, border-color 180ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    borderColor: "rgba(139, 224, 164, 0.36)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    bgcolor: "rgba(255,255,255,0.04)",
                  }}
                >
                  {album.image ? (
                    <Image
                      src={album.image}
                      alt={`${album.title} by ${album.artist}`}
                      fill
                      sizes="(max-width: 1200px) 50vw, 220px"
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
                        variant="subtitle2"
                        align="center"
                        color="text.secondary"
                      >
                        No cover
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ p: 1.5 }}>
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
                      mt: 0.5,
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
      ) : null}
    </Paper>
  );
}

export default function ProfilePageView({
  profile,
  editable = false,
}: ProfilePageViewProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const joinedDate = formatJoinedDate(profile.createdAt);
  const favoriteAlbums = Array.isArray(profile?.favoriteAlbums)
    ? profile.favoriteAlbums
    : [];
  const recentRatings = Array.isArray(profile?.recentRatings)
    ? profile.recentRatings
    : [];

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            backgroundImage:
              "linear-gradient(180deg, rgba(139, 224, 164, 0.12), rgba(10, 10, 10, 0.98) 58%)",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems={{ xs: "flex-start", md: "center" }}
          >
            <ProfileAvatar
              src={profile.avatarUrl}
              name={profile.preferredName}
              size={116}
              sx={{
                border: "2px solid rgba(139, 224, 164, 0.24)",
                boxShadow: "0 18px 36px rgba(0, 0, 0, 0.28)",
              }}
            />

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "rgb(159, 244, 184)",
                  letterSpacing: 1.2,
                }}
              >
                {editable ? "Your Music4You identity" : "Music4You profile"}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.25}
                alignItems={{ xs: "flex-start", sm: "center" }}
                sx={{ mt: 0.5 }}
              >
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 800, lineHeight: 1 }}
                >
                  {profile.preferredName}
                </Typography>
                <Chip
                  label={`@${profile.username}`}
                  sx={{
                    borderRadius: 999,
                    bgcolor: "rgba(255,255,255,0.06)",
                  }}
                />
              </Stack>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 1.5, maxWidth: 720 }}
              >
                {profile.bio ??
                  (editable
                    ? "Tell people what records you keep returning to, what scenes shaped you, and what you are chasing next."
                    : "This listener has not written a bio yet. Their taste will have to do the talking for now.")}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ mt: 2 }}
              >
                <Chip label={`Joined ${joinedDate}`} variant="outlined" />
              </Stack>
            </Box>

            {editable ? (
              <Button
                variant="contained"
                onClick={() => setIsEditOpen(true)}
                sx={{ borderRadius: 999, px: 2.5 }}
              >
                Edit profile
              </Button>
            ) : null}
          </Stack>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.3fr 0.9fr" },
            gap: 3,
            mt: 3,
          }}
        >
          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Display name
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              {profile.displayName ?? "Using username as the public display name."}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
              Profile URL
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              <Link href={`/u/${profile.username}`}>/u/{profile.username}</Link>
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
              About
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5 }}>
              {profile.bio ??
                "No bio yet. Start with the albums that define you or the scenes you keep returning to."}
            </Typography>
          </Paper>

          <Stack spacing={3}>
            <ProfileAlbumGridSection
              title="Favourite albums"
              emptyMessage={
                editable
                  ? "Pick up to four records from any album page and they will show up here."
                  : "This profile has not picked favourite albums yet."
              }
              albums={favoriteAlbums}
            />

            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Recent ratings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                {recentRatings.length > 0
                  ? "The latest four album ratings from this profile. Click any cover to open the album page."
                  : editable
                    ? "Once you start rating albums, your latest four will show up here for visitors."
                    : "This profile has not rated any albums yet."}
              </Typography>

              {recentRatings.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    mt: 2.5,
                  }}
                >
                  {recentRatings.map((rating) => (
                    <Link
                      key={`${rating.albumId}-${rating.ratedAt}`}
                      href={`/album/${rating.albumId}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Box
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: "rgba(255,255,255,0.03)",
                          transition: "transform 180ms ease, border-color 180ms ease",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            borderColor: "rgba(139, 224, 164, 0.36)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "1 / 1",
                            bgcolor: "rgba(255,255,255,0.04)",
                          }}
                        >
                          {rating.image ? (
                            <Image
                              src={rating.image}
                              alt={`${rating.title} by ${rating.artist}`}
                              fill
                              sizes="(max-width: 1200px) 50vw, 220px"
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
                                variant="subtitle2"
                                align="center"
                                color="text.secondary"
                              >
                                No cover
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ p: 1.5 }}>
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
                              mt: 0.5,
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
                              mt: 1.25,
                              borderRadius: 999,
                              bgcolor: "rgba(139, 224, 164, 0.12)",
                            }}
                          />
                        </Box>
                      </Box>
                    </Link>
                  ))}
                </Box>
              ) : null}
            </Paper>
          </Stack>
        </Box>
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
