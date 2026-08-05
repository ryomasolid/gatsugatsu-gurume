import { getPublishedReports } from "@/constants/reports";
import EastIcon from "@mui/icons-material/East";
import PlaceIcon from "@mui/icons-material/Place";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import NextImage from "next/image";
import Link from "next/link";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

/**
 * トップページに表示する実食レポートへの導線セクション。
 * サイトの独自性の核となる一次体験コンテンツを最上部で見せる。
 * 公開済みレポートが 0 本の間は何も表示しない（空セクションを出さない）。
 */
export default function ReportShowcase() {
  const featured = getPublishedReports().slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: 900, fontSize: { xs: "1.5rem", md: "2rem" } }}
        >
          実食レポート
        </Typography>
        <Link
          href="/report"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
        >
          <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "0.95rem" }}>
            レポート一覧を見る
          </Typography>
          <EastIcon sx={{ color: BRAND_COLOR, fontSize: "1.1rem" }} />
        </Link>
      </Box>
      <Typography variant="body1" sx={{ color: "#666", fontWeight: 700, mb: 3, lineHeight: 1.8 }}>
        編集部が実際に食べに行き、自分で撮った写真とともに量・味・混雑を記録した一次体験の記事です。
      </Typography>

      <Grid container spacing={2}>
        {featured.map((r) => (
          <Grid key={r.slug} size={{ xs: 12, sm: 6, md: 3 }}>
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
                      sizes="(max-width: 600px) 100vw, 300px"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                )}
                <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 0.8, flexGrow: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                    variant="subtitle2"
                    component="h3"
                    sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.4 }}
                  >
                    {r.cardTitle}
                  </Typography>
                </Box>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
