import { STATION_GROUPS } from "@/constants/stations";
import { Box, Chip, Paper, Typography } from "@mui/material";
import Link from "next/link";

/**
 * 対応駅の一覧をエリア別に表示するディレクトリ。
 * 全駅ページへの内部リンクをトップページに集約する。
 */
export default function StationDirectory() {
  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 900, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
      >
        エリア別・対応駅一覧
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", fontWeight: 700, mb: 3, lineHeight: 1.8 }}>
        全国の主要駅ごとに、デカ盛り・がっつり系の店舗を徒歩分数つきで掲載しています。お探しの駅を選んでください。
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {STATION_GROUPS.map((group) => (
          <Paper
            key={group.region}
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              border: "2px solid #1A1A1A",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ fontWeight: 900, mb: 1.5, color: "#1A1A1A" }}
            >
              {group.region}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {group.stations.map((station) => (
                <Link
                  key={station}
                  href={`/station/${encodeURIComponent(station)}`}
                  style={{ textDecoration: "none" }}
                >
                  <Chip
                    label={station}
                    clickable
                    size="small"
                    sx={{
                      fontWeight: 800,
                      bgcolor: "#FFF9F5",
                      border: "1px solid #EEE",
                      "&:hover": {
                        bgcolor: "#FFF5ED",
                        borderColor: "#FF6B00",
                        color: "#FF6B00",
                      },
                    }}
                  />
                </Link>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
