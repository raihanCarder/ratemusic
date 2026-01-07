"use client";
import { useState } from "react";

import { Box, Button, TextField, Typography } from "@mui/material";

export default function SignInForm() {
  /*
   * Sign-In Form used in Sign-in page. Sign-in includes password and email.
   */

  const [formError, setFormError] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log({ email, password });
  };
  // const { error } = await supabase.auth.signInWithPassword({
  //   email,
  //   password,
  // });

  // if (error) {
  //   setFormError("Invalid Email or Password");
  //   return;
  // } else {
  //   // TODO: Implement sign in with account information
  // }
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

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Sign in
      </Button>
    </Box>
  );
}
