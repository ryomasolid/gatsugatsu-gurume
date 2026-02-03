"use client";

import { Box, Container, Typography, Stack, Paper, Divider } from "@mui/material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import StarsIcon from "@mui/icons-material/Stars";
import InfoIcon from "@mui/icons-material/Info";

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
        <Stack spacing={5}>
          {/* ヘッダーエリア */}
          <Box sx={{ textAlign: "center" }}>
            <WhatshotIcon sx={{ fontSize: "4rem", color: BRAND_COLOR, mb: 2 }} />
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-0.02em", mb: 1 }}>
              ガツガツグルメとは
            </Typography>
            <Typography variant="subtitle1" sx={{ color: BRAND_COLOR, fontWeight: 800 }}>
              - 駅近・爆盛り・高コスパ特化型検索ガイド -
            </Typography>
          </Box>

          <Divider sx={{ borderBottomWidth: 3, borderColor: DARK_COLOR }} />

          {/* ミッションステートメント */}
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <StarsIcon sx={{ color: BRAND_COLOR }} />
              私たちのミッション
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.8, mb: 2, color: DARK_COLOR }}>
              「空腹は、最大のスパイスではない。最大の『敵』だ。」
            </Typography>
            <Typography variant="body1" sx={{ color: "#444", lineHeight: 2 }}>
              現代の駅周辺は飲食店で溢れています。しかし、本当に腹が減っている時に「期待外れのボリューム」でガッカリした経験はありませんか？
              ガツガツグルメは、日々を全力で戦う人々の「腹を満たしたい」という本能に直接応えるため、駅徒歩数分以内の【がっつり飯】だけを厳選して届ける、日本初（自社調べ）の特化型サーチエンジンです。
            </Typography>
          </Box>

          {/* 独自基準（Googleへのアピール） */}
          <Box sx={{ bgcolor: "#F8F8F8", p: { xs: 3, md: 5 }, borderRadius: 6, border: `2px solid ${DARK_COLOR}` }}>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
              <CheckCircleOutlineIcon sx={{ color: BRAND_COLOR }} />
              厳格な掲載基準（キュレーションポリシー）
            </Typography>
            <Stack spacing={3}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "1.2rem" }}>01</Typography>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>圧倒的な満腹感（ボリューム）の保証</Typography>
                  <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                    大盛り、デカ盛り、おかわり自由。提供される食事の「密度」と「量」に妥協がない店舗のみを抽出しています。
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "1.2rem" }}>02</Typography>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>「最速」でアクセス可能な立地条件</Typography>
                  <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                    忙しい移動の合間でも立ち寄れるよう、駅改札から徒歩圏内（概ね500m以内）に特化し、移動時間を最小化します。
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "1.2rem" }}>03</Typography>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>独自の解析アルゴリズムによる選別</Typography>
                  <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                    APIの生データをそのまま表示するのではなく、独自の「ガツガツタグ検出システム」により、口コミや詳細データから「本当に量が多い店」を自動・手動を組み合わせて判別しています。
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>

          {/* 信頼性への取り組み */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <InfoIcon sx={{ color: BRAND_COLOR }} />
              運営の透明性と正確性について
            </Typography>
            <Typography variant="body1" sx={{ color: "#444", lineHeight: 2 }}>
              ガツガツグルメでは、Google Maps API等の最新データを利用しつつ、情報の鮮度を保つために定期的なメンテナンスを行っています。
              また、ユーザーの皆様からの「ここもがっつりだった！」「情報が古い」といったリアルなフィードバックを元に、データベースを日々ブラッシュアップしています。
            </Typography>
            <Typography variant="body2" sx={{ mt: 3, p: 2, borderLeft: `4px solid ${BRAND_COLOR}`, bgcolor: "#FFF9F5", color: "#666" }}>
              ※掲載情報はAPIから取得したものを独自に加工・編集しています。最新の営業時間やメニューについては、必ずリンク先のGoogleマップ等で最終確認を行ってください。
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}