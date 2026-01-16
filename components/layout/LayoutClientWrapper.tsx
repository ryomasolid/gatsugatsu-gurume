"use client";

import { Box, Drawer } from "@mui/material";
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DRAWER_WIDTH = 300;

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: "flex" }}>
      {/* スマホ用ヘッダー */}
      <Header onDrawerToggle={handleDrawerToggle} />

      {/* サイドバーナビゲーション */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              border: "none",
            },
          }}
        >
          <Sidebar onClose={handleDrawerToggle} />
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              borderRight: "1px solid rgba(0,0,0,0.06)",
              bgcolor: "white",
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
          p: { xs: 2, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: { xs: 8, md: 0 }, // スマホヘッダー分のマージン
          bgcolor: "#F8F9FA",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
