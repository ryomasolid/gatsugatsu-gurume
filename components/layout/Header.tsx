"use client";

import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

type HeaderProps = {
  onDrawerToggle: () => void;
};

export default function Header({ onDrawerToggle }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        display: { md: "none" }, // デスクトップでは非表示
        bgcolor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
        color: "text.primary",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        zIndex: (theme) => theme.zIndex.drawer + 1, // サイドバーより前面に配置
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            color: "#1A1A1A",
            textShadow: "1.2px 1.2px 0px #FF6B00",
          }}
        >
          ガツガツグルメ
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
