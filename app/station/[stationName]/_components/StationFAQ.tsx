import { Box, Paper, Typography } from "@mui/material";
import { RestaurantInfoDTO } from "../types";
import { buildGenreCounts } from "./StationSummary";

type Props = {
  stationName: string;
  restaurants: RestaurantInfoDTO[];
  lines: string[];
};

type Faq = { q: string; a: string };

export default function StationFAQ({ stationName, restaurants, lines }: Props) {
  if (restaurants.length === 0) return null;

  const genreCounts = buildGenreCounts(restaurants);
  const nearest = restaurants[0]; // 徒歩分数の昇順でソート済み
  const genreText = genreCounts
    .slice(0, 3)
    .map(([g, c]) => `${g}（${c}軒）`)
    .join("、");

  const faqs: Faq[] = [
    {
      q: `${stationName}駅周辺でがっつり食べられるお店は何軒ありますか？`,
      a: `現在${restaurants.length}軒を掲載しています。内訳は${genreText}${genreCounts.length > 3 ? "など" : ""}で、いずれも駅から徒歩圏内の店舗です。`,
    },
    {
      q: `${stationName}駅から一番近い掲載店はどこですか？`,
      a: `「${nearest.name}」（${nearest.genre}）が駅から徒歩約${nearest.walkMinutes}分で最も近い掲載店です。徒歩分数は駅の座標と店舗の位置情報から分速80mで自動計算した目安です。`,
    },
    ...(lines.length > 0
      ? [
          {
            q: `${stationName}駅にはどの路線が乗り入れていますか？`,
            a: `${lines.join("、")}が利用できます。複数路線が使える駅は乗り換えの合間の食事にも便利です。`,
          },
        ]
      : []),
    {
      q: "掲載店舗はどのような基準で選ばれていますか？",
      a: "ラーメン・丼もの・定食・カレー・中華といったボリューム重視のジャンルに絞り、Google Places APIの検索結果から駅周辺の該当店舗を抽出しています。情報は約24時間ごとに自動更新されますが、営業時間や臨時休業は変動するため、来店前に店舗の公式情報やGoogleマップで最新状況をご確認ください。",
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
        border: "2px solid #1A1A1A",
        bgcolor: "#fff",
      }}
    >
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
    </Paper>
  );
}
