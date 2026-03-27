"use client";
import SignInForm from "./_components/SignInForm";
import { Box, Paper, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";

export default function SignInPage() {
  /*
   * Sign-In Page. Can be routed to Sign-up page or back to /feed if account exists.
   * Sign-In done in /components/SignInForm.tsx
   */

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 180px)",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 5,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, md: 4 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
          backgroundImage:
            "linear-gradient(180deg, rgba(139, 224, 164, 0.08), rgba(18, 18, 18, 0.98))",
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: "rgb(159, 244, 184)", letterSpacing: 1.1 }}
        >
          Welcome back
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, mb: 1.5 }}>
          Sign in
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={2.5}>
          Get back to the records you want to rate, revisit, and write about.
        </Typography>

        <SignInForm />

        <Typography variant="body2" align="center" sx={{ mt: 2.5 }}>
          New user?{" "}
          <MuiLink component={Link} href="/signup" underline="hover">
            Create an account
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
