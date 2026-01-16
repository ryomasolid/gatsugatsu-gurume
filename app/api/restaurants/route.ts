import {
  GATSURI_KEYWORDS,
  STATIC_PREDEFINED_DATA,
} from "@/constants/restaurantData";
import {
  GooglePlace,
  RestaurantDTO,
  getGenre,
} from "@/utils/restaurantHelpers";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const getCachedPlaces = unstable_cache(
  async (
    combinedQuery: string,
    avgLat: number,
    avgLng: number
  ): Promise<{ places: GooglePlace[]; status: number }> => {
    if (!GOOGLE_API_KEY) return { places: [], status: 200 };

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.types,places.primaryType",
      },
      body: JSON.stringify({
        textQuery: combinedQuery,
        languageCode: "ja",
        maxResultCount: 20,
        minRating: 3.0,
        locationBias: {
          circle: {
            center: { latitude: avgLat, longitude: avgLng },
            radius: 2000.0,
          },
        },
      }),
    });

    // 制限超過(403)などの場合、エラーを投げずにステータスを返す
    if (!response.ok) return { places: [], status: response.status };

    const data = await response.json();
    return { places: data.places || [], status: 200 };
  },
  ["restaurants-search-persistent"],
  { revalidate: 86400 }
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const station = searchParams.get("station") || "";
    const lat =
      searchParams
        .get("lat")
        ?.split(",")
        .map(Number)
        .filter((n) => !isNaN(n)) || [];
    const lng =
      searchParams
        .get("lng")
        ?.split(",")
        .map(Number)
        .filter((n) => !isNaN(n)) || [];

    if (lat.length === 0)
      return NextResponse.json({ error: "No coordinates" }, { status: 400 });

    // ★ 1. 事前定義データがある場合は即座に返す（API消費ゼロ）
    if (STATIC_PREDEFINED_DATA[station]) {
      return NextResponse.json({ results: STATIC_PREDEFINED_DATA[station] });
    }

    const avgLat = lat.reduce((a, b) => a + b, 0) / lat.length;
    const avgLng = lng.reduce((a, b) => a + b, 0) / lng.length;
    const combinedQuery = `${station
      .split(",")
      .join(" ")} ${GATSURI_KEYWORDS.join(" ")}`;

    // 2. キャッシュまたはAPIから取得
    const { places, status } = await getCachedPlaces(
      combinedQuery,
      avgLat,
      avgLng
    );

    // 3. API制限(403など)に達していたら、そのステータスでフロントに通知
    if (status !== 200) {
      return NextResponse.json(
        { error: "API Limit Reached" },
        { status: status }
      );
    }

    const results: RestaurantDTO[] = places
      .map((place) => {
        const name = place.displayName?.text || "";
        return {
          id: place.id,
          name,
          genre: getGenre(name, place.types, place.primaryType || ""),
          address: place.formattedAddress,
          rating: place.rating || 0,
          reviewCount: place.userRatingCount || 0,
          location: place.location,
        };
      })
      .sort((a, b) => b.reviewCount - a.reviewCount);
    console.log(results);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
