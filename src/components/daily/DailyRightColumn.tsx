import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const RITUAL_BULLETS = [
  "One album is selected and locked for the full Toronto day.",
  "Selections are archived in a dedicated featured list so they can be revisited later.",
  "Albums already in the archive are skipped on future days until the catalog runs out.",
];

export default function DailyRightColumn() {
  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      {/* Scoreboard */}
      <Paper
        sx={{
          p: { xs: 2.25, md: 3 },
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(180deg, rgba(121, 233, 156, 0.08), rgba(255,255,255,0.01))",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Scoreboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
          This block is ready for average rating, review count, and daily discussion
          once the review layer is connected.
        </Typography>

        <Divider sx={{ my: 2.5 }} />

        <Stack spacing={1.5}>
          <Box
            sx={{
              p: 2,
              borderRadius: 4,
              bgcolor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Community score
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 900 }}>
              Pending
            </Typography>
          </Box>
          <Box
            sx={{
              p: 2,
              borderRadius: 4,
              bgcolor: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Review status
            </Typography>
            <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 700 }}>
              Ready for ratings and notes
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* About the ritual */}
      <Paper
        sx={{
          p: { xs: 2.25, md: 3 },
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          About the ritual
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1.25, lineHeight: 1.8 }}
        >
          Music4You is aiming for the same kind of daily pull that Letterboxd gives
          film lovers: a visible taste profile, a social record of what matters, and a
          reason to come back each day for one more recommendation. Album of the Day is
          the editorial anchor for that.
        </Typography>

        <Box sx={{ mt: 2.5, display: "grid", gap: 1.25 }}>
          {RITUAL_BULLETS.map((line) => (
            <Box
              key={line}
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <Typography variant="body2">{line}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
