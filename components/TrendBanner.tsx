import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Chip, Paper, Typography } from "@mui/material";
import Link from "next/link";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

/**
 * トップページ用：2026年トレンド特集への誘導バナー。
 */
export default function TrendBanner() {
  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Link href="/trend2026" style={{ textDecoration: "none" }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: `2px solid ${DARK_COLOR}`,
            boxShadow: `5px 5px 0px ${BRAND_COLOR}`,
            background: `linear-gradient(120deg, ${DARK_COLOR} 60%, #3D2A1A 100%)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            transition: "all 0.15s",
            "&:hover": {
              transform: "translate(-2px, -2px)",
              boxShadow: `7px 7px 0px ${BRAND_COLOR}`,
            },
          }}
        >
          <Box>
            <Chip
              label="特集"
              size="small"
              sx={{ bgcolor: BRAND_COLOR, color: "#fff", fontWeight: 900, mb: 1 }}
            />
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 900,
                color: "#fff",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                lineHeight: 1.4,
                mb: 0.5,
              }}
            >
              🔥 2026年グルメトレンド
              <Box component="span" sx={{ color: "#FFA040" }}>大予測 10選</Box>
            </Typography>
            <Typography variant="body2" sx={{ color: "#BBB", fontWeight: 700 }}>
              プロテイン飯・レトロ食堂・AI注文——次に流行る外食を編集部が大胆予測
            </Typography>
          </Box>
          <NavigateNextIcon sx={{ color: BRAND_COLOR, fontSize: "2.5rem", flexShrink: 0 }} />
        </Paper>
      </Link>
    </Box>
  );
}
