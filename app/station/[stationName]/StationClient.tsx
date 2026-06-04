"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import StationHeader from "@/components/StationHeader";
import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import StationIntroPanel from "./_components/StationIntroPanel";
import RestaurantList from "./_components/RestaurantList";
import { RestaurantInfoDTO } from "./types";

export type { RestaurantInfoDTO };

type Props = {
  stationName: string;
  initialRestaurants: RestaurantInfoDTO[];
  initialCoords: { lat: string; lng: string } | null;
};

export default function StationClient({ stationName, initialRestaurants, initialCoords }: Props) {
  const [restaurants] = useState<RestaurantInfoDTO[]>(initialRestaurants);
  const [lines, setLines] = useState<string[]>([]);
  const [loading] = useState(false);

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const res = await fetch(
          `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(stationName)}`
        );
        const data = await res.json();
        if (!data.response?.station) return;

        let stations: any[] = data.response.station;

        // 同名駅が複数ある場合、既知の座標に近い駅のみに絞り込む（約1km以内）
        if (initialCoords) {
          const lat = parseFloat(initialCoords.lat);
          const lng = parseFloat(initialCoords.lng);
          const nearby = stations.filter(
            (st: any) =>
              Math.abs(parseFloat(st.y) - lat) < 0.01 &&
              Math.abs(parseFloat(st.x) - lng) < 0.01
          );
          if (nearby.length > 0) stations = nearby;
        }

        const uniqueLines = Array.from(
          new Set(stations.map((st: any) => st.line))
        ) as string[];
        setLines(uniqueLines);
      } catch (e) {
        console.error("路線情報の取得に失敗:", e);
      }
    };
    fetchLines();
  }, [stationName, initialCoords]);

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pb: 8 }}>
      <StationHeader stationName={stationName} />
      <Container maxWidth="xl">
        <Breadcrumbs stationName={stationName} />
        <StationIntroPanel stationName={stationName} lines={lines} />
        <RestaurantList restaurants={restaurants} loading={loading} stationName={stationName} />
      </Container>
    </Box>
  );
}
