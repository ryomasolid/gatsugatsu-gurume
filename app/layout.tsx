import LayoutClientWrapper from "@/components/layout/LayoutClientWrapper";
import ThemeRegistry from "@/components/layout/ThemeRegistry";
import { Box, Typography, Container, Stack } from "@mui/material";
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
    "「ガツガツグルメ」は、駅周辺のがっつり飯を最速検索！2026年最新の口コミベースで失敗しないデカ盛り・高カロリー店選びをサポート。",
  keywords: [
    "グルメ", "ラーメン", "牛丼", "定食", "ランチ", "駅近", "ガッツリ", "大盛り", "デカ盛り", "2026",
  ],
  verification: { google: "0SxWC71HO88CspxL9j_u52VvAKMuFKoaCwP8vPO5gDs" },
  openGraph: {
    title: "ガツガツグルメ",
    description: "駅周辺のがっつり飯を最速検索！本能で喰らえ。",
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
  const currentYear = new Date().getFullYear();

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
              <Box
                component="main"
                sx={{ minHeight: "calc(100vh - 300px)" }}
              >
                {children}
              </Box>

              <Box
                component="footer"
                sx={{
                  py: { xs: 6, md: 8 },
                  bgcolor: "#fff",
                  borderTop: "4px solid #1A1A1A",
                  position: "relative",
                  px: 2,
                }}
              >
                <Container maxWidth="lg">
                  <Stack
                    spacing={4}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Link href="/" style={{ textDecoration: "none" }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 900,
                          color: "#1A1A1A",
                          letterSpacing: "-0.02em",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        ガツガツ
                        <Box component="span" sx={{ color: "#FF6B00" }}>
                          グルメ
                        </Box>
                      </Typography>
                    </Link>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 2, sm: 4 }}
                      alignItems="center"
                    >
                      {[
                        { label: "プライバシーポリシー", href: "/privacy" },
                        { label: "お問い合わせ", href: "/contact" },
                      ].map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          style={{ textDecoration: "none" }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 700,
                              color: "#444",
                              transition: "all 0.2s",
                              fontSize: { xs: "0.9rem", md: "0.85rem" },
                              borderBottom: "2px solid transparent",
                              pb: 0.5,
                              "&:hover": {
                                color: "#FF6B00",
                                borderColor: "#FF6B00",
                              },
                            }}
                          >
                            {link.label}
                          </Typography>
                        </Link>
                      ))}
                    </Stack>

                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#999",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                        }}
                      >
                        © 2025–{currentYear} GATSUGATSU GURUME
                      </Typography>
                    </Box>
                  </Stack>
                </Container>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    opacity: 0.05,
                    fontSize: "3rem",
                    userSelect: "none",
                    display: { xs: "none", sm: "block" },
                  }}
                >
                  🍜
                </Box>
              </Box>
            </LayoutClientWrapper>
          </ThemeRegistry>
        </AppRouterCacheProvider>

        <GoogleAnalytics gaId="G-3776BLEK73" />
      </body>
    </html>
  );
}