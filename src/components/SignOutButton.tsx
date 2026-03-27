"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import toast from "react-hot-toast";
import Button from "@mui/material/Button";
import { signOutUserAction } from "../actions/users";
import { Loader2 } from "lucide-react";

type SignOutButtonProps = {
  fullWidth?: boolean;
};

export default function SignOutButton({
  fullWidth = false,
}: SignOutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const { errorMessage } = await signOutUserAction();

      if (errorMessage) {
        toast.error("Failed to sign out.");
      } else {
        router.push("/feed");
        router.refresh();
        toast.success("Signed out.");
      }
    });
  };

  return (
    <Button
      variant="outlined"
      sx={{
        textTransform: "none",
        fontWeight: 700,
        borderRadius: 999,
        px: 2,
      }}
      onClick={handleSubmit}
      color="error"
      disabled={isPending}
      fullWidth={fullWidth}
    >
      {isPending ? <Loader2 className="animate-spin" /> : "Sign out"}
    </Button>
  );
}
