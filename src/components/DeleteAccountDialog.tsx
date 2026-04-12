"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import { deleteAccountAction } from "@/src/actions/users";

type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function DeleteAccountDialog({
  open,
  onClose,
}: DeleteAccountDialogProps) {
  const router = useRouter();
  const [understood, setUnderstood] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    const result = await deleteAccountAction();

    if (result.errorMessage) {
      setError(result.errorMessage);
      setLoading(false);
      return;
    }

    onClose();
    router.push("/");
  };

  const handleClose = () => {
    if (!loading) {
      setUnderstood(false);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            border: "1px solid rgba(244, 67, 54, 0.2)",
          },
        },
      }}
    >
      <DialogContent sx={{ pt: 5, pb: 4, px: 4 }}>
        <Stack spacing={3.5}>
          {/* Header */}
          <Box>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: "rgba(244, 67, 54, 0.1)",
                border: "1px solid rgba(244, 67, 54, 0.2)",
                display: "grid",
                placeItems: "center",
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: "1.5rem",
                  color: "error.main",
                }}
              >
                ⚠
              </Typography>
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                mb: 1,
                letterSpacing: -0.5,
              }}
            >
              Delete account
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
              }}
            >
              This action cannot be undone. Your account and all ratings, reviews, and profile data will be permanently deleted from Music4You.
            </Typography>
          </Box>

          {/* Error State */}
          {error && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "rgba(244, 67, 54, 0.08)",
                border: "1px solid rgba(244, 67, 54, 0.2)",
              }}
            >
              <Typography variant="caption" sx={{ color: "error.main", fontWeight: 500 }}>
                {error}
              </Typography>
            </Box>
          )}

          {/* Confirmation Checkbox */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2.5,
              bgcolor: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              transition: "all 200ms ease",
              ...(understood && {
                bgcolor: "rgba(244, 67, 54, 0.05)",
                border: "1px solid rgba(244, 67, 54, 0.2)",
              }),
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  disabled={loading}
                  sx={{
                    "&.Mui-checked": {
                      color: "error.main",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  I understand this is permanent
                </Typography>
              }
              sx={{
                m: 0,
                "& .MuiFormControlLabel-label": {
                  ml: 1,
                },
              }}
            />
          </Box>

          {/* Actions */}
          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ pt: 1 }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={!understood || loading}
              startIcon={
                loading ? (
                  <CircularProgress size={18} sx={{ color: "inherit" }} />
                ) : undefined
              }
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                minWidth: 120,
              }}
            >
              {loading ? "Deleting..." : "Delete account"}
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
