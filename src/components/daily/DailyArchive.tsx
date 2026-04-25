import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { DailyAlbumEntry } from "@/src/lib/music/types";

type DailyArchiveProps = {
  history: DailyAlbumEntry[];
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function DailyArchive({ history }: DailyArchiveProps) {
  // ── Step 1: Derive calendar geometry for the current month ──────────────
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (0 = January)

  const daysInMonth = new Date(year, month + 1, 0).getDate(); // last day = days in month
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun … 6=Sat
  const todayDay = now.getDate();

  // ── Step 2: Build a Map of day-of-month → entry for this month only ─────
  // dateKey format: "YYYY-MM-DD" — filter by "YYYY-MM" prefix
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const entryByDay = new Map<number, DailyAlbumEntry>();
  for (const entry of history) {
    if (entry.dateKey.startsWith(monthPrefix)) {
      const day = parseInt(entry.dateKey.split("-")[2], 10);
      entryByDay.set(day, entry);
    }
  }

  // ── Step 3: Build the flat cell array ───────────────────────────────────
  // null = leading empty spacer (days before the 1st)
  // number = actual day of the month (1 … daysInMonth)
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthLabel = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month, 1));

  return (
    <Paper
      sx={{
        p: { xs: 2.25, md: 3 },
        borderRadius: 5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        {monthLabel}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1.25, mb: 2.5 }}
      >
        Daily Albums of the Month! Hover album card for more info!
      </Typography>

      {/* ── Weekday column labels ──────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          mb: 1,
        }}
      >
        {WEEKDAYS.map((d) => (
          <Typography
            key={d}
            variant="caption"
            sx={{
              textAlign: "center",
              color: "text.disabled",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* ── Calendar grid ─────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: 0.75,
        }}
      >
        {cells.map((cell, i) => {
          // ── Empty leading spacer ──────────────────────────────────────
          if (cell === null) {
            return <Box key={`spacer-${i}`} sx={{ aspectRatio: "1 / 1" }} />;
          }

          const entry = entryByDay.get(cell);
          const isToday = cell === todayDay;
          const isFuture = cell > todayDay;

          // ── Day with an archived album — show thumbnail ───────────────
          if (entry) {
            return (
              <Tooltip
                key={cell}
                title={`${entry.album.title} — ${entry.album.artist}`}
                placement="top"
                arrow
              >
                <Link
                  href={`/album/${entry.album.id}`}
                  style={{ textDecoration: "none", display: "block" }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      aspectRatio: "1 / 1",
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.1)",
                      transition:
                        "transform 140ms ease, border-color 140ms ease",
                      "&:hover": {
                        transform: "scale(1.06)",
                        borderColor: "rgba(126, 241, 164, 0.45)",
                      },
                    }}
                  >
                    <Image
                      src={entry.album.image}
                      alt={`${entry.album.title} by ${entry.album.artist}`}
                      fill
                      sizes="(max-width: 600px) 14vw, 60px"
                      style={{ objectFit: "cover" }}
                    />
                    {/* Day number pinned to the bottom of the thumbnail */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        py: 0.3,
                        bgcolor: "rgba(0,0,0,0.6)",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          color: "rgba(255,255,255,0.9)",
                          fontWeight: 700,
                          lineHeight: 1,
                          fontSize: "0.58rem",
                        }}
                      >
                        {cell}
                      </Typography>
                    </Box>
                  </Box>
                </Link>
              </Tooltip>
            );
          }

          // ── Day without an album (today, future, or gap) ──────────────
          return (
            <Box
              key={cell}
              sx={{
                aspectRatio: "1 / 1",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid",
                borderColor: isToday
                  ? "rgba(126, 241, 164, 0.45)"
                  : "rgba(255,255,255,0.06)",
                bgcolor: isToday ? "rgba(126, 241, 164, 0.06)" : "transparent",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: isToday
                    ? "rgba(126, 241, 164, 0.9)"
                    : isFuture
                      ? "rgba(255,255,255,0.15)"
                      : "text.disabled",
                  fontWeight: isToday ? 700 : 400,
                  fontSize: "0.65rem",
                }}
              >
                {cell}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
