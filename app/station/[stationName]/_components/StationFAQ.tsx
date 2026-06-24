import { Box, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { RestaurantInfoDTO } from "../types";
import { buildGenreCounts } from "./StationSummary";

type Props = {
  stationName: string;
  restaurants: RestaurantInfoDTO[];
  lines: string[];
};

type Faq = { q: string; a: string };

/**
 * 駅名から決定的に 0..n-1 を返す簡易ハッシュ。
 * 駅ごとに設問の言い回しを変え、全駅同一テンプレートに見えるのを避けるために使う。
 */
function pickByStation(stationName: string, n: number): number {
  let sum = 0;
  for (let i = 0; i < stationName.length; i++) sum += stationName.charCodeAt(i);
  return sum % n;
}

export default function StationFAQ({ stationName, restaurants, lines }: Props) {
  if (restaurants.length === 0) return null;

  const genreCounts = buildGenreCounts(restaurants);
  const nearest = restaurants[0]; // 徒歩分数の昇順でソート済み
  const within5min = restaurants.filter((r) => r.walkMinutes <= 5).length;
  const avgWalk = Math.round(
    restaurants.reduce((s, r) => s + r.walkMinutes, 0) / restaurants.length
  );
  const [topGenre, topGenreCount] = genreCounts[0];
  const topRatio = Math.round((topGenreCount / restaurants.length) * 100);
  const genreText = genreCounts
    .slice(0, 3)
    .map(([g, c]) => `${g}（${c}軒）`)
    .join("、");

  // 駅ごとに先頭設問の言い回しを変える（量産テンプレ感の軽減）
  const countQuestionVariants = [
    `${stationName}駅周辺でがっつり食べられるお店は何軒ありますか？`,
    `${stationName}駅のデカ盛り・大盛りのお店はどれくらいありますか？`,
    `${stationName}駅でお腹いっぱい食べられる店は何軒掲載されていますか？`,
  ];
  const countQuestion = countQuestionVariants[pickByStation(stationName, countQuestionVariants.length)];

  // ジャンルの傾向を文章で説明（駅ごとのデータで内容が変わる）
  const genreTrend =
    genreCounts.length === 1
      ? `${stationName}駅周辺の掲載店は${topGenre}が中心です。`
      : topRatio >= 50
        ? `${stationName}駅周辺は${topGenre}が全体の約${topRatio}%を占め、がっつり系のなかでも${topGenre}が強いエリアです。`
        : `${stationName}駅周辺は${topGenre}を筆頭に、${genreCounts
            .slice(1, 3)
            .map(([g]) => g)
            .join("・")}などジャンルが分散しており、その日の気分で選びやすいエリアです。`;

  const faqs: Faq[] = [
    {
      q: countQuestion,
      a: `現在${restaurants.length}軒を掲載しています。内訳は${genreText}${genreCounts.length > 3 ? "など" : ""}で、いずれも${stationName}駅から徒歩圏内の店舗です。${
        within5min > 0 ? `うち${within5min}軒は駅から徒歩5分以内です。` : ""
      }`,
    },
    {
      q: `${stationName}駅から一番近い掲載店はどこですか？`,
      a: `「${nearest.name}」（${nearest.genre}）が駅から徒歩約${nearest.walkMinutes}分で最も近い掲載店です。掲載店全体の平均は徒歩約${avgWalk}分で、徒歩分数は駅の座標と店舗の位置情報から分速80mで自動計算した目安です。`,
    },
    {
      q: `${stationName}駅周辺はどんなジャンルが多いですか？`,
      a: genreTrend,
    },
    ...(lines.length > 0
      ? [
          {
            q: `${stationName}駅にはどの路線が乗り入れていますか？`,
            a: `${lines.join("、")}が利用できます。${
              lines.length > 1
                ? "複数路線が使える駅なので、乗り換えの合間のがっつり補給にも便利です。"
                : "駅周辺で用事のついでに立ち寄りやすい立地です。"
            }`,
          },
        ]
      : []),
    {
      q: `${stationName}駅で一人でもがっつり食べられますか？`,
      a: "はい。掲載しているラーメン・牛丼・定食などはカウンター席が中心で、ひとり客が前提の業態が多いジャンルです。ひとり外食を快適にするコツは編集部のコラムでも紹介しています。",
    },
    {
      q: "掲載店舗はどのような基準で選ばれていますか？",
      a: "ラーメン・丼もの・定食・カレー・中華といったボリューム重視のジャンルに絞り、Google Places APIの検索結果から駅周辺の該当店舗を抽出しています。情報は約1週間ごとに自動更新されますが、営業時間や臨時休業は変動するため、来店前に店舗の公式情報やGoogleマップで最新状況をご確認ください。",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        mt: 5,
        borderRadius: 4,
        border: "2px solid #1A1A1A",
        bgcolor: "#fff",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Typography
        variant="h5"
        component="h2"
        fontWeight={900}
        gutterBottom
        sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, mb: 3 }}
      >
        {stationName}駅のがっつりグルメ よくある質問
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {faqs.map((faq) => (
          <Box key={faq.q}>
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{
                fontWeight: 900,
                color: "#1A1A1A",
                mb: 1,
                display: "flex",
                gap: 1,
              }}
            >
              <Box component="span" sx={{ color: "#FF6B00", flexShrink: 0 }}>
                Q.
              </Box>
              {faq.q}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#555", lineHeight: 1.9, pl: 3.5 }}
            >
              {faq.a}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="body2" sx={{ mt: 3, pl: 3.5, color: "#666" }}>
        ▶ あわせて読みたい：
        <Link href="/column/solo-gaishoku" style={{ color: "#FF6B00", fontWeight: 800, textDecoration: "none" }}>
          ひとり外食を快適にするコツ
        </Link>
      </Typography>
    </Paper>
  );
}
