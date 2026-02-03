"use client";

import { Box, Container, Typography, Stack, Paper } from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function AboutPage() {
  const BRAND_COLOR = "#FF6B00";
  const DARK_COLOR = "#1A1A1A";

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 8 },
          borderRadius: 8,
          border: `3px solid ${DARK_COLOR}`,
          boxShadow: `10px 10px 0px ${DARK_COLOR}`,
          bgcolor: "#fff",
        }}
      >
        <Stack spacing={4}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <WhatshotIcon sx={{ fontSize: "4rem", color: BRAND_COLOR, mb: 2 }} />
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-0.02em" }}>
              ガツガツグルメとは
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.8 }}>
            「空腹は、最大のスパイスではない。最大の『敵』だ。」
          </Typography>

          <Typography variant="body1" sx={{ color: "#444", lineHeight: 2 }}>
            ガツガツグルメは、ただの飲食店検索サイトではありません。
            日々、駅という戦場で戦うすべての人々へ、明日への活力を注入するための「がっつり飯」に特化したサーチエンジンです。
          </Typography>

          <Box sx={{ bgcolor: "#F8F8F8", p: 4, borderRadius: 4, border: `2px solid ${DARK_COLOR}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircleOutlineIcon sx={{ color: BRAND_COLOR }} />
              私たちの掲載基準（独自基準）
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_COLOR }}>01</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  駅改札から「迷わず」アクセスできる立地であること。
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_COLOR }}>02</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  「大盛り」「デカ盛り」「おかわり自由」など、圧倒的な満腹感を提供していること。
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_COLOR }}>03</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  SNSや口コミで、実際に「がっつり食べたい層」から高い支持を得ていること。
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Typography variant="body1" sx={{ color: "#444", lineHeight: 2 }}>
            私たちはAPIから取得した膨大なデータを、独自のアルゴリズム（独自のタグ検出機能）で解析し、
            本当に「がっつり」を求めているユーザーの感性に響く店だけを抽出しています。
            あなたの「今日の一杯」が、最高のものになることを約束します。
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}