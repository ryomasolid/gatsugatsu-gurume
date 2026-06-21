import { Box, Chip, Paper, Typography } from "@mui/material";

type Props = {
  stationName: string;
  lines: string[];
  guide?: string;
  dataDate?: string;
};

/** "2026-06-20" → "2026年6月" */
function formatDataDate(dataDate?: string): string | null {
  if (!dataDate) return null;
  const m = dataDate.match(/^(\d{4})-(\d{2})/);
  if (!m) return null;
  return `${m[1]}年${Number(m[2])}月`;
}

export default function StationIntroPanel({
  stationName,
  lines,
  guide,
  dataDate,
}: Props) {
  const dataDateLabel = formatDataDate(dataDate);
  return (
    <Paper
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
        variant="h4"
        component="h1"
        fontWeight="900"
        gutterBottom
        sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
      >
        {stationName}周辺のデカ盛り・がっつりランチ厳選
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 700, lineHeight: 1.8 }}>
        {stationName}駅周辺で、お腹いっぱい食べられるお店をピックアップしました。
        ラーメン・丼もの・定食などボリューム重視のジャンルに絞り、駅からの徒歩分数つきで掲載しています。
      </Typography>
      {guide && (
        <Box
          sx={{
            mt: 3,
            p: { xs: 2, md: 2.5 },
            borderLeft: "4px solid #FF6B00",
            bgcolor: "#FFF9F5",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 900, color: "#FF6B00", display: "block", mb: 0.5 }}
          >
            編集部メモ：{stationName}駅のがっつり飯事情
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.9 }}>
            {guide}
          </Typography>
        </Box>
      )}
      {dataDateLabel && (
        <Typography
          variant="caption"
          sx={{ mt: 2, display: "block", color: "#999", fontWeight: 700 }}
        >
          ※掲載店舗の情報は{dataDateLabel}時点のものです。最新の営業状況は各店舗にご確認ください。
        </Typography>
      )}
      {lines.length > 0 && (
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
          <Typography variant="caption" sx={{ fontWeight: 900, color: "#666", mr: 1 }}>
            乗り入れ路線:
          </Typography>
          {lines.map((line) => (
            <Chip key={line} label={line} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
          ))}
        </Box>
      )}
    </Paper>
  );
}
