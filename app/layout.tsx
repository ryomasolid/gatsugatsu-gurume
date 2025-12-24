import { Box, Typography } from "@mui/material";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import AppLayout from "./components/AppLayout";
import ThemeRegistry from "./components/ThemeRegistry";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | ガツガツグルメ",
    default: "ガツガツグルメ | 駅周辺のラーメン・牛丼・定食検索",
  },
  description:
    "「ガツガツグルメ」は、駅周辺のラーメン、牛丼、定食など、がっつり食べられるお店をワンタップで検索できるアプリです。口コミ順に並び替えて、本当においしいお店を探せます。",
  keywords: [
    "グルメ",
    "ラーメン",
    "牛丼",
    "定食",
    "ランチ",
    "駅近",
    "ガッツリ",
    "大盛り",
  ],
  verification: {
    google: "0SxWC71HO88CspxL9j_u52VvAKMuFKoaCwP8vPO5gDs",
  },
  openGraph: {
    title: "ガツガツグルメ",
    description: "駅周辺のがっつり飯を最速検索！口コミ順で失敗しないお店選び。",
    siteName: "ガツガツグルメ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ガツガツグルメ",
    description: "駅周辺のがっつり飯を最速検索！",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3362493734697220"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={notoSansJP.className}>
        <ThemeRegistry>
          <AppLayout>
            <Box sx={{ minHeight: "calc(100vh - 250px)" }}>{children}</Box>

            <Box
              component="footer"
              sx={{
                mt: 4,
                py: 3,
                borderTop: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 3,
                  mb: 1,
                }}
              >
                <Link
                  href="/privacy"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "primary.main",
                      },
                    }}
                  >
                    プライバシーポリシー
                  </Typography>
                </Link>

                <Link
                  href="/contact"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                        color: "primary.main",
                      },
                    }}
                  >
                    お問い合わせ
                  </Typography>
                </Link>
              </Box>

              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ display: "block" }}
              >
                © 2025 ガツガツグルメ
              </Typography>
            </Box>
          </AppLayout>
        </ThemeRegistry>

        <GoogleAnalytics gaId="G-3776BLEK73" />
      </body>
    </html>
  );
}
