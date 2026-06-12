import {
  ArticleSection,
  ArticleText,
  FaqList,
  NoteBox,
  ToolArticle,
} from "@/components/ToolArticle";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

export const metadata: Metadata = {
  title: "【2026年】グルメトレンド大予測10選｜次に流行る外食はコレだ",
  description:
    "2026年に話題になりそうな外食・グルメトレンドを編集部が大予測。プロテイン外食、昭和レトロ食堂リバイバル、ソロ外食2.0、麻辣湯の進化系、AIメニュー注文、値上げ時代のコスパ飯戦争など10テーマを徹底解説。",
  alternates: { canonical: "/trend2026" },
  openGraph: {
    title: "【2026年】グルメトレンド大予測10選｜ガツガツグルメ",
    description:
      "2026年に流行る外食トレンドを大予測。プロテイン外食・レトロ食堂・ソロ外食2.0・麻辣湯進化系など10テーマを解説。",
    url: "https://gatsugatsu-gurume.com/trend2026",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "【2026年】グルメトレンド大予測10選",
    description: "次に流行る外食はコレだ。2026年のグルメトレンドを大予測。",
  },
};

type Trend = {
  rank: number;
  emoji: string;
  title: string;
  tag: string;
  body: string;
  link?: { href: string; label: string };
};

const TRENDS: Trend[] = [
  {
    rank: 1,
    emoji: "💪",
    title: "プロテイン外食の主流化",
    tag: "高タンパク",
    body: "コンビニで定着した高タンパク商品が、いよいよ外食チェーンの主戦場に。タンパク質量をメニューに大きく表示する店が増え、「がっつり食べて体も作る」が2026年の新常識になりそうです。鶏むね・赤身肉・大豆ミートを軸にした「筋肉定食」業態の拡大にも注目。",
    link: { href: "/calorie", label: "外食カロリー＆PFC計算を使う" },
  },
  {
    rank: 2,
    emoji: "🏮",
    title: "昭和レトロ食堂リバイバル",
    tag: "レトロ",
    body: "ネオン・赤ちょうちん・固めのプリン。Z世代の「エモい」需要と中高年の郷愁が交差し、町中華や昔ながらの大衆食堂が再評価される流れが加速。チェーン側もレトロ内装の新業態を続々投入する見込みで、2026年は「新しい古さ」が外食のキーワードになります。",
  },
  {
    rank: 3,
    emoji: "🍲",
    title: "麻辣湯（マーラータン）の進化系",
    tag: "激辛・薬膳",
    body: "具材を選んで自分だけの一杯を作る麻辣湯は、カスタマイズ性とヘルシーさで定着済み。2026年はスープのバリエーション拡大（トマト麻辣・白湯麻辣・カレー麻辣）と、男性客を狙った「ガッツリ麻辣湯」業態の登場が予想されます。辛党は要チェック。",
  },
  {
    rank: 4,
    emoji: "🧑‍🍳",
    title: "ソロ外食2.0",
    tag: "おひとりさま",
    body: "一人焼肉・一人鍋はもう当たり前。次の波は「ソロ前提の店舗設計」です。全席パーテーション・注文から会計まで会話ゼロ・一人客優先予約など、おひとりさまが最高待遇を受けられる店が増加。「一人だから入りにくい」が完全に死語になる年です。",
  },
  {
    rank: 5,
    emoji: "🤖",
    title: "AIおすすめ注文の標準化",
    tag: "テック",
    body: "モバイルオーダーの次は「AIが提案する注文」。過去の注文履歴や気分の入力から、AIがメニューの組み合わせを提案してくれる仕組みが大手チェーンから広がる見込み。「何食べよう」と悩む時間が消える未来はすぐそこです。迷ったときの相棒はすでにここにもあります。",
    link: { href: "/gacha", label: "今日のご飯決定ガチャを回す" },
  },
  {
    rank: 6,
    emoji: "💴",
    title: "値上げ時代のコスパ飯戦争",
    tag: "コスパ",
    body: "原材料費の上昇が続くなか、「量とコスパ」で勝負する業態の存在感がさらに増します。ライス大盛り無料・おかわり自由・総重量1kg級メニューなど、ボリュームを武器にした店が話題の中心に。食べ放題の「元を取る」文化も一層盛り上がるはず。",
    link: { href: "/tabehoudai", label: "食べ放題・元取れ計算機を使う" },
  },
  {
    rank: 7,
    emoji: "🍜",
    title: "ご当地ラーメンの東京逆襲",
    tag: "麺",
    body: "富山ブラック、京都背脂醤油、徳島ラーメン、八王子ラーメン——地方発の濃厚系ご当地ラーメンが都心に続々進出する流れが続きます。2026年は「まだ全国区になっていないご当地麺」の発掘合戦が激化。麺好きは駅ごとの開拓がますます楽しくなります。",
    link: { href: "/station/高田馬場", label: "ラーメン激戦区・高田馬場駅を見る" },
  },
  {
    rank: 8,
    emoji: "🧊",
    title: "冷凍グルメ・自販機グルメの高級化",
    tag: "中食",
    body: "有名店監修の冷凍ラーメン・冷凍餃子の自販機は、もはや「深夜の救世主」から「指名買いされるグルメ」へ。2026年は名店の味を24時間買える冷凍自販機の設置がさらに拡大し、外食と中食の境界はますます曖昧になります。",
  },
  {
    rank: 9,
    emoji: "📱",
    title: "「診断型」グルメ選びの流行",
    tag: "SNS",
    body: "「何を食べるかは性格が決める」——SNSでは自分の食タイプを診断してシェアする遊びが定番化しつつあります。店探しの前に自分の傾向を知る、という新しい外食エンタメ。あなたの飯タイプ、知っていますか？",
    link: { href: "/shindan", label: "飯タイプ診断をやってみる" },
  },
  {
    rank: 10,
    emoji: "⏱️",
    title: "行列の「時間価値」見直し",
    tag: "タイパ",
    body: "タイパ意識の高まりで、「並ぶ価値があるか」を数字で判断する人が増えています。待ち時間表示システムの導入店は拡大を続け、行列店は「並ばせない工夫」が評価軸に。並ぶか帰るかは、データで決める時代です。",
    link: { href: "/waittime", label: "行列・待ち時間予測を使う" },
  },
];

