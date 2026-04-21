"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CommunityProfileListItem } from "@/src/lib/profiles/types";
import { formatJoinedDate } from "@/src/lib/profiles/format";
import ProfileAvatar from "./ProfileAvatar";

type CommunityPageViewProps = {
  profiles: CommunityProfileListItem[];
};

function CommunityProfileCard({
  profile,
}: {
  profile: CommunityProfileListItem;
}) {
  return (
    <Paper
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))",
        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.14)",
        transition:
          "transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          borderColor: "rgba(139, 224, 164, 0.24)",
          boxShadow: "0 24px 54px rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <Box
        component={Link}
        href={`/u/${profile.username}`}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 2,
          minWidth: 0,
          color: "inherit",
          textDecoration: "none",
        }}
      >
        <ProfileAvatar
          src={profile.avatarUrl}
          name={profile.preferredName}
          size={64}
          sx={{
            flexShrink: 0,
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 10px 24px rgba(0, 0, 0, 0.18)",
          }}
        />

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            {profile.preferredName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.45 }}>
            @{profile.username}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              mt: 1,
              display: "block",
              color: "rgba(159, 244, 184, 0.82)",
              letterSpacing: 0.35,
              textTransform: "uppercase",
            }}
          >
            Joined {formatJoinedDate(profile.createdAt)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default function CommunityPageView({
  profiles,
}: CommunityPageViewProps) {
  return (
    <Box component="main" sx={{ py: { xs: 2.25, md: 3.5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 2, md: 2.5 }}>
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
            <Typography
              variant="overline"
              sx={{
                color: "rgba(159, 244, 184, 0.88)",
                letterSpacing: 1.1,
              }}
            >
              Community
            </Typography>
            <Typography variant="h3" sx={{ mt: 0.6, fontWeight: 900 }}>
              Meet the listeners on Music4You
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 1.25, maxWidth: 720, lineHeight: 1.75 }}
            >
              Browse every current profile on the platform and jump straight into
              each listener&apos;s public page.
            </Typography>
          </Paper>

          {profiles.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              {profiles.map((profile) => (
                <CommunityProfileCard key={profile.id} profile={profile} />
              ))}
            </Box>
          ) : (
            <Paper
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01))",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                No community members yet
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.9, maxWidth: 540, mx: "auto", lineHeight: 1.7 }}
              >
                Once people sign up and create profiles, they&apos;ll show up here.
              </Typography>
            </Paper>
          )}
        </Stack>
      </Container>
    </Box>
  );
}
