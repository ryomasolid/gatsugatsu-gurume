import { Box, Grid, Paper, Typography } from "@mui/material";
import Link from "next/link";

const TOOLS = [
  {
    href: "/shindan",
    emoji: "🔮",
    title: "飯タイプ診断",
    desc: "8つの質問でわかる、あなたの食の本性。全8タイプの診断結果はXでシェアして友達と相性チェック。登録不要・2分で完了。",
    color: "#7C3AED",
  },
  {
    href: "/waittime",
    emoji: "⏱️",
    title: "行列・待ち時間予測",
    desc: "並んでいる人数と席数を入れるだけで、業態別の回転率から待ち時間と入店予定時刻を予測。並ぶか帰るかの判断材料に。",
    color: "#0891B2",
  },
  {
    href: "/calorie",
    emoji: "🧮",
    title: "外食カロリー＆PFC計算",
    desc: "主要チェーンのメニューを選んで合計カロリーとPFCバランスをリアルタイム集計。がっつり食べる日の調整に役立ちます。",
    color: "#3B82F6",
  },
  {
    href: "/tabehoudai",
    emoji: "🏆",
    title: "食べ放題・元取れ計算",
    desc: "食べた量を記録するだけで、コース料金の元が取れたかを単品参考価格ベースで判定。食べ放題がもっと楽しくなる計算機。",
    color: "#D97706",
  },
  {
    href: "/gacha",
    emoji: "🎰",
    title: "今日のご飯決定ガチャ",
    desc: "予算と気分を選んでガチャを回すだけで今日の一食が決定。「何食べよう」の決断疲れから解放されます。",
    color: "#FF6B00",
  },
  {
    href: "/warikan",
    emoji: "💰",
    title: "割り勘＆傾斜計算",
    desc: "上司は多め・遅刻組は少なめ。グループ別の傾斜割り勘を100円単位の端数処理つきで計算し、LINE用テキストで共有できます。",
    color: "#22C55E",
  },
];

export default function ToolsShowcase() {
  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 900, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
      >
        メシ決めに役立つ無料ツール
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", fontWeight: 700, mb: 3, lineHeight: 1.8 }}>
        店探しだけでなく、「待つか・食べるか・いくら払うか」までサポート。外食の意思決定に使える計算ツールを無料で公開しています。
      </Typography>
      <Grid container spacing={2}>
        {TOOLS.map((tool) => (
          <Grid key={tool.href} size={{ xs: 12, sm: 6, md: 4 }}>
            <Link href={tool.href} style={{ textDecoration: "none", height: "100%", display: "block" }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 4,
                  border: `2px solid ${tool.color}`,
                  boxShadow: `4px 4px 0px ${tool.color}`,
                  transition: "all 0.15s",
                  "&:hover": {
                    transform: "translate(-2px, -2px)",
                    boxShadow: `6px 6px 0px ${tool.color}`,
                  },
                }}
              >
                <Typography variant="h4" component="span" sx={{ display: "block", mb: 1 }}>
                  {tool.emoji}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: tool.color, mb: 0.5 }}>
                  {tool.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.7 }}>
                  {tool.desc}
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
