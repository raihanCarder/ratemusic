"use client";

import Button from "@mui/material/Button";
import Link from "next/link";

type NavLinkProps = {
  href: string;
  name: string;
  sxDesign?: object;
};

export default function NavLink({
  href,
  name,
  sxDesign = { textTransform: "none", fontWeight: 600 },
}: NavLinkProps) {
  /*
    Link's Nav button's to correct reference.
  */
  return (
    <Button component={Link} href={href} color="inherit" sx={sxDesign}>
      {name}
    </Button>
  );
}
