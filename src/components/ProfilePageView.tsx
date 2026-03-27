"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Profile } from "@/src/lib/profiles/types";
import ProfileAvatar from "./ProfileAvatar";
import ProfileEditDialog from "./ProfileEditDialog";

type ProfilePageViewProps = {
  profile: Profile;
  editable?: boolean;
};

function formatJoinedDate(createdAt: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      year: "numeric",
    }).format(new Date(createdAt));
  } catch {
    return "Recently";
  }
}

export default function ProfilePageView({
  profile,
  editable = false,
}: ProfilePageViewProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const joinedDate = formatJoinedDate(profile.createdAt);

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
                <Chip
                  label={editable ? "Editing enabled" : "Public profile"}
                  variant="outlined"
                />
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

          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Activity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Ratings, reviews, and diary-style listening activity will land here once
              the social layer is wired in.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                mt: 2.5,
              }}
            >
              {["Reviews", "Lists", "Following"].map((label) => (
                <Box
                  key={label}
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: "rgba(255,255,255,0.03)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Coming soon
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Listening identity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              Music4You is set up for a Letterboxd-style music presence. This panel is
              where favorite albums, year-in-music snapshots, and taste signals can
              grow next.
            </Typography>
          </Paper>

          <Paper
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              What&apos;s next
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
              {editable
                ? "Use this page as the base for your public identity. Add a name, bio, and avatar now so the future review and list screens already feel personal."
                : "This profile will expand with ratings, reviews, lists, and other visible signs of taste as those features ship."}
            </Typography>
          </Paper>
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
