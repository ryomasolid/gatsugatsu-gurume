"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import StationHeader from "@/components/StationHeader";
import { useRestaurants } from "@/hooks/useRestaurants";
import { detectGatsuTags } from "@/utils/tagDetector";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import RestaurantIcon from "@mui/icons-material/Restaurant";
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
  Paper,
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

const IMG_CACHE_PREFIX = "gatsu_img_";

export default function StationClient({ stationName }: { stationName: string }) {
  const searchParams = useSearchParams();
  const [coords, setCoords] = useState<{ lat: string; lng: string } | null>(null);
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    // 1. URLに座標がある場合はまずそれをセット（表示を速めるため）
    if (lat && lng) {
      setCoords({ lat, lng });
    }

    // 2. 路線情報の取得（URLに座標があってもなくても、駅名から路線リストを取得する）
    const fetchStationData = async () => {
      try {
        const res = await fetch(
          `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(stationName)}`
        );
        const data = await res.json();
        
        if (data.response?.station) {
          // 路線リストの抽出
          const uniqueLines = Array.from(new Set(data.response.station.map((st: any) => st.line))) as string[];
          setLines(uniqueLines);

          // URLに座標がなかった場合のフォールバック（最初の候補の座標を使う）
          if (!lat || !lng) {
            const s = data.response.station[0];
            setCoords({ lat: String(s.y), lng: String(s.x) });
          }
        }
      } catch (e) {
        console.error("路線情報の取得に失敗しました:", e);
      }
    };

    fetchStationData();
  }, [stationName, searchParams]);

  const { restaurants, loading, errorType } = useRestaurants({
    station: stationName,
    lat: coords?.lat || "",
    lng: coords?.lng || "",
  });

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pb: 8 }}>
      <StationHeader stationName={stationName} />
      
      <Container maxWidth="xl">
        <Breadcrumbs stationName={stationName} />

        {/* SEO強化セクション */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 4 }, 
            mb: 4, 
            borderRadius: 4, 
            border: "2px solid #1A1A1A",
            bgcolor: "#fff" 
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="900" gutterBottom sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
            {stationName}駅周辺のがっつり飯・デカ盛り店
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 700, lineHeight: 1.8 }}>
            {stationName}駅周辺で、お腹いっぱい食べられる「がっつり飯」を厳選紹介。
            ラーメン、肉丼、定食など、徒歩圏内の高コスパ店を独自の解析ロジックでピックアップしました。
            今日の空腹を満たす最高の一杯を見つけましょう。
          </Typography>
          
          {lines.length > 0 && (
            <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: "#666", mr: 1 }}>乗り入れ路線:</Typography>
              {lines.map(line => (
                <Chip key={line} label={line} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
              ))}
            </Box>
          )}
        </Paper>

        <Box component="section">
          <Typography variant="h5" component="h2" fontWeight="900" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
            <RestaurantIcon sx={{ color: "#FF6B00" }} /> 厳選ショップリスト
          </Typography>

          {errorType === "quota" && (
            <Alert severity="error" sx={{ mb: 4, fontWeight: "bold", borderRadius: 3 }}>
              本日の店舗検索上限に達しました。明日またお試しください。
            </Alert>
          )}

          <RestaurantResultList restaurants={restaurants} loading={loading} />

          {!loading && errorType === "none" && coords && restaurants.length === 0 && (
            <Alert severity="info" sx={{ mt: 4, borderRadius: 3, fontWeight: "bold" }}>
              <Typography variant="body1">
                {stationName}駅周辺で、私たちの「がっつり基準」を満たすお店が現在見つかりませんでした。
              </Typography>
            </Alert>
          )}
        </Box>
      </Container>
    </Box>
  );
}

function RestaurantResultList({ restaurants, loading }: { restaurants: RestaurantInfoDTO[]; loading: boolean }) {
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress thickness={5} size={60} sx={{ color: "#FF6B00" }} />
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
  const [displayImageUrl, setDisplayImageUrl] = useState<string>(() => {
    return localStorage.getItem(`${IMG_CACHE_PREFIX}${props.id}`) || defaultImg;
  });
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const gatsuTags = detectGatsuTags(props.description);
  const rating = parseFloat(props.description.match(/★(\d+(\.\d+)?)/)?.[1] || "0");

  useEffect(() => {
    if (displayImageUrl.startsWith("http") || imgError) return;
    const fetchCustomImage = async () => {
      setIsApiLoading(true);
      try {
        const query = `${props.name} ${props.station} 料理`;
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
  }, [props.id, props.name, props.station, displayImageUrl, imgError]);

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
          borderColor: "#FF6B00",
        },
      }}
    >
      <Box sx={{ position: "relative", height: 220, width: "100%" }}>
        {isApiLoading && (
          <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: "absolute", zIndex: 1 }} />
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
            fontWeight: "900",
            bgcolor: "#FF6B00",
            color: "white",
            zIndex: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" component="h3" fontWeight="900" gutterBottom sx={{ lineHeight: 1.2, color: "#1A1A1A" }}>
          {props.name}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {gatsuTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ bgcolor: "#FFF5ED", color: "#FF6B00", fontWeight: "900", border: "1px solid #FF6B00" }}
            />
          ))}
        </Stack>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Rating value={rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: "bold" }}>
            {props.description.length > 50 ? props.description.substring(0, 50) + "..." : props.description}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip
            icon={<DirectionsWalkIcon />}
            label={`${props.station} 徒歩${props.walkMinutes}分`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: "900", borderColor: "#DDD" }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: "3em", fontSize: "0.8rem" }}>
          {props.address}
        </Typography>
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