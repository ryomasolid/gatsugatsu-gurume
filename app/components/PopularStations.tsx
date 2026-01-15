import { Box, Chip, Typography } from "@mui/material";
import Link from "next/link";

const POPULAR_STATIONS = [
  "新宿",
  "渋谷",
  "池袋",
  "秋葉原",
  "横浜",
  "大阪",
  "博多",
];

export default function PopularStations() {
  return (
    <Box sx={{ mt: 6, mb: 4, textAlign: "center" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        人気のエリアから「がっつり飯」を探す
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {POPULAR_STATIONS.map((name) => (
          <Link
            key={name}
            href={`/station/${name}`}
            style={{ textDecoration: "none" }}
          >
            <Chip
              label={`${name}駅`}
              clickable
              sx={{
                backgroundColor: "white",
                border: "1px solid #FF6B00",
                color: "#FF6B00",
                "&:hover": { backgroundColor: "#FFF5ED" },
              }}
            />
          </Link>
        ))}
      </Box>
    </Box>
  );
}
