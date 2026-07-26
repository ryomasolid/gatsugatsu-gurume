import { isDirectoryEnabled, isStationReachable } from "@/constants/reviewMode";
import { STATION_GROUPS } from "@/constants/stations";
import { getAllPrefectures } from "@/utils/stationData";
import { Box, Chip, Paper, Typography } from "@mui/material";
import Link from "next/link";

/**
 * 駅ページへの導線となるディレクトリ。
 * 主要駅への直接リンクと、全国の駅へ辿れる都道府県リンクを提供する。
 *
 * 審査モード中は 404 になる都道府県リンク・非主要駅リンクを出さないよう、
 * 到達可能な駅だけに絞って表示する（クローラに壊れたリンクを見せない）。
 */
export default function StationDirectory() {
  const prefectures = getAllPrefectures();
  const showDirectory = isDirectoryEnabled();

  // 審査中は到達可能な駅（主要駅）だけを残し、リンク先が 404 になる駅は表示しない
  const groups = STATION_GROUPS.map((group) => ({
    ...group,
    stations: group.stations.filter(isStationReachable),
  })).filter((group) => group.stations.length > 0);

  return (
    <Box component="section" sx={{ mb: 6 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontWeight: 900, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
      >
        主要駅から探す
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", fontWeight: 700, mb: 3, lineHeight: 1.8 }}>
        駅ごとに、デカ盛り・がっつり系の店舗を徒歩分数つきで掲載しています。編集部が食環境をまとめた主要駅から、気になるエリアを選んでください。
      </Typography>

      {showDirectory && (
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
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {groups.map((group) => (
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
