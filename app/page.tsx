"use client";

import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react"; // useEffect, useState を追加
import RestaurantCard from "./components/RestaurantCard";
import { WelcomeSection } from "./components/WelcomeSection";
import { useRestaurants } from "./hooks/useRestaurants";

function RestaurantList() {
  const searchParams = useSearchParams();

  // ハイドレーションエラー防止：クライアント側でパラメータが確定するまで待つための状態
  const [params, setParams] = useState<{
    station: string;
    lat: string;
    lng: string;
  } | null>(null);

  useEffect(() => {
    // ブラウザ側でのみ実行される
    setParams({
      station: searchParams.get("station") || "",
      lat: searchParams.get("lat") || "",
      lng: searchParams.get("lng") || "",
    });
  }, [searchParams]);

  // レストランデータの取得（paramsがセットされてから実行）
  // stationが空の場合は "周辺" をデフォルトにするなどのロジック
  const { restaurants, loading } = useRestaurants({
    station: params?.station || "周辺",
    lat: params?.lat || "",
    lng: params?.lng || "",
  });

  // タイトルの生成ロジック
  const displayTitle = useMemo(() => {
    if (!params?.station) return "";
    const names = params.station.split(",");
    if (names.length > 2) return `${names[0]}...他${names.length - 1}駅`;
    return names.join("・");
  }, [params?.station]);

  const handleCardClick = (name: string, address: string) => {
    const query = encodeURIComponent(`${name} ${address}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  // paramsがnull（読み込み中）の間は何も表示しない、またはスピナーを出す
  if (!params) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
      {/* 検索結果がある場合のみタイトルを表示 */}
      {params.station && (
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            fontWeight: 900,
            mb: { xs: 3, md: 6 },
            fontSize: { xs: "1.25rem", sm: "2rem", md: "3rem" },
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "#1A1A1A",
            textShadow: "1.5px 1.5px 0px #FF6B00",
          }}
        >
          {displayTitle} のガツガツグルメ
        </Typography>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : restaurants.length > 0 ? (
        <Grid container spacing={3}>
          {restaurants.map((r) => (
            <Grid key={r.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <RestaurantCard
                {...r}
                onClick={() => handleCardClick(r.name, r.address)}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          <WelcomeSection />
        </Box>
      )}
    </Container>
  );
}

// Homeコンポーネントはそのまま（Suspenseで囲む）
export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RestaurantList />
    </Suspense>
  );
}

const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
    }}
  >
    <CircularProgress />
  </Box>
);
