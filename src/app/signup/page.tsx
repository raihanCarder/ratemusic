"use client";

import { Box, Paper, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import SignUpForm from "./_components/SignUpForm";

export default function SignUpPage() {
  /*
   * Sign Up Page used to Sign up for site. Sign-up done in SignUpForm Component.
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
          maxWidth: 500,
          p: { xs: 3, md: 4 },
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
          backgroundImage:
            "linear-gradient(180deg, rgba(139, 224, 164, 0.1), rgba(18, 18, 18, 0.98))",
        }}
      >
        <SignUpForm />

        <Typography variant="body2" align="center" sx={{ mt: 2.5 }}>
          Already have an account?{" "}
          <MuiLink component={Link} href="/signin" underline="hover">
            Sign in
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}
