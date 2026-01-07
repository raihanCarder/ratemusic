"use client";

import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function SignUpForm() {
  const [formError, setFormError] = useState<string | null>(null);

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

    console.log({ email, password, username });

    // TODO: Check if username or email is already in system. if so then error
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
      />
      <TextField
        name="password"
        label="Password*"
        type="password"
        fullWidth
        margin="normal"
      />

      {formError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {formError}
        </Typography>
      )}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Create account
      </Button>
    </Box>
  );
}
