"use client";

import { Box, Container, Divider, Paper, Typography, Stack } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContactMailIcon from "@mui/icons-material/ContactMail";

export default function Contact() {
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
          {/* ヘッダー */}
          <Box sx={{ textAlign: "center" }}>
            <MailOutlineIcon sx={{ fontSize: "3.5rem", color: BRAND_COLOR, mb: 1 }} />
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-0.02em" }}>
              お問い合わせ
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: "#444", lineHeight: 2, textAlign: "center" }}>
            掲載情報の修正依頼、新規店舗の推薦、その他ご意見などは以下のフォームよりお送りください。
          </Typography>

          {/* メイン：Googleフォーム */}
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 900, mb: 2, display: "flex", alignItems: "center", gap: 1 }}
            >
              <ContactMailIcon sx={{ color: BRAND_COLOR }} />
              専用フォーム
            </Typography>
            <Box
              sx={{
                width: "100%",
                borderRadius: 4,
                overflow: "hidden",
                border: `2px solid #EEE`,
                bgcolor: "#fff",
              }}
            >
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfnzBlDbXx-587_rCzE71thhcSurJPXt8brwY6NnpLHmcT-sg/viewform?embedded=true"
                width="100%"
                height="800"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                style={{ display: "block" }}
              >
                読み込んでいます…
              </iframe>
            </Box>
          </Box>

          <Divider />

          {/* 予備：直接メール */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ fontWeight: 800, mb: 1 }}>
              フォームが動作しない場合
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              お手数ですが、以下のメールアドレスまで直接ご連絡ください。
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mt: 1,
                fontWeight: 900,
                color: BRAND_COLOR,
                textDecoration: "underline",
                wordBreak: "break-all"
              }}
            >
              ryomasolid@yahoo.co.jp
            </Typography>
          </Box>

          <Box sx={{ bgcolor: "#F8F8F8", p: 3, borderRadius: 4, border: "1px solid #EEE" }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.6 }}>
              ※ご入力いただいた個人情報は、お問い合わせへの回答目的以外には使用いたしません。
              通常、2〜3営業日以内にご返信いたしますが、内容によりお時間をいただく場合がございます。
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}