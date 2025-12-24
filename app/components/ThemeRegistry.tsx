// app/components/ThemeRegistry.tsx
"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Noto_Sans_JP } from "next/font/google";
import React from "react";

// フォント設定
const notoSansJP = Noto_Sans_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// テーマ設定
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF6B00", // 鮮やかなオレンジ
    },
    secondary: {
      main: "#1A1A1A", // 深い黒
    },
    background: {
      default: "#F8F9FA", // 少しグレーがかった背景でカードを際立たせる
    },
  },
  typography: {
    fontFamily: notoSansJP.style.fontFamily,
    h1: { fontWeight: 900 },
    h4: { fontWeight: 900 },
  },
});

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        {/* CssBaselineでブラウザごとのスタイル差異をリセット */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
