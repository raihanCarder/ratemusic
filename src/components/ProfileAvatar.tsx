"use client";

import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import type { SxProps, Theme } from "@mui/material/styles";
import { buildGeneratedAvatarUrl } from "@/src/lib/profiles/avatar";
import {
  getProfileInitials,
  isValidAbsoluteUrl,
} from "@/src/lib/profiles/validation";

type ProfileAvatarProps = {
  src: string | null;
  name: string;
  size?: number;
  sx?: SxProps<Theme>;
};

export default function ProfileAvatar({
  src,
  name,
  size = 40,
  sx,
}: ProfileAvatarProps) {
  const safeSrc =
    src && isValidAbsoluteUrl(src) ? src : buildGeneratedAvatarUrl(name);
  const [imageSrc, setImageSrc] = useState<string | null>(safeSrc);

  useEffect(() => {
    setImageSrc(safeSrc);
  }, [safeSrc]);

  return (
    <Avatar
      src={imageSrc ?? undefined}
      alt={name}
      imgProps={{
        referrerPolicy: "no-referrer",
        onError: () => setImageSrc(null),
      }}
      sx={{
        width: size,
        height: size,
        fontWeight: 800,
        letterSpacing: 0.4,
        bgcolor: "rgba(139, 224, 164, 0.16)",
        color: "rgb(159, 244, 184)",
        ...sx,
      }}
    >
      {!imageSrc ? getProfileInitials(name) : null}
    </Avatar>
  );
}
