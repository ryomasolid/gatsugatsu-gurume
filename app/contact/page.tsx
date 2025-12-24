"use client";

import { Box, Container, Divider, Paper, Typography } from "@mui/material";

export default function Contact() {
  return (
    <Container maxWidth="md">
      <Paper elevation={0} sx={{ bgcolor: "transparent" }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          お問い合わせ
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          「ガツガツグルメ」へのご意見、掲載情報の修正、おすすめのグルメ情報などは以下のフォームよりお気軽にお送りください。
        </Typography>

        <Section title="お問い合わせフォーム">
          <Box
            sx={{
              width: "100%",
              mt: 2,
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid",
              borderColor: "grey.200",
              bgcolor: "#fff",
            }}
          >
            <iframe
              // ▼ ここにGoogle フォームの「送信」>「＜＞」で取得したURLを貼り付けてください
              src="https://docs.google.com/forms/d/e/1FAIpQLSfnzBlDbXx-587_rCzE71thhcSurJPXt8brwY6NnpLHmcT-sg/viewform?usp=header"
              width="100%"
              height="900" // 項目数に合わせて少し高めに設定しています
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              style={{ display: "block" }}
            >
              読み込んでいます…
            </iframe>
          </Box>
        </Section>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography
            variant="caption"
            display="block"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            <strong>個人情報の取り扱いについて：</strong>
            ご入力いただいた情報は、お問い合わせへの回答および対応のためにのみ利用し、当アプリのプライバシーポリシーに従って適切に管理いたします。
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            ※すべてのメッセージに目を通しておりますが、内容によっては返信を差し控えさせていただく場合がございます。あらかじめご了承ください。
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

// デザインを統一するためのセクションコンポーネント
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontSize: "1.1rem",
          fontWeight: "bold",
          borderLeft: "4px solid #1976d2",
          pl: 1.5,
          mb: 2,
          lineHeight: 1.4,
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}
