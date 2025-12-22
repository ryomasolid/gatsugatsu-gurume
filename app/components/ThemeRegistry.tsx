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
  typography: {
    fontFamily: notoSansJP.style.fontFamily,
  },
  palette: {
    background: {
      default: "#f4f6f8",
    },
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
