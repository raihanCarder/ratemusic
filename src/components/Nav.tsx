import { Suspense } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { getCurrentAccountNavUser } from "../lib/profiles/server";
import AccountMenu from "./AccountMenu";
import NavClient from "./NavClient";

function NavAccountFallback() {
  return (
    <Box
      sx={{
        width: { xs: 42, sm: 148 },
        height: 40,
        borderRadius: 999,
        border: "1px solid",
        borderColor: "divider",
        opacity: 0.35,
      }}
    />
  );
}

function SignInNavButton() {
  return (
    <Link href="/signin" style={{ textDecoration: "none" }}>
      <Button
        component="span"
        variant="outlined"
        sx={{
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 999,
          px: 2.25,
          fontSize: "0.875rem",
          borderColor: "rgba(139, 224, 164, 0.45)",
          color: "rgb(159, 244, 184)",
          transition: "border-color 0.18s, background 0.18s",
          "&:hover": {
            borderColor: "rgba(139, 224, 164, 0.85)",
            bgcolor: "rgba(139, 224, 164, 0.07)",
          },
        }}
      >
        Sign in
      </Button>
    </Link>
  );
}

async function NavAccountSlot() {
  const account = await getCurrentAccountNavUser();

  if (!account) {
    return <SignInNavButton />;
  }

  return <AccountMenu account={account} />;
}

export default function Nav() {
  return (
    <NavClient>
      <Suspense fallback={<NavAccountFallback />}>
        <NavAccountSlot />
      </Suspense>
    </NavClient>
  );
}
