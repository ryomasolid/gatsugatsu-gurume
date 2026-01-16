import LayoutClientWrapper from "@/components/layout/LayoutClientWrapper";
import PopularStations from "@/components/layout/PopularStations";
import ThemeRegistry from "@/components/layout/ThemeRegistry";
import { Box, Typography } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://gatsugatsu-gurume.com"),
  alternates: { canonical: "/" },
  title: {
    template: "%s | ガツガツグルメ",
    default: "ガツガツグルメ | 駅周辺のラーメン・牛丼・定食検索",
  },
  icons: { icon: "/favicon.ico", apple: "/apple-icon.png" },
  description:
    "「ガツガツグルメ」は、駅周辺のがっつり飯を最速検索！口コミ順で失敗しないお店選び。",
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
  verification: { google: "0SxWC71HO88CspxL9j_u52VvAKMuFKoaCwP8vPO5gDs" },
  openGraph: {
    title: "ガツガツグルメ",
    description: "駅周辺のがっつり飯を最速検索！",
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
      <body className={`${notoSansJP.className} ${notoSansJP.variable}`}>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <LayoutClientWrapper>
              {/* コンテンツエリア */}
              <Box sx={{ minHeight: "calc(100vh - 400px)" }}>{children}</Box>

              {/* フッターエリア */}
              <Box
                component="footer"
                sx={{
                  mt: 8,
                  py: 6,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  textAlign: "center",
                  bgcolor: "white",
                  mx: -4,
                  px: 4,
                }}
              >
                <PopularStations />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                    mt: 4,
                    mb: 2,
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
                        "&:hover": {
                          color: "primary.main",
                          textDecoration: "underline",
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
                        "&:hover": {
                          color: "primary.main",
                          textDecoration: "underline",
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
                  © 2025–{new Date().getFullYear()} ガツガツグルメ
                </Typography>
              </Box>
            </LayoutClientWrapper>
          </ThemeRegistry>
        </AppRouterCacheProvider>

        <GoogleAnalytics gaId="G-3776BLEK73" />
      </body>
    </html>
  );
}
