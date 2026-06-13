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

        // iOS Safari: font-size < 16px のフォームにフォーカスすると自動ズームする問題を防ぐ
        MuiInputBase: {
          styleOverrides: {
            input: {
              fontSize: "1rem",
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            select: {
              fontSize: "1rem",
            },
          },
        },

        // Select展開時のドロップダウンメニュー：枠線と影で背景から分離し、
        // 太字＋ゆとりのある行間で見やすくする
        MuiMenu: {
          styleOverrides: {
            paper: {
              borderRadius: 12,
              border: "2px solid #1A1A1A",
              boxShadow: "4px 4px 0px rgba(26, 26, 26, 0.9)",
              maxHeight: 360,
              marginTop: 4,
            },
            list: {
              padding: "6px",
            },
          },
        },
        MuiMenuItem: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "#1A1A1A",
              paddingTop: 10,
              paddingBottom: 10,
              marginBottom: 2,
              "&:hover": {
                backgroundColor: "#FFF5ED",
                color: "#FF6B00",
              },
              "&.Mui-selected": {
                backgroundColor: "#FFF5ED",
                color: "#FF6B00",
                fontWeight: 900,
                "&:hover": {
                  backgroundColor: "#FFE8D9",
                },
              },
              "&.Mui-disabled": {
                opacity: 0.55,
                fontWeight: 700,
              },
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
