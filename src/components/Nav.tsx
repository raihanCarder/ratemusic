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
          px: 2,
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
  /*
    Stream the shell immediately and resolve account state separately so discovery
    pages do not wait on auth/profile reads.
  */

  return (
    <NavClient>
      <Suspense fallback={<NavAccountFallback />}>
        <NavAccountSlot />
      </Suspense>
    </NavClient>
  );
}
