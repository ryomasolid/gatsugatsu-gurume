"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import StationHeader from "@/components/StationHeader";
import { calculateGatsuIndex, detectGatsuTags } from "@/utils/tagDetector";
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
  Grid,
  Rating,
  Skeleton,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import NextImage from "next/image";
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
  location: { latitude: number; longitude: number };
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

export default function StationClient({ 
  stationName, 
  initialRestaurants, 
  initialCoords 
}: { 
  stationName: string; 
  initialRestaurants: RestaurantInfoDTO[]; 
  initialCoords: { lat: string; lng: string } | null;
}) {
  const [restaurants, setRestaurants] = useState<RestaurantInfoDTO[]>(initialRestaurants);
  const [lines, setLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const res = await fetch(
          `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(stationName)}`
        );
        const data = await res.json();
        if (data.response?.station) {
          const uniqueLines = Array.from(new Set(data.response.station.map((st: any) => st.line))) as string[];
          setLines(uniqueLines);
        }
      } catch (e) {
        console.error("路線情報の取得に失敗:", e);
      }
    };
    fetchLines();
  }, [stationName]);

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pb: 8 }}>
      <StationHeader stationName={stationName} />
      
      <Container maxWidth="xl">
        <Breadcrumbs stationName={stationName} />

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
            {stationName}駅周辺で、お腹いっぱい食べられる名店をピックアップしました。
            独自ロジックにより、ボリュームと満足度の高い店舗を厳選しています。
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

          <RestaurantResultList restaurants={restaurants} loading={loading} stationName={stationName} />
        </Box>
      </Container>
    </Box>
  );
}

function RestaurantResultList({ restaurants, loading, stationName }: { restaurants: RestaurantInfoDTO[]; loading: boolean; stationName: string }) {
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress thickness={5} size={60} sx={{ color: "#FF6B00" }} />
      </Box>
    );
  
  if (restaurants.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 4, borderRadius: 3, fontWeight: "bold" }}>
        {stationName}駅周辺で「がっつり基準」を満たすお店が現在見つかりませんでした。
      </Alert>
    );
  }

  return (
    <Grid container spacing={3}>
      {restaurants.map((r) => (
        <Grid key={r.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <RestaurantCard {...r} stationName={stationName} />
        </Grid>
      ))}
    </Grid>
  );
}

function RestaurantCard(props: RestaurantInfoDTO & { stationName: string }) {
  const BRAND_COLOR = "#FF6B00";
  // --- 【修正ポイント】安全なアクセス ---
  const safeDesc = props.description || "";
  const defaultImg = GENRE_IMAGES[props.genre] || GENRE_IMAGES["その他"];
  
  const [displayImageUrl, setDisplayImageUrl] = useState<string>(defaultImg);
  const [isApiLoading, setIsApiLoading] = useState(false);

  const gatsuTags = detectGatsuTags(safeDesc);
  
  // matchの結果を安全に取得
  const ratingMatch = safeDesc.match(/★(\d+(\.\d+)?)/);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
  
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
      <Box sx={{ position: "relative", height: 220, width: "100%" }}>
        {isApiLoading && <Skeleton variant="rectangular" width="100%" height="100%" sx={{ position: "absolute", zIndex: 1 }} />}
        
        <Box sx={{
          position: "absolute", bottom: -15, right: 15, bgcolor: "#1A1A1A", color: "#fff",
          p: "8px 12px", borderRadius: "10px", border: `2px solid ${BRAND_COLOR}`, zIndex: 3,
          textAlign: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
        }}>
          <Typography variant="caption" sx={{ display: "block", fontSize: "0.6rem", fontWeight: 900, mb: -0.5 }}>GATSU-INDEX</Typography>
          <Typography variant="h6" sx={{ fontWeight: 900, color: BRAND_COLOR }}>{gatsuScore}<span style={{ fontSize: "0.8rem", marginLeft: "2px" }}>pt</span></Typography>
        </Box>

        <NextImage
          src={displayImageUrl}
          alt={props.name}
          fill
          unoptimized={displayImageUrl.startsWith("http")}
          style={{ objectFit: "cover" }}
        />
        <Chip label={props.genre} sx={{ position: "absolute", top: 12, left: 12, fontWeight: "900", bgcolor: BRAND_COLOR, color: "white", zIndex: 2 }} />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5" component="h3" fontWeight="900" gutterBottom sx={{ lineHeight: 1.2, color: "#1A1A1A" }}>
          {props.name}
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {gatsuTags.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ bgcolor: "#FFF5ED", color: BRAND_COLOR, fontWeight: "900", border: `1px solid ${BRAND_COLOR}` }} />
          ))}
        </Stack>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Rating value={rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1, fontWeight: "bold" }}>
            {safeDesc.length > 50 ? safeDesc.substring(0, 50) + "..." : safeDesc}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: "3em", fontSize: "0.8rem" }}>
          {props.address}
        </Typography>
        <Button fullWidth variant="contained" onClick={handleMapOpen} sx={{ bgcolor: "#1A1A1A", color: "#fff", fontWeight: "900", borderRadius: 2, py: 1.5, "&:hover": { bgcolor: "#333" } }}>
          Googleマップで見る
        </Button>
      </CardContent>
    </Card>
  );
}