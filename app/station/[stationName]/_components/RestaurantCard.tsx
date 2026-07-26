"use client";

import { detectGatsuTags } from "@/utils/tagDetector";
import { sendGAEvent } from "@next/third-parties/google";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import { GENRE_IMAGES, IMG_CACHE_PREFIX, RestaurantInfoDTO } from "../types";

const BRAND_COLOR = "#FF6B00";

type Props = RestaurantInfoDTO & { stationName: string };

export default function RestaurantCard(props: Props) {
  const safeDesc = props.description || "";
  const defaultImg = GENRE_IMAGES[props.genre] ?? GENRE_IMAGES["その他"];

  const [displayImageUrl, setDisplayImageUrl] = useState<string>(defaultImg);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const gatsuTags = detectGatsuTags(safeDesc);

  // 紹介文は、API由来の実在する説明文がある場合のみ表示する。
  // 説明文が無い店舗については、テンプレートによる文章の自動生成はせず、
  // 店名・ジャンル・住所・徒歩分数といった検証可能な事実のみを掲載する。
  const note = safeDesc;

  useEffect(() => {
    const cached = localStorage.getItem(`${IMG_CACHE_PREFIX}${props.id}`);
    if (cached) {
      setDisplayImageUrl(cached);
      return;
    }

    const fetchCustomImage = async () => {
      setIsApiLoading(true);
      try {
        const query = `${props.name} ${props.stationName} 料理`;
        const res = await fetch(`/api/restaurant-image?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.imageUrl) {
          localStorage.setItem(`${IMG_CACHE_PREFIX}${props.id}`, data.imageUrl);
          setDisplayImageUrl(data.imageUrl);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsApiLoading(false);
      }
    };
    fetchCustomImage();
  }, [props.id, props.name, props.stationName]);

  const handleMapOpen = () => {
    sendGAEvent("event", "map_click", {
      restaurant_name: props.name,
      station_name: props.stationName,
      genre: props.genre,
    });
    const query = encodeURIComponent(`${props.name} ${props.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <Card
      component="article"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #EEE",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          borderColor: BRAND_COLOR,
        },
      }}
    >
      <CardThumbnail
        name={props.name}
        genre={props.genre}
        displayImageUrl={displayImageUrl}
        isApiLoading={isApiLoading}
      />

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h5"
          component="h3"
          fontWeight="900"
          gutterBottom
          sx={{ lineHeight: 1.2, color: "#1A1A1A" }}
        >
          {props.name}
        </Typography>

        {gatsuTags.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            {gatsuTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  bgcolor: "#FFF5ED",
                  color: BRAND_COLOR,
                  fontWeight: "900",
                  border: `1px solid ${BRAND_COLOR}`,
                }}
              />
            ))}
          </Stack>
        )}

        {note && (
          <Typography
            variant="body2"
            sx={{ color: "#555", lineHeight: 1.8, fontSize: "0.85rem", mb: 2 }}
          >
            {note}
          </Typography>
        )}

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mb: 1 }}>
          <LocationOnIcon sx={{ fontSize: "1rem", color: BRAND_COLOR, mt: 0.2, flexShrink: 0 }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
            {props.address}
          </Typography>
        </Box>

        {props.walkMinutes > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 3 }}>
            <DirectionsWalkIcon sx={{ fontSize: "1rem", color: BRAND_COLOR, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ fontSize: "0.8rem", fontWeight: 800, color: "#444" }}>
              {props.stationName}駅から徒歩約{props.walkMinutes}分
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          onClick={handleMapOpen}
          sx={{
            bgcolor: "#1A1A1A",
            color: "#fff",
            fontWeight: "900",
            borderRadius: 2,
            py: 1.5,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          Googleマップで見る
        </Button>
      </CardContent>
    </Card>
  );
}

type ThumbnailProps = {
  name: string;
  genre: string;
  displayImageUrl: string;
  isApiLoading: boolean;
};

function CardThumbnail({ name, genre, displayImageUrl, isApiLoading }: ThumbnailProps) {
  return (
    <Box sx={{ position: "relative", height: 220, width: "100%" }}>
      {isApiLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{ position: "absolute", zIndex: 1 }}
        />
      )}

      <NextImage
        src={displayImageUrl}
        alt={name}
        fill
        unoptimized={displayImageUrl.startsWith("http")}
        style={{ objectFit: "cover" }}
      />

      <Chip
        label={genre}
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          fontWeight: "900",
          bgcolor: BRAND_COLOR,
          color: "white",
          zIndex: 2,
        }}
      />
    </Box>
  );
}
