"use client";

import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { useMemo } from "react";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  // OSのダークモード設定を検知
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#FF6B00", // ガツガツオレンジ
          },
          background: {
            // ダークモード時は漆黒、ライトモード時は薄いグレー
            default: prefersDarkMode ? "#0A0A0A" : "#F8F9FA",
            paper: prefersDarkMode ? "#1A1A1A" : "#FFFFFF",
          },
          text: {
            primary: prefersDarkMode ? "#FFFFFF" : "#1A1A1A",
          },
        },
        typography: {
          fontFamily: "var(--font-noto-sans-jp)",
          h4: { fontWeight: 900 },
          h5: { fontWeight: 900 },
          h6: { fontWeight: 900 },
        },
        shape: {
          borderRadius: 12,
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* これが背景色やテキスト色を自動調整してくれます */}
      {children}
    </ThemeProvider>
  );
}
