import { COLUMNS } from "@/constants/columns";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Link from "next/link";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

/**
 * 駅ページ下部に表示する、がっつり飯コラムへの内部リンクセクション。
 * 店舗リスト以外の読み物への回遊を促し、ページの情報量を補強する。
 */
export default function StationColumnLinks({ stationName }: { stationName: string }) {
  // 食べ方・知識系の汎用記事を中心にピックアップ
  const picks = COLUMNS.filter((c) =>
    ["jiro-kei-guide", "dekamori-kanshoku", "ramen-genre-zukan"].includes(c.slug)
  );
  if (picks.length === 0) return null;

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        mt: 5,
        borderRadius: 4,
        border: "2px solid #1A1A1A",
        bgcolor: "#fff",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        fontWeight={900}
        gutterBottom
        sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, mb: 1 }}
      >
        {stationName}でがっつり食べる前に
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.9, mb: 3 }}>
        二郎系の頼み方やデカ盛りの完食のコツを知っておくと、{stationName}駅でのがっつり飯がもっと楽しめます。
        編集部の読み物もあわせてどうぞ。
      </Typography>
      <Grid container spacing={2}>
        {picks.map((c) => (
          <Grid key={c.slug} size={{ xs: 12, sm: 4 }}>
            <Link
              href={`/column/${c.slug}`}
              style={{ textDecoration: "none", height: "100%", display: "block" }}
            >
              <Box
                sx={{
                  p: 2.5,
                  height: "100%",
                  borderRadius: 3,
                  border: "2px solid #EEE",
                  transition: "all 0.15s",
                  "&:hover": { borderColor: BRAND_COLOR, bgcolor: "#FFF9F5" },
                }}
              >
                <Typography variant="h5" component="span" sx={{ display: "block", mb: 1 }}>
                  {c.emoji}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.4 }}>
                  {c.cardTitle}
                </Typography>
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
