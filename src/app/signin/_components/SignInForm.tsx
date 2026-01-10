"use client";
import { useState } from "react";

import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signInUserAction } from "@/src/actions/users";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function SignInForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setFormError("Please fill in all fields.");
      return;
    }

    startTransition(async () => {
      const { errorMessage } = await signInUserAction({
        email,
        password,
      });

      if (errorMessage) {
        setFormError(errorMessage);
      } else {
        router.push("/feed");
        toast.success("User signed in!");
      }
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <TextField
        name="email"
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        required
      />

      <TextField
        name="password"
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        required
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
        sx={{ mt: 2 }}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Sign in"}
      </Button>
    </Box>
  );
}
