"use client";
import SignInForm from "./_components/SignInForm";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";

export default function SignInPage() {
  /**
   * Sign-In Page. Can be routed to Sign-up page or back to Discovery if account exists.
   */

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" mb={2}>
        Sign in 👤
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Sign in to rate your favourite albums on Music4You!
      </Typography>

      <SignInForm />

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        New user?{" "}
        <MuiLink component={Link} href="/signup">
          Create an account
        </MuiLink>
      </Typography>
    </Box>
  );
}
