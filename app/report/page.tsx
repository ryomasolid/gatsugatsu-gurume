import { getPublishedReports } from "@/constants/reports";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import NextImage from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";
const SITE_URL = "https://gatsugatsu-gurume.com";

export const metadata: Metadata = {
  title: "実食レポート一覧｜編集部が実際に食べてきた記録 | ガツガツグルメ",
  description:
    "ガツガツグルメ編集部が実際に店舗を訪問し、自分で撮影した写真とともに量・味・混雑を記録した実食レポートの一覧です。",
  alternates: { canonical: "/report" },
  openGraph: {
    title: "実食レポート一覧 | ガツガツグルメ",
    description:
      "編集部が実際に食べに行った店の量・味・混雑を写真つきで記録した実食レポート。",
    url: `${SITE_URL}/report`,
    type: "website",
    siteName: "ガツガツグルメ",
    locale: "ja_JP",
  },
};

export default function ReportListPage() {
  const reports = getPublishedReports();
  // 公開済みレポートが1本もない間は、このページ自体を存在させない
  // （空のインデックスページは「薄いページ」として審査・SEO 双方でマイナスのため）
  if (reports.length === 0) notFound();

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3, "& a": { color: "#666", textDecoration: "none", fontWeight: 700 } }}
      >
        <Link href="/">ホーム</Link>
        <Typography sx={{ color: BRAND_COLOR, fontWeight: 800 }}>実食レポート</Typography>
      </Breadcrumbs>

      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 2 }}
      >
        実食レポート
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", fontWeight: 700, lineHeight: 1.9, mb: 5, maxWidth: 760 }}>
        編集部が実際に店へ行き、注文して、食べて、払ってきた記録です。
        写真はすべて編集部の撮影。量の体感・混雑・提供スピードなど、行く前に知りたかったことを正直に書いています。
      </Typography>

      <Grid container spacing={3}>
        {reports.map((r) => (
          <Grid key={r.slug} size={{ xs: 12, sm: 6, md: 4 }}>
            <Link
              href={`/report/${r.slug}`}
              style={{ textDecoration: "none", height: "100%", display: "block" }}
            >
              <Paper
                component="article"
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: `2px solid ${DARK_COLOR}`,
                  boxShadow: `4px 4px 0px ${DARK_COLOR}`,
                  transition: "all 0.15s",
                  "&:hover": {
                    transform: "translate(-2px, -2px)",
                    boxShadow: `6px 6px 0px ${BRAND_COLOR}`,
                    borderColor: BRAND_COLOR,
                  },
                }}
              >
                {r.heroImage && (
                  <Box sx={{ position: "relative", width: "100%", aspectRatio: "16 / 10" }}>
                    <NextImage
                      src={r.heroImage.src}
                      alt={r.heroImage.alt}
                      fill
                      sizes="(max-width: 600px) 100vw, 400px"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                )}
                <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1, flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      label={r.genre}
                      size="small"
                      sx={{ fontWeight: 800, bgcolor: "#FFF5ED", color: BRAND_COLOR, border: `1px solid ${BRAND_COLOR}` }}
                    />
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.3 }}>
                      <PlaceIcon sx={{ fontSize: "0.9rem", color: "#999" }} />
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "#999" }}>
                        {r.station}駅
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    component="h2"
                    sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.4 }}
                  >
                    {r.cardTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.7 }}>
                    {r.description}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#999", fontWeight: 700, mt: "auto" }}>
                    訪問日: {r.visitedAt}
                  </Typography>
                </Box>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
