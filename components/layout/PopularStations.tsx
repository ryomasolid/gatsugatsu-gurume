"use client";

import { Box, Chip, Stack, Typography } from "@mui/material";
import Link from "next/link";

// 座標データを持たせることで遷移後の表示を高速化（HeartRails APIの節約）
const POPULAR_STATIONS = [
  { name: "新宿", lat: "35.690921", lng: "139.700258" },
  { name: "渋谷", lat: "35.658034", lng: "139.701636" },
  { name: "池袋", lat: "35.728926", lng: "139.71038" },
  { name: "秋葉原", lat: "35.698383", lng: "139.773071" },
  { name: "横浜", lat: "35.465786", lng: "139.622313" },
  { name: "大阪", lat: "34.702485", lng: "135.495951" },
  { name: "博多", lat: "33.589728", lng: "130.420727" },
];

export default function PopularStations() {
  return (
    <Box sx={{ mt: { xs: 4, md: 8 }, mb: 4, textAlign: "center", px: 2 }}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 800,
          mb: 3,
          color: "text.primary",
          fontSize: { xs: "0.95rem", md: "1.1rem" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Box component="span" sx={{ color: "#FF6B00" }}>
          🔥
        </Box>
        人気のエリアから「がっつり飯」を探す
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        justifyContent="center"
        sx={{
          maxWidth: "800px",
          mx: "auto",
        }}
      >
        {POPULAR_STATIONS.map((station) => (
          <Link
            key={station.name}
            href={`/station/${encodeURIComponent(station.name)}?lat=${
              station.lat
            }&lng=${station.lng}`}
            style={{ textDecoration: "none" }}
          >
            <Chip
              label={`${station.name}駅`}
              clickable
              sx={{
                px: 1,
                py: 2.2,
                fontSize: { xs: "0.85rem", md: "0.95rem" },
                fontWeight: "bold",
                backgroundColor: "white",
                border: "1px solid #EEE",
                color: "#555",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: "#FFF5ED",
                  borderColor: "#FF6B00",
                  color: "#FF6B00",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(255,107,0,0.15)",
                },
              }}
            />
          </Link>
        ))}
      </Stack>
    </Box>
  );
}
