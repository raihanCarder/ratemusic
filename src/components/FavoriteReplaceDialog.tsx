"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FavoriteAlbum } from "@/src/lib/favorites/types";

type FavoriteReplaceDialogProps = {
  open: boolean;
  favorites: FavoriteAlbum[];
  pending: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSelect: (albumId: string) => void;
};

export default function FavoriteReplaceDialog({
  open,
  favorites,
  pending,
  errorMessage,
  onClose,
  onSelect,
}: FavoriteReplaceDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          backgroundImage:
            "linear-gradient(180deg, rgba(139, 224, 164, 0.08), rgba(18, 18, 18, 0.98))",
        },
      }}
    >
      <DialogTitle>Replace a favourite</DialogTitle>
      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          You can only keep four favourite albums at a time. Pick one to replace
          with this album.
        </Typography>

        <Stack spacing={1.25}>
          {favorites.map((favoriteAlbum) => (
            <Button
              key={`${favoriteAlbum.albumId}-${favoriteAlbum.favoritedAt}`}
              type="button"
              variant="outlined"
              color="inherit"
              disabled={pending}
              onClick={() => onSelect(favoriteAlbum.albumId)}
              sx={{
                justifyContent: "flex-start",
                p: 1.25,
                borderRadius: 3,
                textTransform: "none",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 2,
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                  bgcolor: "rgba(255,255,255,0.04)",
                }}
              >
                {favoriteAlbum.image ? (
                  <Image
                    src={favoriteAlbum.image}
                    alt={`${favoriteAlbum.title} by ${favoriteAlbum.artist}`}
                    fill
                    sizes="64px"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      px: 1,
                    }}
                  >
                    <Typography
                      variant="caption"
                      align="center"
                      color="text.secondary"
                    >
                      No cover
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ ml: 1.5, textAlign: "left", minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.25,
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                  }}
                >
                  {favoriteAlbum.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {favoriteAlbum.artist}
                </Typography>
              </Box>
            </Button>
          ))}
        </Stack>

        {errorMessage ? (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={pending}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
