"use client";

import { calculateGatsuIndex, detectGatsuTags } from "@/utils/tagDetector";
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
  const gatsuScore = calculateGatsuIndex({ ...props, description: safeDesc });

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
        gatsuScore={gatsuScore}
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

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mb: 3 }}>
          <LocationOnIcon sx={{ fontSize: "1rem", color: BRAND_COLOR, mt: 0.2, flexShrink: 0 }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
            {props.address}
          </Typography>
        </Box>

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
  gatsuScore: number;
};

function CardThumbnail({ name, genre, displayImageUrl, isApiLoading, gatsuScore }: ThumbnailProps) {
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

      <Box
        sx={{
          position: "absolute",
          bottom: -15,
          right: 15,
          bgcolor: "#1A1A1A",
          color: "#fff",
          p: "8px 12px",
          borderRadius: "10px",
          border: `2px solid ${BRAND_COLOR}`,
          zIndex: 3,
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="caption"
          sx={{ display: "block", fontSize: "0.6rem", fontWeight: 900, mb: -0.5 }}
        >
          GATSU-INDEX
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 900, color: BRAND_COLOR }}>
          {gatsuScore}
          <span style={{ fontSize: "0.8rem", marginLeft: "2px" }}>pt</span>
        </Typography>
      </Box>

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
