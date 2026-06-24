import { COLUMNS } from "@/constants/columns";
import EastIcon from "@mui/icons-material/East";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import Link from "next/link";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

/**
 * トップページに表示する、編集部オリジナルコラムへの導線セクション。
 * 店舗検索だけでなく「読み物」も提供するサイトであることを示す。
 */
export default function ColumnShowcase() {
  // トップでは新しめ・主要な記事を先頭から数本だけ見せる
  const featured = COLUMNS.slice(0, 4);

  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{ fontWeight: 900, fontSize: { xs: "1.5rem", md: "2rem" } }}
        >
          がっつり飯コラム
        </Typography>
        <Link
          href="/column"
          style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
        >
          <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "0.95rem" }}>
            記事一覧を見る
          </Typography>
          <EastIcon sx={{ color: BRAND_COLOR, fontSize: "1.1rem" }} />
        </Link>
      </Box>
      <Typography variant="body1" sx={{ color: "#666", fontWeight: 700, mb: 3, lineHeight: 1.8 }}>
        二郎系ラーメンの食べ方、デカ盛り完食のコツ、外食とカロリーの付き合い方まで。
        がっつり飯をもっと楽しむための編集部オリジナル記事をお届けします。
      </Typography>

      <Grid container spacing={2}>
        {featured.map((c) => (
          <Grid key={c.slug} size={{ xs: 12, sm: 6, md: 3 }}>
            <Link
              href={`/column/${c.slug}`}
              style={{ textDecoration: "none", height: "100%", display: "block" }}
            >
              <Paper
                component="article"
                elevation={0}
                sx={{
                  p: 2.5,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Typography variant="h5" component="span">
                    {c.emoji}
                  </Typography>
                  <Chip
                    label={c.category}
                    size="small"
                    sx={{ fontWeight: 800, bgcolor: "#FFF5ED", color: BRAND_COLOR, border: `1px solid ${BRAND_COLOR}` }}
                  />
                </Box>
                <Typography
                  variant="subtitle1"
                  component="h3"
                  sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.3 }}
                >
                  {c.cardTitle}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
