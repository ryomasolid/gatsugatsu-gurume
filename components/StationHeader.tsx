"use client";

import RestaurantIcon from "@mui/icons-material/Restaurant";
import TrainIcon from "@mui/icons-material/Train";
import { Box, Chip, Paper, Rating, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function StationHeader({
  stationName,
}: {
  stationName: string;
}) {
  const [imageUrl, setImageUrl] = useState<string>('');

useEffect(() => {
  const fetchStationImage = async () => {
    try {
      const res = await fetch(`/api/station-image?station=${encodeURIComponent(stationName)}`);
      const data = await res.json();
      
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      } else {
        setImageUrl('');
      }
    } catch (e) {
      console.error("駅画像取得エラー", e);
    }
  };

  if (stationName) {
    fetchStationImage();
  }
}, [stationName]);

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        backgroundColor: "#1A1A1A",
        color: "#fff",
        mb: 4,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        minHeight: { xs: "250px", md: "350px" },
        display: "flex",
        alignItems: "center",
        borderRadius: "0 0 24px 24px",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
        },
      }}
    >
      <Box sx={{ position: "relative", p: { xs: 3, md: 6 }, width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Chip
            icon={<TrainIcon sx={{ color: "#fff !important" }} />}
            label="駅周辺エリア情報"
            size="small"
            sx={{ bgcolor: "#FF6B00", color: "#fff", fontWeight: "bold" }}
          />
        </Box>

        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2rem", md: "3.5rem" },
            textShadow: "2px 2px 10px rgba(0,0,0,0.8)",
            lineHeight: 1.2,
          }}
        >
          {stationName}の<br />
          <span style={{ color: "#FF6B00" }}>がっつり飯</span> 検索
        </Typography>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(255,255,255,0.1)",
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" sx={{ mr: 1, fontWeight: "bold" }}>
              腹ペコ満足度
            </Typography>
            <Rating
              value={5}
              readOnly
              icon={<RestaurantIcon fontSize="inherit" color="primary" />}
              emptyIcon={<RestaurantIcon fontSize="inherit" />}
            />
          </Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: "bold",
              textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
            }}
          >
            ⚡️ {stationName}駅周辺のデカ盛り・高コスパ店を厳選！
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
