"use client";

import RestaurantIcon from "@mui/icons-material/Restaurant";
import TrainIcon from "@mui/icons-material/Train";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Box, Chip, Paper, Rating, Typography, Stack } from "@mui/material";
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
        setImageUrl(data.imageUrl || '');
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
        mb: { xs: 3, md: 5 },
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
        // 高さもレスポンシブに（中身に応じて伸びるようminHeight設定）
        minHeight: { xs: "320px", sm: "350px", md: "450px" },
        display: "flex",
        alignItems: "center",
        borderRadius: { xs: "0 0 24px 24px", md: "0 0 60px 60px" },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.7)", // スマホでの視認性を高めるため少し暗めに
        },
      }}
    >
      <Box 
        sx={{ 
          position: "relative", 
          p: { xs: 2.5, sm: 4, md: 10 }, // パディングを段階的に調整
          width: "100%", 
          maxWidth: "1200px", 
          margin: "0 auto" 
        }}
      >
        <Stack spacing={{ xs: 2, md: 3 }} alignItems="flex-start">
          
          {/* ラベルエリア：スマホでは横並び、狭ければ折り返し */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<TrainIcon sx={{ color: "#fff !important", fontSize: "0.9rem" }} />}
              label={`${stationName}駅 拠点`}
              size="small"
              sx={{ bgcolor: "#FF6B00", color: "#fff", fontWeight: 900, px: 0.5 }}
            />
            <Chip
              icon={<LocalFireDepartmentIcon sx={{ color: "#fff !important", fontSize: "0.9rem" }} />}
              label="独自解析済み"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 900, backdropFilter: "blur(4px)" }}
            />
          </Stack>

          {/* メインコピー：文字サイズを細かく調整 */}
          <Box sx={{ width: "100%" }}>
            <Typography
              variant="h3"
              component="h1" // SEO的にここをh1にする
              sx={{
                fontWeight: 900,
                // 駅名が長くても崩れないよう、clampを使用して柔軟なサイズに
                fontSize: { 
                  xs: stationName.length > 5 ? "1.6rem" : "2rem", 
                  sm: "2.5rem", 
                  md: "3.5rem" 
                },
                lineHeight: { xs: 1.2, md: 1.1 },
                textShadow: "2px 2px 12px rgba(0,0,0,0.9)",
                mb: { xs: 1.5, md: 2.5 },
                letterSpacing: "-0.03em",
                wordBreak: "keep-all", // 単語の途中で改行させない
                overflowWrap: "anywhere"
              }}
            >
              {stationName}の<Box component="span" sx={{ color: "#FF6B00" }}>胃袋を掴む</Box><br />
              最強がっつり飯リスト
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "0.85rem", sm: "1rem", md: "1.15rem" },
                lineHeight: { xs: 1.6, md: 1.8 },
                color: "rgba(255,255,255,0.85)",
                maxWidth: { xs: "100%", md: "850px" },
                textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
              }}
            >
              <strong>{stationName}周辺のデカ盛り・高コスパ店</strong>を徹底調査。
              駅から徒歩5分圏内の人気店だけを、ガツガツグルメ編集部が厳選しました。
            </Typography>
          </Box>

          {/* 評価ボックス：スマホでのレイアウト崩れ防止 */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "row" },
              alignItems: "center",
              bgcolor: "rgba(255,107,0,0.15)",
              px: { xs: 1.5, md: 3 },
              py: { xs: 1, md: 1.5 },
              borderRadius: "12px",
              border: "1px solid rgba(255,107,0,0.4)",
              backdropFilter: "blur(10px)",
              mt: { xs: 1, md: 2 }
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                mr: { xs: 1, md: 2 }, 
                fontWeight: 900, 
                color: "#FF6B00", 
                fontSize: { xs: "0.8rem", md: "1rem" },
                whiteSpace: "nowrap"
              }}
            >
              腹ペコ推奨度
            </Typography>
            <Rating
              value={5}
              readOnly
              size="small" // スマホでは小さめに
              icon={<RestaurantIcon fontSize="inherit" sx={{ color: "#FF6B00" }} />}
              emptyIcon={<RestaurantIcon fontSize="inherit" sx={{ color: "rgba(255,255,255,0.3)" }} />}
            />
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}