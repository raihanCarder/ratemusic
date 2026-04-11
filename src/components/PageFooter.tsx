import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Feed", href: "/feed" },
  { label: "Daily Album", href: "/album-of-the-day" },
];

const linkSx = {
  color: "rgba(255,255,255,0.52)",
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
  lineHeight: 1.9,
  transition: "color 0.15s ease",
  "&:hover": { color: "#9ff4b8" },
} as const;

export default function PageFooter() {
  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        bgcolor: "#070b08",
        borderTop: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Top accent line */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(159,244,184,0.35) 40%, rgba(68,212,255,0.2) 70%, transparent 100%)",
        }}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1.6fr 1fr 1fr",
              lg: "2fr 1fr 1fr",
            },
            gap: { xs: 5, md: 6 },
          }}
        >
          {/* ── Brand ── */}
          <Box>
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#fff7ef",
                mb: 1,
              }}
            >
              Music4You
            </Typography>

            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.35,
                maxWidth: 320,
                mb: 1.5,
              }}
            >
              The album diary for people with real opinions.
            </Typography>

            <Typography
              sx={{
                fontSize: "0.825rem",
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.65,
                maxWidth: 300,
              }}
            >
              Rate albums, build your music identity, and let your taste speak
              for itself. Inspired by Letterboxd.
            </Typography>
          </Box>

          {/* ── Quick Links ── */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                color: "rgba(255,255,255,0.36)",
                letterSpacing: 1.6,
                fontWeight: 700,
                mb: 1.5,
              }}
            >
              Quick Links
            </Typography>
            <Box
              component="nav"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              {quickLinks.map((link) => (
                <Link key={link.href} href={link.href} style={linkSx}>
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* ── Contact ── */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                color: "rgba(255,255,255,0.36)",
                letterSpacing: 1.6,
                fontWeight: 700,
                mb: 1.5,
              }}
            >
              Contact
            </Typography>
            <Typography
              sx={{
                fontSize: "0.825rem",
                color: "rgba(255,255,255,0.42)",
                mb: 0.75,
              }}
            >
              Questions, feedback, or just want to talk music?
            </Typography>
            <Box
              component="a"
              href="mailto:raihancarder@gmail.com"
              sx={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#9ff4b8",
                textDecoration: "none",
                "&:hover": { color: "#b6f7ca", textDecoration: "underline" },
              }}
            >
              raihancarder@gmail.com
            </Box>
          </Box>
        </Box>

        <Divider
          sx={{ mt: { xs: 5, md: 7 }, borderColor: "rgba(255,255,255,0.07)" }}
        />

        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1,
          }}
        >
          <Typography
            sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}
          >
            © 2025 Music4You. All rights reserved.
          </Typography>
          <Typography
            sx={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}
          >
            Built by Raihan Carder
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
