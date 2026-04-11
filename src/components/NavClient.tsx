"use client";

import Link from "next/link";
import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import NavLink from "./NavLink";

type NavClientProps = {
  children?: React.ReactNode;
};

export default function NavClient({ children }: NavClientProps) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "rgba(6, 10, 8, 0.78)",
        backdropFilter: "blur(24px) saturate(160%)",
        WebkitBackdropFilter: "blur(24px) saturate(160%)",
        borderBottom: "1px solid rgba(139, 224, 164, 0.1)",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ minHeight: 64, py: 0.75 }}>
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
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: 148, sm: 172 },
                  height: { xs: 40, sm: 48 },
                }}
              >
                <Image
                  src="/logo_light.png"
                  alt="Music4You"
                  fill
                  sizes="(max-width: 600px) 148px, 172px"
                  priority
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Link>
          </Box>

          {/* Nav links */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              flexWrap: "wrap",
            }}
          >
            <NavLink href="/feed" name="Discover" />
            <NavLink href="/album-of-the-day" name="Album of the Day" />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Search + account */}
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
                width: { xs: "100%", md: 280 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.04)",
                  fontSize: "0.875rem",
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.1)",
                    transition: "border-color 0.2s",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(139, 224, 164, 0.28)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "rgba(139, 224, 164, 0.6)",
                    borderWidth: 1,
                  },
                },
                "& input": {
                  color: "rgba(255,255,255,0.85)",
                  "&::placeholder": {
                    color: "rgba(255,255,255,0.32)",
                    opacity: 1,
                  },
                },
              }}
            />
            {children}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
