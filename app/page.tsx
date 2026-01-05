"use client";

import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import RestaurantCard from "./components/RestaurantCard";
import { WelcomeSection } from "./components/WelcomeSection";
import { useRestaurants } from "./hooks/useRestaurants";

function RestaurantList() {
  const searchParams = useSearchParams();

  // 検索パラメータの取得
  const params = useMemo(
    () => ({
      station: searchParams.get("station") || "周辺",
      lat: searchParams.get("lat") || "",
      lng: searchParams.get("lng") || "",
    }),
    [searchParams]
  );

  const { restaurants, loading } = useRestaurants(params);

  // タイトルの生成ロジック
  const displayTitle = useMemo(() => {
    const names = params.station.split(",");
    if (names.length > 2) return `${names[0]}...他${names.length - 1}駅`;
    return names.join("・");
  }, [params.station]);

  const handleCardClick = (name: string, address: string) => {
    const query = encodeURIComponent(`${name} ${address}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 1 }}>
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
        <WelcomeSection />
      )}
    </Container>
  );
}

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
