"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import { signOutUserAction } from "../actions/users";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const { errorMessage } = await signOutUserAction();

      if (errorMessage) {
        toast.success("Failed to signout");
      } else {
        router.push("/feed");
        toast.success("Signed out");
      }
    });
  };

  return (
    <Button
      component={Link}
      href="/feed"
      variant="outlined"
      sx={{
        textTransform: "none",
        fontWeight: 700,
        borderRadius: 999,
        px: 2,
      }}
      onClick={handleSubmit}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "Sign out"}
    </Button>
  );
}
