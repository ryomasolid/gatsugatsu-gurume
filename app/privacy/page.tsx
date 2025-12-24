import { Box, Container, Divider, Paper, Typography } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, bgcolor: "transparent" }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          プライバシーポリシー
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          「ガツガツグルメ」（以下、「当アプリ」といいます。）における利用者情報の取り扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
        </Typography>

        <Section title="1. 広告の配信について">
          <Typography variant="body2" paragraph>
            当アプリでは、第三者配信の広告サービス（Google
            AdSense）を利用しています。
            このような広告配信事業者は、ユーザーの興味に応じた商品やサービスの広告を表示するため、当サイトや他サイトへのアクセスに関する情報
            「Cookie」(氏名、住所、メール アドレス、電話番号は含まれません)
            を使用することがあります。
          </Typography>
          <Typography variant="body2" paragraph>
            Cookieを無効にする設定およびGoogleアドセンスに関する詳細は
            <a
              href="https://policies.google.com/technologies/ads?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              「Googleポリシーと規約」
            </a>
            をご覧ください。
          </Typography>
        </Section>

        <Section title="2. アクセス解析ツールについて">
          <Typography variant="body2" paragraph>
            当アプリでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています（または利用を予定しています）。
            このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
            この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。
          </Typography>
        </Section>

        <Section title="3. 免責事項">
          <Typography variant="body2" paragraph>
            当アプリに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
            また、当アプリからリンクやバナーなどによって他のサイトに移動された場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
            飲食店の営業時間や定休日などは変更されている場合がありますので、ご利用の際は店舗に直接ご確認ください。
          </Typography>
        </Section>

        <Section title="4. 本ポリシーの変更">
          <Typography variant="body2" paragraph>
            当アプリは、必要に応じて本ポリシーを変更します。変更後のプライバシーポリシーは、当アプリ内に掲載したときから効力を生じるものとします。
          </Typography>
        </Section>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="caption" display="block" color="text.secondary">
            <strong>制定日：</strong>2025年12月24日
          </Typography>
          <Typography variant="caption" display="block" color="text.secondary">
            <strong>お問い合わせ：</strong>
            ryomasolid@yahoo.co.jp までご連絡ください。
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

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
