import Link from "next/link";
import { redirect } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProfileAvatar from "@/src/components/ProfileAvatar";
import SignOutButton from "@/src/components/SignOutButton";
import { getCurrentProfile } from "@/src/lib/profiles/server";

export default async function SettingsPage() {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/signin");
  }

  return (
    <Box component="main" sx={{ py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: "rgb(159, 244, 184)", letterSpacing: 1.1 }}
            >
              Account
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
              Settings
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1.25 }}>
              Keep the account controls simple for now: view your profile, jump back
              into editing, or sign out cleanly.
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
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              <ProfileAvatar
                src={profile.avatarUrl}
                name={profile.preferredName}
                size={72}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {profile.preferredName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  @{profile.username}
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Link href="/profile" style={{ textDecoration: "none" }}>
                  <Button
                    component="span"
                    variant="contained"
                    sx={{ borderRadius: 999, width: "100%" }}
                  >
                    Edit profile
                  </Button>
                </Link>
                <Link
                  href={`/u/${profile.username}`}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    component="span"
                    variant="outlined"
                    sx={{ borderRadius: 999, width: "100%" }}
                  >
                    View public profile
                  </Button>
                </Link>
              </Stack>
            </Stack>
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
              Session
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
              Signing out is the only settings action in v1. Additional account and
              privacy controls can layer onto this page later.
            </Typography>
            <Box sx={{ mt: 2.5, maxWidth: 220 }}>
              <SignOutButton fullWidth />
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
