import { isDirectoryEnabled, isStationReachable } from "@/constants/reviewMode";
import { Box, Chip, Paper, Typography } from "@mui/material";
import Link from "next/link";

type Props = {
  stationName: string;
  neighborLines: { line: string; neighbors: string[] }[];
};

/**
 * 同じ路線の近隣駅へのリンク集。
 * クローラが全駅ページへ辿り着けるよう、横方向の内部リンクを提供する。
 *
 * 審査モード中は 404 になる駅・路線ページへのリンクを出さないよう、到達可能な駅のみに絞り、
 * 路線一覧（line）へのリンクは表示しない。
 */
export default function NeighborStationLinks({ stationName, neighborLines }: Props) {
  const showLineLinks = isDirectoryEnabled();
  // 審査中はリンク先が 404 になる非主要駅を除外する
  const visible = neighborLines
    .map((l) => ({ ...l, neighbors: l.neighbors.filter(isStationReachable) }))
    .filter((l) => l.neighbors.length > 0);
  if (visible.length === 0) return null;

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
        sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" }, mb: 1 }}
      >
        {stationName}駅の近くの駅から探す
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.8, mb: 3 }}>
        お目当ての店が見つからなかったら、隣の駅まで足を延ばすのも手です。同じ路線の近隣駅のがっつりグルメもチェックできます。
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {visible.map(({ line, neighbors }) => (
          <Box key={line}>
            <Typography
              variant="subtitle2"
              component="h3"
              sx={{ fontWeight: 900, color: "#1A1A1A", mb: 1 }}
            >
              {showLineLinks ? (
                <Link
                  href={`/line/${encodeURIComponent(line)}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {line}
                </Link>
              ) : (
                line
              )}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
              {neighbors.map((name) => (
                <Link
                  key={name}
                  href={`/station/${encodeURIComponent(name)}`}
                  style={{ textDecoration: "none" }}
                >
                  <Chip
                    label={name}
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
              {showLineLinks && (
                <Link
                  href={`/line/${encodeURIComponent(line)}`}
                  style={{ color: "#FF6B00", fontWeight: 800, fontSize: "0.8rem" }}
                >
                  {line}の全駅一覧 →
                </Link>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
