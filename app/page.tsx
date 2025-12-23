"use client";

import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import RestaurantCard, { RestaurantInfoDTO } from "./components/RestaurantCard";

function RestaurantList() {
  const searchParams = useSearchParams();
  const stationParam = searchParams.get("station") || "周辺";

  const stationNames = stationParam.split(",");
  const stationLats = (searchParams.get("lat") || "").split(",").map(Number);
  const stationLngs = (searchParams.get("lng") || "").split(",").map(Number);

  const displayTitle =
    stationNames.length > 2
      ? `${stationNames[0]}...他${stationNames.length - 1}駅`
      : stationNames.join("・");

  const [restaurants, setRestaurants] = useState<RestaurantInfoDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // 2点間の距離計算
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
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getGooglePhotoUrl = (photoName: string | undefined) => {
    if (!photoName) return "/images/no_image.jpg";
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) return "/images/no_image.jpg";

    return `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxWidthPx=400&maxHeightPx=400`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          station: stationParam,
          lat: searchParams.get("lat") || "",
          lng: searchParams.get("lng") || "",
        });

        const res = await fetch(`/api/restaurants?${query.toString()}`);
        const data = await res.json();

        if (!data.results) {
          setRestaurants([]);
          return;
        }

        const formattedData: RestaurantInfoDTO[] = data.results
          .map((place: any) => {
            const genreText =
              place.types && place.types.length > 0
                ? place.types[0].replace(/_/g, " ")
                : "飲食店";

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

            const displayStation =
              stationNames.length > 1
                ? `${nearestStationName}駅(近)`
                : `${nearestStationName}駅`;

            return {
              id: place.id,
              name: place.name,
              genre: genreText,
              address: place.address,
              station: displayStation,
              walkMinutes: minWalkMinutes === 999 ? 0 : minWalkMinutes,
              description: `評価: ★${place.rating} (${place.reviewCount}件の口コミ)`,
              imageUrl: getGooglePhotoUrl(place.photoReference),
            };
          })
          .filter(
            (restaurant: RestaurantInfoDTO) => restaurant.walkMinutes <= 10
          );

        setRestaurants(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (stationParam !== "周辺") {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [searchParams, stationParam]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ mb: 4, fontWeight: "bold" }}
      >
        {displayTitle}のがっつりグルメ
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {restaurants.map((restaurant) => (
            <Grid key={restaurant.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <RestaurantCard
                name={restaurant.name}
                genre={restaurant.genre}
                address={restaurant.address}
                station={restaurant.station}
                walkMinutes={restaurant.walkMinutes}
                description={restaurant.description}
                imageUrl={restaurant.imageUrl}
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      restaurant.name + " " + restaurant.address
                    )}`,
                    "_blank"
                  );
                }}
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
