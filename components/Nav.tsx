"use client";

import Link from "next/link";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import NavLink from "./NavLink";

export default function Nav() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Logo + Name */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Link
              href="/feed"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
              }}
            >
              <Image src="/logo.png" alt="Logo" width={26} height={26} />
              <Typography
                sx={{ fontSize: 30, fontWeight: 800, letterSpacing: 0.4 }}
              >
                Music4You
              </Typography>
            </Link>
          </Box>

          {/* Spacer between name and links */}
          <Box sx={{ width: 28 }} />

          {/* Center: Links */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NavLink href="/feed" name="Discover" />
            <NavLink href="/album-of-the-day" name="Album of the Day" />
          </Box>

          {/* Push right side */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Search + Sign in */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <TextField
              id="global-search"
              size="small"
              placeholder="Search albums, artists…"
              sx={{
                width: 320,
                "& .MuiOutlinedInput-root": { borderRadius: 999 },
              }}
            />
            <Button
              component={Link}
              href="/signin"
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 999,
                px: 2,
              }}
            >
              Sign in
            </Button>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
