import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import { RestaurantInfoDTO } from "../types";

type Props = {
  stationName: string;
  restaurants: RestaurantInfoDTO[];
};

export function buildGenreCounts(restaurants: RestaurantInfoDTO[]) {
  const counts: Record<string, number> = {};
  for (const r of restaurants) {
    const g = r.genre || "その他";
    counts[g] = (counts[g] ?? 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export default function StationSummary({ stationName, restaurants }: Props) {
  if (restaurants.length === 0) return null;

  const genreCounts = buildGenreCounts(restaurants);
  const [topGenre, topGenreCount] = genreCounts[0];
  const nearest = restaurants[0]; // 徒歩分数の昇順でソート済み
  const within5min = restaurants.filter((r) => r.walkMinutes <= 5).length;
  const avgWalk = Math.round(
    restaurants.reduce((s, r) => s + r.walkMinutes, 0) / restaurants.length
  );

  const stats = [
    { label: "掲載店舗数", value: `${restaurants.length}軒` },
    { label: "最多ジャンル", value: `${topGenre}（${topGenreCount}軒）` },
    { label: "徒歩5分以内", value: `${within5min}軒` },
    { label: "平均徒歩分数", value: `約${avgWalk}分` },
  ];

  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        mb: 4,
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
        sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}
      >
        {stationName}駅のがっつり飯データまとめ
      </Typography>

      <Typography variant="body1" sx={{ color: "#444", lineHeight: 2, mb: 3 }}>
        現在、{stationName}駅周辺では{restaurants.length}軒のがっつり系店舗を掲載中です。
        最も多いジャンルは「{topGenre}」（{topGenreCount}軒）。
        駅から最も近い掲載店は「{nearest.name}」で、徒歩約{nearest.walkMinutes}分の立地です。
        {within5min > 0 &&
          `駅から徒歩5分以内には${within5min}軒があり、乗り換えや買い物の合間でも立ち寄りやすいエリアと言えます。`}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((s) => (
          <Grid key={s.label} size={{ xs: 6, md: 3 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: "#FFF9F5",
                border: "2px solid #EEE",
                textAlign: "center",
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 800, color: "#999", display: "block" }}
              >
                {s.label}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 900, color: "#1A1A1A" }}
              >
                {s.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
        <Typography variant="caption" sx={{ fontWeight: 900, color: "#666", mr: 1 }}>
          ジャンル内訳:
        </Typography>
        {genreCounts.map(([genre, count]) => (
          <Chip
            key={genre}
            label={`${genre} ${count}軒`}
            size="small"
            sx={{
              fontWeight: 800,
              bgcolor: "#FFF5ED",
              color: "#FF6B00",
              border: "1px solid #FF6B00",
            }}
          />
        ))}
      </Box>
    </Paper>
  );
}
