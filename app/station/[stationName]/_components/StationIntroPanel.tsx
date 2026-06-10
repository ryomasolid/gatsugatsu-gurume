import { Box, Chip, Paper, Typography } from "@mui/material";

type Props = {
  stationName: string;
  lines: string[];
};

export default function StationIntroPanel({ stationName, lines }: Props) {
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
        {stationName}駅周辺で、お腹いっぱい食べられる名店をピックアップしました。
        独自ロジックにより、ボリュームと満足度の高い店舗を厳選しています。
      </Typography>
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
