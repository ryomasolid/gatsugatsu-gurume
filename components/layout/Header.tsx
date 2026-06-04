"use client";

import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar, Typography, Box } from "@mui/material";
import Link from "next/link";

type HeaderProps = {
  onDrawerToggle: () => void;
};

export default function Header({ onDrawerToggle }: HeaderProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        display: { md: "none" }, // モバイル専用ヘッダー
        bgcolor: "rgba(255, 255, 255, 0.95)", // 透明度を少し下げて視認性アップ
        backdropFilter: "blur(10px)",
        color: "#1A1A1A",
        // 下部にパキッとしたボーダーを入れてFooterとデザインを統一
        borderBottom: "3px solid #1A1A1A",
        boxShadow: "none", // 立体感はボーダーで表現
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* 左側：ハンバーガーメニュー */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          aria-label="メニューを開く" // アクセシビリティ：Googleが好む属性
          sx={{ 
            mr: 2,
            "&:active": { color: "#FF6B00" } 
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* 中央：ロゴリンク */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 900,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              // 文字の縁取りはせず、色分けで「ガツガツ感」を演出
            }}
          >
            ガツガツ
            <Box component="span" sx={{ color: "#FF6B00" }}>
              グルメ
            </Box>
          </Typography>
        </Link>

        {/* 右側：バランス調整用のダミー要素（必要に応じて検索ボタンなどに変更可） */}
        <Box sx={{ width: 48 }} /> 
      </Toolbar>
    </AppBar>
  );
}