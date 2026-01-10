"use client";

import { Box, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import SignUpForm from "./_components/SignUpForm";

export default function SignUpPage() {
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
      <SignUpForm />

      <Typography variant="body2" align="center" sx={{ mt: 2 }}>
        Already have an account?{" "}
        <MuiLink component={Link} href="/signin">
          Sign in
        </MuiLink>
      </Typography>
    </Box>
  );
}
