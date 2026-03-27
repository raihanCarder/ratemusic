"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import type { AccountNavUser } from "@/src/lib/profiles/types";
import ProfileAvatar from "./ProfileAvatar";

type AccountMenuProps = {
  account: AccountNavUser;
};

export default function AccountMenu({ account }: AccountMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        color="inherit"
        endIcon={<ExpandMoreRoundedIcon />}
        sx={{
          textTransform: "none",
          borderRadius: 999,
          px: 1,
          py: 0.75,
          minWidth: 0,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <ProfileAvatar
          src={account.avatarUrl}
          name={account.preferredName}
          size={34}
        />
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            textAlign: "left",
            minWidth: 0,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {account.preferredName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            @{account.username}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 220,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            backgroundImage:
              "linear-gradient(180deg, rgba(139, 224, 164, 0.08), rgba(18, 18, 18, 0.98))",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {account.preferredName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            @{account.username}
          </Typography>
        </Box>
        <Divider />
        <MenuItem component={Link} href="/profile" onClick={handleClose}>
          <ListItemIcon>
            <PersonOutlineRoundedIcon fontSize="small" />
          </ListItemIcon>
          View profile
        </MenuItem>
        <MenuItem component={Link} href="/settings" onClick={handleClose}>
          <ListItemIcon>
            <SettingsRoundedIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
      </Menu>
    </>
  );
}

