"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUpUserAction } from "@/src/actions/users";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { isValidUsername } from "@/src/lib/profiles/validation";

export default function SignUpForm() {
  /*
   * Sign-up component used as a form to create an account.
   */

  const [formError, setFormError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const username = fd.get("username") as string;

    setFormError(null);
    setUsernameError(null);

    if (!email || !password || !username) {
      setFormError("Please fill in all fields.");
      return;
    }

    if (!isValidUsername(username)) {
      setUsernameError(
        "Usernames must be 3-20 characters and can contain only lowercase letters, numbers, and underscores.",
      );
      return;
    }

    startTransition(async () => {
      const { errorMessage } = await signUpUserAction({
        username,
        email,
        password,
      });

      if (errorMessage) {
        setFormError(errorMessage);
      } else {
        router.push("/signin");
        toast.success("Verification link has been sent to your Email");
      }
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography
        variant="overline"
        sx={{ color: "rgb(159, 244, 184)", letterSpacing: 1.1 }}
      >
        Start your profile
      </Typography>

      <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, mt: 0.5 }}>
        Create your account
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Claim your username now, then shape the rest of your Music4You identity
        from your profile page.
      </Typography>

      <TextField
        name="username"
        label="Username*"
        fullWidth
        margin="normal"
        disabled={isPending}
        helperText="3-20 characters, lowercase letters, numbers, and underscores only."
      />

      {usernameError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {usernameError}
        </Typography>
      )}

      <TextField
        name="email"
        label="Email*"
        type="email"
        fullWidth
        margin="normal"
        disabled={isPending}
      />
      <TextField
        name="password"
        label="Password*"
        type="password"
        fullWidth
        margin="normal"
        disabled={isPending}
      />

      {formError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {formError}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2, borderRadius: 999, py: 1.2 }}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Create account"}
      </Button>
    </Box>
  );
}
