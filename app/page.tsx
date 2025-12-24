"use client";

import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import RestaurantCard, { RestaurantInfoDTO } from "./components/RestaurantCard";

function RestaurantList() {
  const searchParams = useSearchParams();

  // useMemoで値を固定し、不要なuseEffectの実行を防ぐ
  const stationParam = useMemo(
    () => searchParams.get("station") || "周辺",
    [searchParams]
  );
  const latParam = useMemo(() => searchParams.get("lat") || "", [searchParams]);
  const lngParam = useMemo(() => searchParams.get("lng") || "", [searchParams]);

  const [restaurants, setRestaurants] = useState<RestaurantInfoDTO[]>([]);
  const [loading, setLoading] = useState(false);

  // 距離計算ロジック
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const getGooglePhotoUrl = (photoName: string | undefined) => {
    if (!photoName) return "/images/no_image.jpg";
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) return "/images/no_image.jpg";
    return `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxWidthPx=400&maxHeightPx=400`;
  };

  useEffect(() => {
    if (stationParam === "周辺") {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          station: stationParam,
          lat: latParam,
          lng: lngParam,
        });
        const res = await fetch(`/api/restaurants?${query.toString()}`);
        const data = await res.json();

        if (!data.results) {
          setRestaurants([]);
          return;
        }

        const stationNames = stationParam.split(",");
        const stationLats = latParam.split(",").map(Number);
        const stationLngs = lngParam.split(",").map(Number);

        const formattedData: RestaurantInfoDTO[] = data.results.map(
          (place: any) => {
            let minWalkMinutes = 999;
            let nearestStationName = "駅";

            if (place.location && stationLats.length > 0) {
              stationLats.forEach((lat, index) => {
                const lng = stationLngs[index];
                if (!lat || !lng) return;
                const distance = calculateDistance(
                  lat,
                  lng,
                  place.location.latitude,
                  place.location.longitude
                );
                const minutes = Math.ceil(distance / 80);
                if (minutes < minWalkMinutes) {
                  minWalkMinutes = minutes;
                  nearestStationName = stationNames[index];
                }
              });
            }

            return {
              id: place.id,
              name: place.name,
              genre: place.types?.[0]?.replace(/_/g, " ") || "飲食店",
              address: place.address,
              station:
                stationNames.length > 1
                  ? `${nearestStationName}駅(近)`
                  : `${nearestStationName}駅`,
              walkMinutes: minWalkMinutes === 999 ? 0 : minWalkMinutes,
              description: `評価: ★${place.rating} (${place.reviewCount}件の口コミ)`,
              imageUrl: getGooglePhotoUrl(place.photoReference),
            };
          }
        );

        setRestaurants(formattedData);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [stationParam, latParam, lngParam]);

  const displayTitle =
    stationParam.split(",").length > 2
      ? `${stationParam.split(",")[0]}...他${
          stationParam.split(",").length - 1
        }駅`
      : stationParam.split(",").join("・");

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
          color: (theme) =>
            theme.palette.mode === "dark" ? "#FFFFFF" : "#1A1A1A",
          textShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 0 10px #FF6B00"
              : "3px 3px 0px rgba(255, 107, 0, 0.2)",
        }}
      >
        {displayTitle}のガツガツグルメ
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {restaurants.map((r) => (
            <Grid key={r.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <RestaurantCard
                {...r}
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      r.name + " " + r.address
                    )}`,
                    "_blank"
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <RestaurantList />
    </Suspense>
  );
}
