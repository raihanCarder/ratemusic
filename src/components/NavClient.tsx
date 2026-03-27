"use client";

import Link from "next/link";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import type { AccountNavUser } from "@/src/lib/profiles/types";
import AccountMenu from "./AccountMenu";
import NavLink from "./NavLink";

type NavClientProps = {
  account: AccountNavUser | null;
};

export default function NavClient({ account }: NavClientProps) {
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
      <Toolbar sx={{ minHeight: 72, py: 1 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 1.25,
            columnGap: 2,
          }}
        >
          {/* Logo + Name */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Link
              href="/feed"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 158, sm: 185 },
                  height: { xs: 44, sm: 52 },
                }}
              >
                <Image
                  src="/logo_light.png"
                  alt="Music4You"
                  fill
                  sizes="(max-width: 600px) 158px, 185px"
                  priority
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Link>
          </Box>

          {/* Center: Links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexWrap: "wrap",
            }}
          >
            <NavLink href="/feed" name="Discover" />
            <NavLink href="/album-of-the-day" name="Album of the Day" />
          </Box>

          {/* Push right side */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Search + Sign in */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              ml: "auto",
              width: { xs: "100%", md: "auto" },
            }}
          >
            <TextField
              id="global-search"
              size="small"
              placeholder="Search albums, artists…"
              sx={{
                flexGrow: 1,
                width: { xs: "100%", md: 320 },
                "& .MuiOutlinedInput-root": { borderRadius: 999 },
              }}
            />
            {account ? (
              <AccountMenu account={account} />
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
