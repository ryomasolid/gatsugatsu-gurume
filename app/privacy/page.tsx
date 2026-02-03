"use client";

import { Box, Container, Divider, Paper, Typography, Stack } from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";

export default function PrivacyPolicy() {
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
            <GavelIcon sx={{ fontSize: "3rem", color: BRAND_COLOR, mb: 1 }} />
            <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: "-0.02em" }}>
              プライバシーポリシー
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ color: "#444", lineHeight: 1.8 }}>
            ガツガツグルメ（以下、「当サイト」といいます。）は、当サイト上で提供するサービスにおける、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
          </Typography>

          <Divider sx={{ borderBottomWidth: 2, borderColor: "#EEE" }} />

          <Section title="1. 広告の配信について" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サイトでは、第三者配信の広告サービス（Google AdSense）を利用しています。
              広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報 「Cookie」(氏名、住所、メール アドレス、電話番号は含まれません) を使用することがあります。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              パーソナライズ広告を無効にする設定およびGoogleアドセンスに関する詳細については、
              <a
                href="https://policies.google.com/technologies/ads?hl=ja"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: BRAND_COLOR, fontWeight: "bold", textDecoration: "underline" }}
              >
                Googleポリシーと規約
              </a>
              をご覧ください。
            </Typography>
          </Section>

          <Section title="2. アクセス解析ツールについて" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
              このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
            </Typography>
          </Section>

          <Section title="3. 個人情報の利用目的" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サイトでは、お問い合わせの際に名前（ニックネーム）やメールアドレス等の個人情報を入力いただく場合がございます。
              これらの個人情報は、質問に対する回答や必要な情報を電子メールなどでご連絡する場合に利用するものであり、個人情報をご提供いただく際の目的以外では利用いたしません。
            </Typography>
          </Section>

          <Section title="4. 免責事項" color={BRAND_COLOR}>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サイトに掲載されている情報の正確性には万全を期していますが、利用者が当サイトの情報を用いて行う一切の行為について、当事務局は何ら責任を負うものではありません。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              また、当サイトからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
            </Typography>
            <Typography variant="body2" paragraph sx={{ lineHeight: 1.8 }}>
              当サイトで紹介している飲食店の営業時間やメニュー、価格等の情報は、外部APIの提供データに基づいています。情報は常に変動するため、必ず公式サイトやGoogleマップ等で最新の情報をご確認の上、ご利用ください。
            </Typography>
          </Section>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 700 }}>
              制定日：2025年12月24日
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 700 }}>
              最終改訂日：2026年2月3日
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 700, mt: 1 }}>
              ガツガツグルメ事務局
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

function Section({
  title,
  children,
  color,
}: {
  title: string;
  children: React.ReactNode;
  color: string;
}) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontSize: "1.2rem",
          fontWeight: 900,
          borderLeft: `6px solid ${color}`,
          pl: 2,
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