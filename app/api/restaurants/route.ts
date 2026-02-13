import { 
  GooglePlace, 
  GooglePlaceSchema, 
  RestaurantSchema, 
  getGenre 
} from "@/utils/restaurantHelpers";
import { NextResponse } from "next/server";
import { z } from "zod";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";
const GATSURI_KEYWORDS = ["ラーメン", "定食", "中華", "カレー"];

const getBoundingBox = (lat: number, lng: number, radiusInMeters: number) => {
  const latDelta = radiusInMeters / 111320;
  const lngDelta = radiusInMeters / (111320 * Math.cos(lat * (Math.PI / 180)));
  return {
    low: { latitude: lat - latDelta, longitude: lng - lngDelta },
    high: { latitude: lat + latDelta, longitude: lng + lngDelta },
  };
};

const buildGatsuriQuery = () => {
  const shuffled = [...GATSURI_KEYWORDS].sort(() => 0.5 - Math.random());
  return `${shuffled[0]} がっつり 飯`;
};

const calculateAvgLocation = (lats: number[], lngs: number[]) => {
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
  return {
    lat: Math.round(avgLat * 1000) / 1000,
    lng: Math.round(avgLng * 1000) / 1000,
  };
};

const formatPlaceResult = (place: GooglePlace) => {
  const name = place.displayName.text;
  return {
    id: place.id,
    name,
    genre: getGenre(name, place.types, place.primaryType || ""),
    address: place.formattedAddress,
    rating: place.rating || 0,
    reviewCount: place.userRatingCount || 0,
    location: place.location,
  };
};

const fetchPlaces = async (query: string, lat: number, lng: number) => {
  if (!GOOGLE_API_KEY) return [];

  const box = getBoundingBox(lat, lng, 800);

  const response = await fetch(PLACES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.types,places.primaryType",
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: "ja",
      maxResultCount: 15,
      minRating: 3.0,
      locationRestriction: {
        rectangle: {
          low: box.low,
          high: box.high,
        }
      },
      includedType: "restaurant",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    console.error("Google Places API Error:", response.status, errorBody);
    return [];
  }

  const data = await response.json();
  const rawPlaces: unknown[] = data.places || [];

  return rawPlaces
    .map((p) => {
      const parsed = GooglePlaceSchema.safeParse(p);
      return parsed.success ? parsed.data : null;
    })
    .filter((p): p is GooglePlace => p !== null);
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parseCoords = (key: string) => 
      searchParams.get(key)?.split(",").map(Number).filter(n => !isNaN(n)) || [];
    
    const lats = parseCoords("lat");
    const lngs = parseCoords("lng");

    if (lats.length === 0 || lngs.length === 0) {
      return NextResponse.json({ error: "Missing or invalid coordinates" }, { status: 400 });
    }

    const query = buildGatsuriQuery();
    const { lat, lng } = calculateAvgLocation(lats, lngs);

    const places = await fetchPlaces(query, lat, lng);
    const formattedResults = places.map(formatPlaceResult);
    const validatedResults = z.array(RestaurantSchema).parse(formattedResults);

    return NextResponse.json({ results: validatedResults });
    
  } catch (error) {
    console.error("Critical API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}