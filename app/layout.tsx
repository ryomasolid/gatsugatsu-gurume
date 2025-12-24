import { Box, Typography } from "@mui/material"; // 追加
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link"; // 追加
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
  verification: {
    google: "XqwYNokzN4vHqTo5eWt5ocKZw6XoxJ9O0XAqUuDeyJY",
  },
  description:
    "駅周辺のがっつり食べられるお店をワンタップで検索できるアプリです。口コミ順に並び替えて、本当においしいお店を探せます。",
  keywords: ["グルメ", "ラーメン", "ランチ", "駅近", "ガッツリ"],
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
      <body className={notoSansJP.className}>
        <ThemeRegistry>
          <AppLayout>
            {/* メインコンテンツ */}
            <Box sx={{ minHeight: "calc(100vh - 200px)" }}>{children}</Box>

            <Box
              component="footer"
              sx={{
                mt: 8,
                py: 4,
                borderTop: "1px solid",
                borderColor: "divider",
                textAlign: "center",
              }}
            >
              <Link
                href="/privacy"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    "&:hover": {
                      textDecoration: "underline",
                      color: "primary.main",
                    },
                  }}
                >
                  プライバシーポリシー
                </Typography>
              </Link>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ mt: 1, display: "block" }}
              >
                © 2025 ガツガツグルメ
              </Typography>
            </Box>
          </AppLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
