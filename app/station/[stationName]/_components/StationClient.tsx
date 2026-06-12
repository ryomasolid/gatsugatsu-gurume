"use client";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import StationHeader from "@/components/StationHeader";
import { Box, Container } from "@mui/material";
import { sendGAEvent } from "@next/third-parties/google";
import { useEffect } from "react";
import StationIntroPanel from "./StationIntroPanel";
import StationSummary from "./StationSummary";
import StationFAQ from "./StationFAQ";
import MethodologySection from "./MethodologySection";
import RestaurantList from "./RestaurantList";
import { RestaurantInfoDTO } from "../types";

type Props = {
  stationName: string;
  initialRestaurants: RestaurantInfoDTO[];
  initialCoords: { lat: string; lng: string } | null;
  lines: string[];
  guide?: string;
};

export default function StationClient({
  stationName,
  initialRestaurants,
  lines,
  guide,
}: Props) {
  useEffect(() => {
    sendGAEvent("event", "station_view", { station_name: stationName });
  }, [stationName]);

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pb: 8 }}>
      <StationHeader stationName={stationName} />
      <Container maxWidth="xl">
        <Breadcrumbs stationName={stationName} />
        <StationIntroPanel stationName={stationName} lines={lines} guide={guide} />
        <StationSummary stationName={stationName} restaurants={initialRestaurants} />
        <RestaurantList
          restaurants={initialRestaurants}
          loading={false}
          stationName={stationName}
        />
        <StationFAQ
          stationName={stationName}
          restaurants={initialRestaurants}
          lines={lines}
        />
        <MethodologySection />
      </Container>
    </Box>
  );
}
