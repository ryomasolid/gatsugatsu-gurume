import { Box, Divider, Grid, Paper, Typography } from "@mui/material";

export const WelcomeSection = () => {
  return (
    <Box sx={{ mt: 2, pb: 10 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 8 },
          borderRadius: 4,
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "grey.200",
        }}
      >
        {/* メインタイトル */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 900,
            color: "#FF6B00",
            mb: 3,
            fontSize: { xs: "1.1rem", sm: "1.4rem", md: "1.8rem" },
          }}
        >
          ガツガツグルメ：駅近「がっつり飯」の最強検索ガイド
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 6,
            lineHeight: 2,
            color: "text.primary",
            fontSize: "1.05rem",
          }}
        >
          「ガツガツグルメ」へようこそ。当サイトは、日々を全力で生きる人々のために、
          <b>
            {" "}
            駅から徒歩圏内で、満足感抜群の「がっつり飯」を最速で見つけること{" "}
          </b>
          を目的に開発されました。
          巷に溢れるおしゃれなカフェ情報ではなく、私たちが本当に求めている「ラーメン・牛丼・定食」という黄金の3大ジャンルに特化しています。
        </Typography>

        <Divider sx={{ my: 6 }} />

        {/* ジャンル別こだわり */}
        <Grid container spacing={6}>
          <GenreItem
            emoji="🍜"
            title="ラーメンの美学"
            description="「駅を降りて5分以内に、あの一杯を啜りたい。」そんな切実な願いに応えます。二郎インスパイアから濃厚豚骨まで、食べた後に「戦える」元気が湧くお店を厳選。"
          />
          <GenreItem
            emoji="🍚"
            title="牛丼・丼物の信頼"
            description="日本が誇る究極のファストフード。大手チェーンの安定感から、その街にしかない「肉の盛り」が自慢の個人店まで、本能に忠実な検索結果をお届けします。"
          />
          <GenreItem
            emoji="🍱"
            title="定食・おかわり自由の聖地"
            description="白米との真剣勝負。唐揚げ、生姜焼き、ハンバーグ。ボリューム自慢のお店を中心に、特にお腹を空かせた学生やビジネスマンに支持される名店を抽出。"
          />
        </Grid>

        {/* トレンドBOX */}
        <Box sx={{ mt: 8, p: 4, bgcolor: "grey.50", borderRadius: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            💡 2026年「駅近グルメ」の賢い探し方
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 2 }}>
            最新のGoogle Places
            APIデータを活用し、営業時間の変更や新規開店したばかりの「隠れた名店」も逃さずチェック。
            口コミ評価の「勢い」を反映させることで、あなたのランチ・ディナーでの失敗をゼロにします。
          </Typography>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* 3か条セクション */}
        <Typography
          variant="h5"
          sx={{ fontWeight: 900, mb: 4, textAlign: "center" }}
        >
          ガツガツグルメ流・お店選びの3か条
        </Typography>
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <PolicyCard
            number="01"
            title="圧倒的な「満腹度」"
            description="大盛り無料、おかわり自由、肉厚。食べた後に明日への活力が湧いてくるボリューム自慢を厳選。"
          />
          <PolicyCard
            number="02"
            title="駅から「迷わず」行ける"
            description="駅の改札を出てから数分以内に辿り着ける立地を重視。短いランチタイムでも最高のパフォーマンスを。"
          />
          <PolicyCard
            number="03"
            title="「生の声」を重視"
            description="広告費による操作ではなく、実際のユーザー口コミ（Googleデータ）をベースにした真実をお届け。"
          />
        </Grid>

        {/* 検索テクニック */}
        <Box
          sx={{
            p: 4,
            bgcolor: "#FFF8E1",
            borderRadius: 3,
            mb: 6,
            border: "1px solid #FFE0B2",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            🔍 賢いガツガツ検索のテクニック
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 2 }}>
            当サイトの最大の特徴は、<b>「複数の駅を一度に選択できる」</b>
            点にあります。
            隣接する駅の両方にチェックを入れれば、その中間エリアにある隠れた名店もリストアップ可能。あなただけの「がっつり飯ルート」を開拓してください。
          </Typography>
        </Box>

        {/* 使い方ガイド */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
            🚀 検索の始め方
          </Typography>
          <Typography
            variant="body2"
            component="div"
            sx={{ color: "text.secondary", lineHeight: 2 }}
          >
            1. 画面左上のメニュー（スマホは ☰ ）を開く
            <br />
            2. 「都道府県」「路線」を選択し、目的の「駅」にチェックを入れる
            <br />
            3. 下部の「検索する」ボタンをタップ！
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

// ヘルパーコンポーネント: ジャンル
const GenreItem = ({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) => (
  <Grid size={{ xs: 12, sm: 6 }}>
    <Typography
      variant="h5"
      sx={{ fontWeight: 900, mb: 2, display: "flex", alignItems: "center" }}
    >
      {emoji} {title}
    </Typography>
    <Typography
      variant="body2"
      sx={{ lineHeight: 1.8, color: "text.secondary" }}
    >
      {description}
    </Typography>
  </Grid>
);

// ヘルパーコンポーネント: 3か条カード
const PolicyCard = ({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) => (
  <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
    <Paper variant="outlined" sx={{ p: 3, height: "100%", borderRadius: 3 }}>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", mb: 1, color: "#FF6B00" }}
      >
        {number}. {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.6 }}
      >
        {description}
      </Typography>
    </Paper>
  </Grid>
);
