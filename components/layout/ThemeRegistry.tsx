"use client";

import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material";
import { useMemo } from "react";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useMemo(() => {
    let theme = createTheme({
      palette: {
        mode: "light",
        primary: {
          main: "#FF6B00",
          contrastText: "#FFFFFF",
        },
        background: {
          default: "#F8F9FA",
          paper: "#FFFFFF",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#666666",
        },
      },
      typography: {
        fontFamily: "var(--font-noto-sans-jp), sans-serif",
        h1: { fontWeight: 900 },
        h2: { fontWeight: 900 },
        h3: { fontWeight: 900 },
        h4: { fontWeight: 900 },
        h5: { fontWeight: 900 },
        h6: { fontWeight: 900 },
        button: { fontWeight: 800, textTransform: "none" },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(255, 107, 0, 0.2)",
              },
            },
            containedPrimary: {
              background: "linear-gradient(45deg, #FF6B00 30%, #FF8E53 90%)",
            },
          },
        },

        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
      },
    });

    return responsiveFontSizes(theme);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
