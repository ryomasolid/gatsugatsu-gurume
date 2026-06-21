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
import NeighborStationLinks from "./NeighborStationLinks";
import RestaurantList from "./RestaurantList";
import { RestaurantInfoDTO } from "../types";

type Props = {
  stationName: string;
  initialRestaurants: RestaurantInfoDTO[];
  initialCoords: { lat: string; lng: string } | null;
  lines: string[];
  guide?: string;
  dataDate?: string;
  maintenance?: boolean;
  prefecture: string;
  neighborLines: { line: string; neighbors: string[] }[];
};

export default function StationClient({
  stationName,
  initialRestaurants,
  lines,
  guide,
  dataDate,
  maintenance,
  prefecture,
  neighborLines,
}: Props) {
  useEffect(() => {
    sendGAEvent("event", "station_view", { station_name: stationName });

    if (document.referrer.includes("google.")) {
      sendGAEvent("event", "organic_search_landing", { station_name: stationName });
    }
  }, [stationName]);

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pb: 8 }}>
      <StationHeader stationName={stationName} />
      <Container maxWidth="xl">
        <Breadcrumbs stationName={stationName} prefecture={prefecture} />
        <StationIntroPanel
          stationName={stationName}
          lines={lines}
          guide={guide}
          dataDate={dataDate}
        />
        <StationSummary stationName={stationName} restaurants={initialRestaurants} />
        <RestaurantList
          restaurants={initialRestaurants}
          loading={false}
          maintenance={maintenance}
          stationName={stationName}
        />
        <StationFAQ
          stationName={stationName}
          restaurants={initialRestaurants}
          lines={lines}
        />
        <NeighborStationLinks
          stationName={stationName}
          neighborLines={neighborLines}
        />
        <MethodologySection />
      </Container>
    </Box>
  );
}
