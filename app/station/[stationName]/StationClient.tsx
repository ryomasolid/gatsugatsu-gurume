"use client";

import RestaurantCard from "@/app/components/RestaurantCard";
import StationHeader from "@/app/components/StationHeader";
import { useRestaurants } from "@/app/hooks/useRestaurants";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
            // 乗り入れ路線も取得
            const allLines = data.response.station.map((st: any) => st.line);
            setLines([...new Set(allLines)] as string[]);
          }
        } catch (e) {
          console.error("駅情報の取得に失敗しました", e);
        }
      };
      fetchCoords();
    }
  }, [stationName, searchParams]);

  const { restaurants, loading } = useRestaurants({
    station: stationName,
    lat: coords?.lat || "",
    lng: coords?.lng || "",
  });

  const handleCardClick = (name: string, address: string) => {
    const query = encodeURIComponent(`${name} ${address}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pb: 6 }}>
      {/* 1. リッチなヘッダーを表示 */}
      <StationHeader stationName={stationName} />

      <Container maxWidth="xl">
        {/* 2. 周辺情報の補足リンクなど */}
        {lines.length > 0 && (
          <Box sx={{ mb: 4, px: 2 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: "bold" }}
            >
              乗り入れ路線: {lines.join(" / ")}
            </Typography>
            <Divider />
          </Box>
        )}

        {loading || !coords ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress color="primary" thickness={5} size={60} />
          </Box>
        ) : restaurants.length > 0 ? (
          <>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                🍴 近くのおすすめ店{" "}
                <small style={{ fontWeight: 400, fontSize: "0.9rem" }}>
                  ({restaurants.length}件見つかりました)
                </small>
              </Typography>
            </Box>

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
          </>
        ) : (
          <Alert severity="info" sx={{ mt: 4 }}>
            {stationName}
            駅周辺で「がっつり」食べられるお店がまだ登録されていないか、検索範囲内に見つかりませんでした。
          </Alert>
        )}
      </Container>
    </Box>
  );
}
