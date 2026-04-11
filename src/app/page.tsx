import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import sampleData from "@/src/lib/music/testing/sampleData";

const featuredAlbums = sampleData.slice(0, 6);

const sellingPoints = [
  "Rate albums on a 1-10 scale and keep your taste profile persistent.",
  "Build a public music identity with recent ratings and a shareable profile.",
  "Browse discovery picks and jump into album pages built for repeat listening.",
];

const proofPoints = [
  { label: "Personal ratings", value: "1-10" },
  { label: "Recent profile picks", value: "4 albums" },
  { label: "Discovery-ready", value: "25 covers" },
];

export default function LandingPage() {
  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top left, rgba(255, 196, 128, 0.12), transparent 34%), radial-gradient(ellipse at 82% 8%, rgba(100, 220, 150, 0.24), transparent 38%), radial-gradient(ellipse at 18% 88%, rgba(80, 180, 120, 0.09), transparent 42%), linear-gradient(180deg, #080c09 0%, #0d1010 44%, #101312 100%)",
      }}
    >
      {/* Grid overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.6), transparent 88%)",
          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="xl"
        sx={{ position: "relative", py: { xs: 7, md: 10 } }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.05fr 0.95fr" },
            gap: { xs: 5, lg: 7 },
            alignItems: "center",
          }}
        >
          {/* ── Left column ── */}
          <Box>
            <Chip
              label="The Letterboxd of Music"
              sx={{
                borderRadius: 999,
                px: 1,
                bgcolor: "rgba(159, 244, 184, 0.08)",
                color: "rgba(159, 244, 184, 0.9)",
                border: "1px solid rgba(159, 244, 184, 0.22)",
                fontWeight: 600,
                letterSpacing: 0.3,
              }}
            />

            <Typography
              variant="h1"
              sx={{
                mt: 2.5,
                maxWidth: 760,
                fontSize: { xs: "3rem", md: "5.2rem" },
                lineHeight: 0.94,
                letterSpacing: "-0.05em",
                fontWeight: 900,
                color: "#fff7ef",
              }}
            >
              Track your taste.
              <Box
                component="span"
                sx={{
                  display: "block",
                  background:
                    "linear-gradient(120deg, #9ff4b8 0%, #5de3a8 50%, #44d4ff 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                Sell your obsessions.
              </Box>
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 2.5,
                maxWidth: 680,
                color: "rgba(255, 245, 236, 0.7)",
                fontSize: { xs: "1.1rem", md: "1.35rem" },
                lineHeight: 1.55,
                fontWeight: 400,
              }}
            >
              Rate albums, share your taste, and see what the people you follow are listening to. Think Letterboxd, but for music.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ mt: 4 }}
            >
              <Link href="/feed" style={{ textDecoration: "none" }}>
                <Button
                  component="span"
                  variant="contained"
                  size="large"
                  sx={{
                    minWidth: 220,
                    borderRadius: 999,
                    px: 3,
                    py: 1.4,
                    fontWeight: 800,
                    bgcolor: "#9ff4b8",
                    color: "#08110b",
                    boxShadow:
                      "0 0 0 1px rgba(159,244,184,0.3), 0 20px 60px rgba(159, 244, 184, 0.28), 0 4px 16px rgba(159,244,184,0.18)",
                    "&:hover": {
                      bgcolor: "#b6f7ca",
                      boxShadow:
                        "0 0 0 1px rgba(159,244,184,0.4), 0 24px 72px rgba(159, 244, 184, 0.36), 0 4px 20px rgba(159,244,184,0.24)",
                    },
                  }}
                >
                  View the app
                </Button>
              </Link>

              <Link href="/signup" style={{ textDecoration: "none" }}>
                <Button
                  component="span"
                  variant="outlined"
                  size="large"
                  sx={{
                    minWidth: 220,
                    borderRadius: 999,
                    px: 3,
                    py: 1.4,
                    fontWeight: 800,
                    color: "#fff7ef",
                    borderColor: "rgba(255,255,255,0.16)",
                    bgcolor: "rgba(255,255,255,0.03)",
                    "&:hover": {
                      borderColor: "rgba(255,255,255,0.28)",
                      bgcolor: "rgba(255,255,255,0.06)",
                    },
                  }}
                >
                  Create your profile
                </Button>
              </Link>
            </Stack>

            {/* Proof points */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
                mt: 4,
                maxWidth: 760,
              }}
            >
              {proofPoints.map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderTop: "1px solid rgba(159,244,184,0.2)",
                    bgcolor: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{ color: "rgba(255,255,255,0.5)", letterSpacing: 1.1 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      mt: 0.75,
                      color: "#fff7ef",
                      fontWeight: 900,
                      background:
                        "linear-gradient(120deg, #fff7ef 0%, rgba(255,247,239,0.8) 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Right column: album card ── */}
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: 420, md: 620 },
            }}
          >
            {/* Ambient glow behind the card */}
            <Box
              sx={{
                position: "absolute",
                inset: { xs: 0, md: "6% 2% 0 6%" },
                borderRadius: 6,
                background:
                  "radial-gradient(ellipse at 60% 30%, rgba(100,220,150,0.14), transparent 65%)",
                filter: "blur(24px)",
                pointerEvents: "none",
              }}
            />

            <Box
              sx={{
                position: "absolute",
                inset: { xs: 0, md: "6% 2% 0 6%" },
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.11)",
                bgcolor: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(14px)",
                boxShadow:
                  "0 40px 100px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 1.5,
                  px: { xs: 2, md: 2.5 },
                  pt: { xs: 2, md: 2.5 },
                  pb: { xs: 4, md: 9 },
                }}
              >
                {featuredAlbums.map((album, index) => (
                  <Box
                    key={album.id}
                    sx={{
                      position: "relative",
                      transform: {
                        xs: "none",
                        md:
                          index >= 4
                            ? index % 2 === 0
                              ? "translateY(8px)"
                              : "translateY(-4px)"
                            : index % 2 === 0
                              ? "translateY(24px)"
                              : "translateY(-10px)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        aspectRatio: "1 / 1",
                        borderRadius: 4,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.36)",
                      }}
                    >
                      <Image
                        src={album.image}
                        alt={`${album.title} by ${album.artist}`}
                        fill
                        sizes="(max-width: 1200px) 50vw, 260px"
                        style={{ objectFit: "cover" }}
                      />
                    </Box>

                    <Box sx={{ mt: 1.25, px: 0.25 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ color: "#fff7ef", fontWeight: 800 }}
                      >
                        {album.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.58)" }}
                      >
                        {album.artist}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Bottom fade */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 110,
                  background:
                    "linear-gradient(to top, rgba(8,14,10,0.92) 0%, rgba(8,14,10,0.5) 50%, transparent 100%)",
                  borderRadius: "0 0 24px 24px",
                  pointerEvents: "none",
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* ── Selling points ── */}
        <Box
          sx={{
            mt: { xs: 7, md: 10 },
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {sellingPoints.map((point, index) => (
            <Box
              key={point}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid rgba(255,255,255,0.08)",
                borderLeft:
                  index === 1
                    ? "2px solid rgba(159,244,184,0.55)"
                    : "2px solid rgba(255,255,255,0.12)",
                bgcolor:
                  index === 1
                    ? "rgba(159, 244, 184, 0.06)"
                    : "rgba(255,255,255,0.03)",
              }}
            >
              <Typography
                variant="overline"
                sx={{
                  color:
                    index === 1
                      ? "rgba(159,244,184,0.65)"
                      : "rgba(255,255,255,0.42)",
                  letterSpacing: 1.5,
                  fontWeight: 700,
                }}
              >
                {`0${index + 1}`}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mt: 1,
                  color: "#fff7ef",
                  fontWeight: 800,
                  lineHeight: 1.2,
                }}
              >
                {point}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
