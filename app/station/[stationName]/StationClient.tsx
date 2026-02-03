"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import StationHeader from "@/components/StationHeader";
import { useRestaurants } from "@/hooks/useRestaurants";
import { detectGatsuTags } from "@/utils/tagDetector";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import NextImage from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// --- 型定義 ---
export type RestaurantInfoDTO = {
  id: string;
  name: string;
  genre: string;
  address: string;
  station: string;
  walkMinutes: number;
  description: string;
};

type RestaurantCardProps = RestaurantInfoDTO & {
  onClick?: () => void;
};

// --- 定数 ---
const GENRE_IMAGES: Record<string, string> = {
  ラーメン: "/images/ramen.png",
  油そば: "/images/aburasoba.png",
  牛丼: "/images/gyudon.png",
  定食: "/images/teishoku.png",
  カツ丼: "/images/katsudon.png",
  中華料理: "/images/chinese.png",
  スタミナ料理: "/images/stamina.png",
  カレー: "/images/curry.png",
  スープカレー: "/images/soupcurry.png",
  その他: "/images/default.png",
};

// 画像URLキャッシュ用のプレフィックス
const IMG_CACHE_PREFIX = "gatsu_img_";

export default function StationClient({
  stationName,
}: {
  stationName: string;
}) {
  const searchParams = useSearchParams();
  const [coords, setCoords] = useState<{ lat: string; lng: string } | null>(
    null
  );
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    if (lat && lng) {
      setCoords({ lat, lng });
    } else {
      const fetchCoords = async () => {
        try {
          const res = await fetch(
            `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(
              stationName
            )}`
          );
          const data = await res.json();
          if (data.response?.station?.[0]) {
            const s = data.response.station[0];
            setCoords({ lat: String(s.y), lng: String(s.x) });
            setLines([
              ...new Set(data.response.station.map((st: any) => st.line)),
            ] as string[]);
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchCoords();
    }
  }, [stationName, searchParams]);

  const { restaurants, loading, errorType } = useRestaurants({
    station: stationName,
    lat: coords?.lat || "",
    lng: coords?.lng || "",
  });

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pb: 6 }}>
      <StationHeader stationName={stationName} />
      <Container maxWidth="xl">
        <Breadcrumbs stationName={stationName} />
        {/* API制限時のエラー表示 */}
        {errorType === "quota" && (
          <Alert severity="error" sx={{ mb: 4, fontWeight: "bold" }}>
            本日の店舗検索上限に達しました。明日またお試しください。
            <Typography variant="caption" display="block">
              ※開発中のリロード等により制限がかかる場合があります。
            </Typography>
          </Alert>
        )}

        {lines.length > 0 && (
          <Box sx={{ mb: 4, px: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
              乗り入れ路線: {lines.join(" / ")}
            </Typography>
            <Divider />
          </Box>
        )}

        <RestaurantResultList restaurants={restaurants} loading={loading} />

        {!loading &&
          errorType === "none" &&
          coords &&
          restaurants.length === 0 && (
            <Alert severity="info" sx={{ mt: 4 }}>
              {stationName}駅周辺でのお店が見つかりませんでした。
            </Alert>
          )}
      </Container>
    </Box>
  );
}

function RestaurantResultList({
  restaurants,
  loading,
}: {
  restaurants: RestaurantInfoDTO[];
  loading: boolean;
}) {
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress color="primary" thickness={5} size={60} />
      </Box>
    );
  if (restaurants.length === 0) return null;
  return (
    <Grid container spacing={3}>
      {restaurants.map((r) => (
        <Grid key={r.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <RestaurantCard {...r} />
        </Grid>
      ))}
    </Grid>
  );
}

function RestaurantCard(props: RestaurantCardProps) {
  const defaultImg = GENRE_IMAGES[props.genre] || GENRE_IMAGES["その他"];
  // 初回表示時にキャッシュを確認
  const [displayImageUrl, setDisplayImageUrl] = useState<string>(() => {
    return localStorage.getItem(`${IMG_CACHE_PREFIX}${props.id}`) || defaultImg;
  });
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const gatsuTags = detectGatsuTags(props.description);
  const rating = parseFloat(
    props.description.match(/★(\d+(\.\d+)?)/)?.[1] || "0"
  );

  useEffect(() => {
    // キャッシュがある、または既に外部URLが設定されている、またはエラー時は叩かない
    if (displayImageUrl.startsWith("http") || imgError) return;

    const fetchCustomImage = async () => {
      setIsApiLoading(true);
      try {
        const query = `${props.name} ${props.station} 料理`;
        const res = await fetch(
          `/api/restaurant-image?q=${encodeURIComponent(query)}`
        );
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
  }, [props.id, props.name, props.station, displayImageUrl, imgError]);

  const handleMapOpen = () => {
    const query = encodeURIComponent(`${props.name} ${props.address}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
        },
      }}
    >
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
          alt={props.name}
          fill
          unoptimized={displayImageUrl.startsWith("http")}
          style={{ objectFit: "cover" }}
          onError={() => {
            setImgError(true);
            setDisplayImageUrl(defaultImg);
          }}
        />
        <Chip
          label={props.genre}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: "bold",
            bgcolor: "#FF6B00",
            color: "white",
            zIndex: 2,
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h5"
          fontWeight="900"
          gutterBottom
          sx={{ lineHeight: 1.2 }}
        >
          {props.name}
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 2 }}
        >
          {gatsuTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                bgcolor: "#FFF5ED",
                color: "#FF6B00",
                fontWeight: "bold",
                border: "1px solid #FF6B00",
              }}
            />
          ))}
        </Stack>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Rating value={rating} precision={0.1} readOnly size="small" />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 1, fontWeight: "bold" }}
          >
            {props.description.length > 50
              ? props.description.substring(0, 50) + "..."
              : props.description}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip
            icon={<DirectionsWalkIcon />}
            label={`${props.station} 徒歩${props.walkMinutes}分`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: "3em" }}
        >
          {props.address}
        </Typography>
        <Button
          fullWidth
          variant="contained"
          onClick={handleMapOpen}
          sx={{
            bgcolor: "#1A1A1A",
            color: "#fff",
            fontWeight: "bold",
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
