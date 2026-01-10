"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUpUserAction } from "@/src/actions/users";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export default function SignUpForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const username = fd.get("username") as string;

    if (!email || !password || !username) {
      setFormError("Please fill in all fields.");
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
      <Typography variant="h4" gutterBottom>
        Welcome 👋
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={2}>
        Create your account to get started.
      </Typography>

      <TextField name="username" label="Username*" fullWidth margin="normal" />
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
        sx={{ mt: 2 }}
        disabled={isPending}
      >
        {isPending ? <Loader2 className="animate-spin" /> : "Create account"}
      </Button>
    </Box>
  );
}
