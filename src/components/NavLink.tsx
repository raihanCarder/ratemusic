"use client";

import Button from "@mui/material/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  name: string;
};

export default function NavLink({ href, name }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Button
      component={Link}
      href={href}
      disableRipple
      sx={{
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.875rem",
        borderRadius: 999,
        px: 1.75,
        py: 0.75,
        letterSpacing: 0.01,
        position: "relative",
        color: isActive ? "rgb(159, 244, 184)" : "rgba(255,255,255,0.62)",
        transition: "color 0.18s",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 5,
          left: "50%",
          transform: "translateX(-50%)",
          width: isActive ? 4 : 0,
          height: 4,
          borderRadius: "50%",
          bgcolor: "rgb(139, 224, 164)",
          transition: "width 0.18s",
        },
        "&:hover": {
          color: "rgba(255,255,255,0.92)",
          bgcolor: "rgba(255,255,255,0.05)",
        },
      }}
    >
      {name}
    </Button>
  );
}
