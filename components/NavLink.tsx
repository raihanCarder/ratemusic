"use client";

import Button from "@mui/material/Button";
import Link from "next/link";

type NavLinkProps = {
  href: string;
  name: string;
};

export default function NavLink({ href, name }: NavLinkProps) {
  return (
    <Button
      component={Link}
      href={href}
      color="inherit"
      sx={{ textTransform: "none", fontWeight: 600 }}
    >
      {name}
    </Button>
  );
}
