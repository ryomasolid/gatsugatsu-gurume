import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営者情報",
  description:
    "ガツガツグルメの運営者情報です。当アプリの運営方針やコンセプトについてご紹介します。",
};

export default function About() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, bgcolor: "transparent" }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          運営者情報
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          「ガツガツグルメ」をご利用いただきありがとうございます。当アプリの運営に関する情報をご案内します。
        </Typography>

        <Section title="サービス概要">
          <Box sx={{ mb: 3 }}>
            <InfoRow label="サービス名" value="ガツガツグルメ" />
            <InfoRow
              label="サービス内容"
              value="駅周辺のラーメン・牛丼・定食など、がっつり食べられる飲食店の検索サービス"
            />
            <InfoRow
              label="URL"
              value="https://gatsugatsu-gurume.vercel.app"
              isLink
            />
            <InfoRow label="サービス開始日" value="2025年12月" />
          </Box>
        </Section>

        <Section title="運営者情報">
          <Box sx={{ mb: 3 }}>
            <InfoRow label="運営形態" value="個人運営" />
            <InfoRow label="運営者" value="ガツガツグルメ運営事務局" />
            <InfoRow
              label="お問い合わせ"
              value="ryomasolid@yahoo.co.jp"
              isEmail
            />
            <InfoRow label="対応時間" value="平日 10:00〜18:00（土日祝を除く）" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            ※お問い合わせへの回答には、数日お時間をいただく場合がございます。
          </Typography>
        </Section>

        <Section title="ガツガツグルメのコンセプト">
          <Typography variant="body2" paragraph>
            「ガツガツグルメ」は、「今日はガッツリ食べたい！」というシンプルな欲求に応えるために生まれました。
          </Typography>
          <Typography variant="body2" paragraph>
            忙しい毎日を過ごすビジネスパーソン、部活帰りの学生、育ち盛りのお子さんを持つご家庭など、「お腹いっぱい食べたい」と思う全ての方に向けて、駅周辺のボリューム満点な飲食店を素早く見つけられるサービスを目指しています。
          </Typography>
          <Typography variant="body2" paragraph>
            ラーメン、牛丼、定食という「黄金の3大ジャンル」に特化することで、迷わずにお店を選べる体験を提供します。口コミ評価順に並び替えることで、本当に満足できるお店との出会いをサポートします。
          </Typography>
        </Section>

        <Section title="当アプリの特徴">
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
              <strong>駅から探せる：</strong>
              最寄り駅を選ぶだけで、駅周辺のお店を簡単に検索できます。複数の駅をまとめて検索することも可能です。
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
              <strong>3大ジャンル特化：</strong>
              ラーメン、牛丼・丼物、定食に絞ることで、「がっつり食べたい」ニーズにダイレクトに応えます。
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
              <strong>口コミ順表示：</strong>
              Google Mapsの口コミ評価を基に、評判の良いお店から順に表示します。
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1.5 }}>
              <strong>シンプルな操作：</strong>
              余計な機能を省き、「検索→選ぶ→行く」のシンプルな流れを実現しています。
            </Typography>
          </Box>
        </Section>

        <Section title="利用している外部サービス">
          <Typography variant="body2" paragraph>
            当アプリでは、より良いサービスを提供するために以下の外部サービスを利用しています。
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Google Maps Platform：</strong>
              店舗情報、地図表示、口コミ情報の取得
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>HeartRails Express API：</strong>
              駅・路線情報の取得
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Google Analytics：</strong>
              サービス改善のためのアクセス解析
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              <strong>Google AdSense：</strong>
              広告配信
            </Typography>
          </Box>
        </Section>

        <Section title="免責事項">
          <Typography variant="body2" paragraph>
            当アプリに掲載されている店舗情報は、Google Maps
            Platformより取得したものです。営業時間、定休日、メニュー内容、価格等は予告なく変更される場合がありますので、ご来店前に各店舗へ直接ご確認ください。
          </Typography>
          <Typography variant="body2" paragraph>
            当アプリの利用により生じたいかなる損害についても、運営者は一切の責任を負いかねます。詳細は
            <Link
              href="/terms"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              利用規約
            </Link>
            をご確認ください。
          </Typography>
        </Section>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ご意見・ご要望がございましたら、
            <Link
              href="/contact"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              お問い合わせフォーム
            </Link>
            よりお気軽にご連絡ください。皆さまからのフィードバックをもとに、より使いやすいサービスを目指してまいります。
          </Typography>
          <Typography variant="caption" display="block" color="text.disabled">
            最終更新日：2025年12月24日
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

function InfoRow({
  label,
  value,
  isLink = false,
  isEmail = false,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  isEmail?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        borderBottom: "1px solid",
        borderColor: "grey.200",
        py: 1.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          minWidth: 140,
          fontWeight: "bold",
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Typography variant="body2">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1976d2", textDecoration: "underline" }}
          >
            {value}
          </a>
        ) : isEmail ? (
          <a
            href={`mailto:${value}`}
            style={{ color: "#1976d2", textDecoration: "underline" }}
          >
            {value}
          </a>
        ) : (
          value
        )}
      </Typography>
    </Box>
  );
}