export default function Trend2026Page() {
  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pt: { xs: 10, md: 4 }, pb: 8 }}>
      <Container maxWidth="md">
        {/* ヒーロー */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Chip
            label="2026年版・編集部予測"
            sx={{ bgcolor: DARK_COLOR, color: "#fff", fontWeight: 900, mb: 2, letterSpacing: "0.05em" }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.6rem" }, letterSpacing: "-0.03em", color: DARK_COLOR, mb: 1.5, lineHeight: 1.3 }}
          >
            2026年グルメトレンド
            <Box component="span" sx={{ color: BRAND_COLOR }}>大予測 10選</Box>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#666", lineHeight: 1.9 }}>
            次に流行る外食はコレだ。プロテイン飯からレトロ食堂、AI注文まで——
            <br />
            ガツガツグルメ編集部が2026年の食シーンを大胆予測します。
          </Typography>
        </Box>

        {/* トレンドカード */}
        <Grid container spacing={2.5} sx={{ mb: 6 }}>
          {TRENDS.map((trend) => (
            <Grid key={trend.rank} size={{ xs: 12 }}>
              <Paper
                component="section"
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  border: `2px solid ${DARK_COLOR}`,
                  boxShadow: `5px 5px 0px ${DARK_COLOR}`,
                  bgcolor: "#fff",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: { xs: "1.8rem", md: "2.2rem" },
                      color: BRAND_COLOR,
                      lineHeight: 1,
                      flexShrink: 0,
                      minWidth: { xs: 44, md: 56 },
                    }}
                  >
                    {String(trend.rank).padStart(2, "0")}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mb: 1 }}>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 900, color: DARK_COLOR, fontSize: { xs: "1.1rem", md: "1.25rem" } }}
                      >
                        {trend.emoji} {trend.title}
                      </Typography>
                      <Chip
                        label={trend.tag}
                        size="small"
                        sx={{ bgcolor: "#FFF5ED", color: BRAND_COLOR, fontWeight: 900, border: `1px solid ${BRAND_COLOR}` }}
                      />
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.9, mb: trend.link ? 2 : 0 }}>
                      {trend.body}
                    </Typography>
                    {trend.link && (
                      <Link href={trend.link.href} style={{ textDecoration: "none" }}>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            border: `2px solid ${BRAND_COLOR}`,
                            fontWeight: 900,
                            fontSize: "0.85rem",
                            color: BRAND_COLOR,
                            boxShadow: `3px 3px 0px ${BRAND_COLOR}`,
                            transition: "all 0.15s",
                            "&:hover": {
                              transform: "translate(-1px, -1px)",
                              boxShadow: `4px 4px 0px ${BRAND_COLOR}`,
                            },
                          }}
                        >
                          {trend.link.label}
                          <NavigateNextIcon sx={{ fontSize: "1rem" }} />
                        </Box>
                      </Link>
                    )}
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <ToolArticle>
        <ArticleSection title="トレンド予測の根拠と読み方">
          <ArticleText>
            本記事のトレンド予測は、近年の外食市場の動向（高タンパク商品の市場拡大、レトロ業態の出店増、麻辣湯専門店の店舗数推移、モバイルオーダー導入率の上昇など）と、SNS上の話題の変遷をもとに、ガツガツグルメ編集部が独自の視点でまとめたものです。
            確定情報ではなく「こうなりそう」という予測としてお楽しみください。外食選びのヒントや、話のネタとして活用していただくのがおすすめです。
          </ArticleText>
        </ArticleSection>

        <ArticleSection title="よくある質問">
          <FaqList
            faqs={[
              {
                q: "この予測は何を根拠にしていますか？",
                a: "公表されている外食市場の動向、チェーン各社の出店・新業態の傾向、SNSでの話題の推移などを参考に、編集部が独自に予測したものです。特定の調査機関のランキングを転載したものではありません。",
              },
              {
                q: "トレンドの店はどうやって探せばいいですか？",
                a: "当サイトの駅検索を使えば、全国の駅周辺のがっつり系グルメを徒歩分数つきで探せます。気になるトレンドのジャンルがあれば、まずは最寄り駅や乗換駅周辺からチェックしてみてください。",
              },
              {
                q: "予測は更新されますか？",
                a: "外食シーンの動きにあわせて、年内にも内容を見直す可能性があります。話題の新トレンドが出てきたタイミングで随時アップデート予定です。",
              },
            ]}
          />
        </ArticleSection>

        <NoteBox>
          ※本記事は2026年の外食トレンドに関する編集部の予測コンテンツであり、特定の店舗・企業の業績や流行を保証するものではありません。
        </NoteBox>
      </ToolArticle>
    </Box>
  );
}
