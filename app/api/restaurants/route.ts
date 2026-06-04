import { RestaurantSchema } from "@/utils/restaurantHelpers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { buildGatsuriQuery, calculateAvgLocation, formatPlaceResult } from "./helpers";
import { MOCK_RESTAURANTS } from "./mockData";
import { fetchPlaces } from "./placesClient";

const USE_MOCK = process.env.USE_MOCK === "true";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const latParam = searchParams.get("lat");
    const lngParam = searchParams.get("lng");
    const stationParam = searchParams.get("station");

    console.log("API Request params:", { station: stationParam, lat: latParam, lng: lngParam });

    if (!latParam || !lngParam) {
      console.error("Missing coordinates in request");
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    const lats = latParam.split(",").map(Number).filter((n) => !isNaN(n) && n !== 0);
    const lngs = lngParam.split(",").map(Number).filter((n) => !isNaN(n) && n !== 0);

    if (lats.length === 0 || lngs.length === 0) {
      console.error("Invalid coordinates after parsing:", { lats, lngs });
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const { lat, lng } = calculateAvgLocation(lats, lngs);
    console.log("Calculated center:", { lat, lng, from: { lats, lngs } });

    const query = buildGatsuriQuery();

    if (USE_MOCK) {
      console.log("[MOCK] Returning mock restaurant data");
      return NextResponse.json({ results: MOCK_RESTAURANTS });
    }

    const places = await fetchPlaces(query, lat, lng);

    if (places.length === 0) {
      console.log("No places found, returning empty results");
      return NextResponse.json({ results: [] });
    }

    const formattedResults = places.map(formatPlaceResult);
    const validatedResults = z.array(RestaurantSchema).parse(formattedResults);

    console.log(`Returning ${validatedResults.length} validated results`);

    return NextResponse.json({ results: validatedResults });
  } catch (error) {
    console.error("Critical API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
