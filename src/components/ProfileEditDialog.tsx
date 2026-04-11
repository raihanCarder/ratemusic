"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Loader2 } from "lucide-react";
import { updateCurrentProfileAction } from "@/src/actions/profiles";
import { buildGeneratedAvatarUrl, createRandomAvatarSeed } from "@/src/lib/profiles/avatar";
import type { Profile } from "@/src/lib/profiles/types";
import {
  MAX_BIO_LENGTH,
  MAX_DISPLAY_NAME_LENGTH,
} from "@/src/lib/profiles/validation";
import ProfileAvatar from "./ProfileAvatar";

type ProfileEditDialogProps = {
  open: boolean;
  onClose: () => void;
  profile: Profile;
};

type ProfileFormState = {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
};

function getInitialState(profile: Profile): ProfileFormState {
  return {
    username: profile.username,
    displayName: profile.displayName ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    bio: profile.bio ?? "",
  };
}

export default function ProfileEditDialog({
  open,
  onClose,
  profile,
}: ProfileEditDialogProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<ProfileFormState>(
    getInitialState(profile),
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange =
    (field: keyof ProfileFormState) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setFormState((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    startTransition(async () => {
      const { errorMessage } = await updateCurrentProfileAction(formState);

      if (errorMessage) {
        setFormError(errorMessage);
        return;
      }

      toast.success("Profile updated.");
      onClose();
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : onClose}
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
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Tune the parts of your profile people see first.
          </Typography>

          <TextField
            label="Username"
            value={formState.username}
            onChange={handleChange("username")}
            fullWidth
            margin="normal"
            required
            helperText="3-20 characters, lowercase letters, numbers, and underscores only."
            disabled={isPending}
          />
          <TextField
            label="Display name"
            value={formState.displayName}
            onChange={handleChange("displayName")}
            fullWidth
            margin="normal"
            helperText={`${formState.displayName.trim().length}/${MAX_DISPLAY_NAME_LENGTH}`}
            disabled={isPending}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mt: 2,
              mb: 1,
            }}
          >
            <ProfileAvatar
              src={formState.avatarUrl || null}
              name={formState.displayName.trim() || formState.username}
              size={64}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Use a generated avatar or keep a custom image URL.
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1.25, flexWrap: "wrap" }}>
                <Button
                  type="button"
                  variant="outlined"
                  disabled={isPending}
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      avatarUrl: buildGeneratedAvatarUrl(
                        createRandomAvatarSeed(current.username),
                      ),
                    }))
                  }
                >
                  Randomize avatar
                </Button>
                <Button
                  type="button"
                  color="inherit"
                  disabled={isPending}
                  onClick={() =>
                    setFormState((current) => ({
                      ...current,
                      avatarUrl: "",
                    }))
                  }
                >
                  Use default avatar
                </Button>
              </Box>
            </Box>
          </Box>
          <TextField
            label="Avatar URL"
            value={formState.avatarUrl}
            onChange={handleChange("avatarUrl")}
            fullWidth
            margin="normal"
            placeholder={buildGeneratedAvatarUrl("music4you")}
            helperText="Optional. Paste an image URL, or click Randomize avatar to use a generated one."
            disabled={isPending}
          />
          <TextField
            label="Bio"
            value={formState.bio}
            onChange={handleChange("bio")}
            fullWidth
            multiline
            minRows={4}
            margin="normal"
            helperText={`${formState.bio.trim().length}/${MAX_BIO_LENGTH}`}
            disabled={isPending}
          />

          {formError && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {formError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : "Save changes"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
