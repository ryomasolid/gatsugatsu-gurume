"use client";

import RestaurantCard from "@/app/components/RestaurantCard";
import { useRestaurants } from "@/app/hooks/useRestaurants";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function StationClient({
  stationName,
}: {
  stationName: string;
}) {
  const searchParams = useSearchParams();

  // 初期値は null にしておき、ブラウザ側で読み込んでからセットする
  const [coords, setCoords] = useState<{ lat: string; lng: string } | null>(
    null
  );

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (lat && lng) {
      // URLに座標がある場合
      setCoords({ lat, lng });
    } else {
      // URLに座標がない場合（検索エンジン経由など）
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
          }
        } catch (e) {
          console.error("駅情報の取得に失敗しました", e);
        }
      };
      fetchCoords();
    }
  }, [stationName, searchParams]);

  const restaurantParams = useMemo(
    () => ({
      station: stationName,
      lat: coords?.lat || "",
      lng: coords?.lng || "",
    }),
    [stationName, coords]
  );

  const { restaurants, loading } = useRestaurants(restaurantParams);

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
        sx={{
          textAlign: "center",
          fontWeight: 900,
          mb: { xs: 3, md: 6 },
          fontSize: { xs: "1.25rem", sm: "2rem", md: "3rem" },
          color: "#1A1A1A",
          textShadow: "1.5px 1.5px 0px #FF6B00",
        }}
      >
        {stationName} のガツガツグルメ
      </Typography>

      {/* coordsが確定するまでローディングを表示することで、サーバーとの不一致を防ぐ */}
      {loading || !coords ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
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
      )}
    </Container>
  );
}
