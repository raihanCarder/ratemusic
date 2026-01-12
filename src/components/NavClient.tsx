"use client";

import Link from "next/link";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";
import NavLink from "./NavLink";
import SignOutButton from "./SignOutButton";
import { User } from "@supabase/supabase-js";

type NavClientProps = {
  user: User | null;
};

export default function NavClient({ user }: NavClientProps) {
  /*
    Navigation bar at the top of site. Contains Nav Links, SearchBar, Sign-in Button,
    Logo and title.
  */

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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              position: "relative",
            }}
            width={170}
            height={50}
          >
            <Link
              href="/feed"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
              }}
            >
              <Image src="/logo_light.png" alt="Logo" fill />
              {/* <Typography
                sx={{ fontSize: 30, fontWeight: 800, letterSpacing: 0.4 }}
              >
                Music4You
              </Typography> */}
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
            {user ? (
              <SignOutButton />
            ) : (
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
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
