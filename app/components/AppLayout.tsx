"use client";

import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import Sidebar from "./Sidebar";

const DRAWER_WIDTH = 300;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  // md(900px)以下の時はスマホ/タブレットモード
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* スマホ用ヘッダー (PCでは非表示) */}
      <AppBar
        position="fixed"
        sx={{
          display: { md: "none" },
          bgcolor: "white",
          color: "text.primary",
          boxShadow: 1,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 900,
              letterSpacing: "0.02em",
              background: "none",
              WebkitBackgroundClip: "initial",
              WebkitTextFillColor: "initial",
              color: (theme) =>
                theme.palette.mode === "dark" ? "#FFFFFF" : "#1A1A1A",
              textShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 0 8px rgba(255, 107, 0, 0.8)" // ダーク：高級感のある発光
                  : "1.5px 1.5px 0px #FF6B00", // ライト：クッキリしたオレンジの立体感
            }}
          >
            ガツガツグルメ
          </Typography>
        </Toolbar>
      </AppBar>

      {/* サイドバー部分 (Drawer) */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {/* スマホ用: Temporary Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // スマホでのパフォーマンス向上
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          {/* ドロワーの中身（スマホなら閉じる機能付き） */}
          <Sidebar onClose={handleDrawerToggle} />
        </Drawer>

        {/* PC用: Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: "1px solid rgba(0,0,0,0.08)",
            },
          }}
          open
        >
          <Sidebar />
        </Drawer>
      </Box>

      {/* メインコンテンツエリア */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: "background.default",
          minHeight: "100vh",
          mt: { xs: 7, md: 0 }, // スマホはヘッダー分下げる
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
