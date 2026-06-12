import { STATION_GROUPS } from "@/constants/stations";
import { getAllPrefectures } from "@/utils/stationData";
import { Box, Chip, Paper, Typography } from "@mui/material";
import Link from "next/link";

/**
 * 駅ページへの導線となるディレクトリ。
 * 主要駅への直接リンクと、全国の駅へ辿れる都道府県リンクを提供する。
 */
export default function StationDirectory() {
  const prefectures = getAllPrefectures();

  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 900, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
      >
        全国の駅から探す
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", fontWeight: 700, mb: 3, lineHeight: 1.8 }}>
        全国の駅ごとに、デカ盛り・がっつり系の店舗を徒歩分数つきで掲載しています。都道府県から路線・駅を辿れるほか、主要駅へは下のリストから直接ジャンプできます。
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          mb: 3,
          borderRadius: 4,
          border: "2px solid #FF6B00",
          bgcolor: "#FFF9F5",
        }}
      >
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{ fontWeight: 900, mb: 1.5, color: "#1A1A1A" }}
        >
          都道府県から探す
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {prefectures.map((pref) => (
            <Link
              key={pref}
              href={`/area/${encodeURIComponent(pref)}`}
              style={{ textDecoration: "none" }}
            >
              <Chip
                label={pref}
                clickable
                size="small"
                sx={{
                  fontWeight: 800,
                  bgcolor: "#fff",
                  border: "1px solid #FF6B00",
                  color: "#FF6B00",
                  "&:hover": { bgcolor: "#FF6B00", color: "#fff" },
                }}
              />
            </Link>
          ))}
        </Box>
      </Paper>

      <Typography
        variant="subtitle1"
        component="h3"
        sx={{ fontWeight: 900, mb: 1.5, color: "#1A1A1A" }}
      >
        主要駅から直接探す
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
