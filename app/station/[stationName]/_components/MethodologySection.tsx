import { Box, Paper, Typography } from "@mui/material";
import Link from "next/link";

/**
 * 掲載基準・データソース・更新頻度を説明する透明性セクション。
 * 全駅ページ共通の注記として表示する。
 */
export default function MethodologySection() {
  const items = [
    {
      title: "データソース",
      body: "Google Places APIのテキスト検索結果をもとに、駅周辺（概ね1km圏内）の店舗を取得しています。店名・カテゴリ情報から独自のルールでジャンル（ラーメン・丼もの・定食・カレー・中華など）を自動判定し、がっつり系に該当する店舗のみを掲載しています。",
    },
    {
      title: "徒歩分数の算出方法",
      body: "駅の座標と店舗の位置情報から直線距離を求め、分速80m（不動産表示で用いられる一般的な基準）で換算した目安です。実際の道のりや信号待ちによって前後する場合があります。",
    },
    {
      title: "更新頻度と正確性",
      body: "掲載情報は約1週間ごとに自動更新されます。ただし営業時間・価格・臨時休業などは変動するため、来店前に店舗の公式情報やGoogleマップで最新状況をご確認ください。",
    },
  ];

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        mt: 5,
        borderRadius: 4,
        border: "2px dashed #CCC",
        bgcolor: "#FAFAFA",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        fontWeight={900}
        gutterBottom
        sx={{ mb: 2 }}
      >
        掲載基準・データについて
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => (
          <Box key={item.title}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#1A1A1A", mb: 0.5 }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8 }}>
              {item.body}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="body2" sx={{ mt: 2.5, color: "#666" }}>
        運営方針の詳細は
        <Link href="/about" style={{ color: "#FF6B00", fontWeight: 700 }}>
          「ガツガツグルメとは」
        </Link>
        をご覧ください。掲載内容に誤りを見つけた場合は
        <Link href="/contact" style={{ color: "#FF6B00", fontWeight: 700 }}>
          お問い合わせ
        </Link>
        からご連絡いただけると助かります。
      </Typography>
    </Paper>
  );
}
