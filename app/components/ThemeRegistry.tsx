"use client";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: {
            main: "#FF6B00",
          },
          background: {
            default: "#F8F9FA",
            paper: "#FFFFFF",
          },
          text: {
            primary: "#1A1A1A",
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
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
