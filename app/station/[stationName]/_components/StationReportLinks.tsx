"use client";

import { getReportsByStation } from "@/constants/reports";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import NextImage from "next/image";
import Link from "next/link";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

/**
 * 駅ページに表示する、その駅の実食レポートへの内部リンクセクション。
 * 店舗リスト（データ由来）に対して、編集部の一次体験コンテンツを対置する。
 * 該当駅の公開済みレポートが無い場合は何も表示しない。
 */
export default function StationReportLinks({ stationName }: { stationName: string }) {
  const reports = getReportsByStation(stationName).slice(0, 3);
  if (reports.length === 0) return null;

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        mt: 5,
        borderRadius: 4,
        border: `2px solid ${BRAND_COLOR}`,
        bgcolor: "#FFF9F5",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        fontWeight={900}
        gutterBottom
        sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, mb: 1 }}
      >
        {stationName}駅の実食レポート
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.9, mb: 3 }}>
        編集部が{stationName}駅周辺の店に実際に行って食べてきた記録です。量の体感・混雑・味の正直な感想を写真つきで。
      </Typography>
      <Grid container spacing={2}>
        {reports.map((r) => (
          <Grid key={r.slug} size={{ xs: 12, sm: 4 }}>
            <Link
              href={`/report/${r.slug}`}
              style={{ textDecoration: "none", height: "100%", display: "block" }}
            >
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  overflow: "hidden",
                  borderRadius: 3,
                  border: "2px solid #EEE",
                  bgcolor: "#fff",
                  transition: "all 0.15s",
                  "&:hover": { borderColor: BRAND_COLOR },
                }}
              >
                {r.heroImage && (
                  <Box sx={{ position: "relative", width: "100%", aspectRatio: "16 / 9" }}>
                    <NextImage
                      src={r.heroImage.src}
                      alt={r.heroImage.alt}
                      fill
                      sizes="(max-width: 600px) 100vw, 300px"
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                )}
                <Box sx={{ p: 2 }}>
                  <Chip
                    label={r.genre}
                    size="small"
                    sx={{ mb: 1, fontWeight: 800, bgcolor: "#FFF5ED", color: BRAND_COLOR, border: `1px solid ${BRAND_COLOR}` }}
                  />
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.4 }}>
                    {r.cardTitle}
                  </Typography>
                </Box>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
