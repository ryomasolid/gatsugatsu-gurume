import { GATSURI_KEYWORDS, STATIC_PREDEFINED_DATA } from "@/constants/restaurantData";
import { GooglePlace, GooglePlaceSchema, RestaurantSchema, getGenre } from "@/utils/restaurantHelpers";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

const getCachedPlaces = unstable_cache(
  async (combinedQuery: string, avgLat: number, avgLng: number) => {
    if (!GOOGLE_API_KEY) return { places: [], status: 200 };

    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.types,places.primaryType",
      },
      body: JSON.stringify({
        textQuery: combinedQuery,
        languageCode: "ja",
        maxResultCount: 30,
        minRating: 3.0,
        locationBias: { circle: { center: { latitude: avgLat, longitude: avgLng }, radius: 2000.0 } },
      }),
    });

    if (!response.ok) return { places: [], status: response.status };

    const data = await response.json();
    
    // // Zodで「生データ」を検品
    // const parsed = z.array(GooglePlaceSchema).safeParse(data.places || []);
    // return { places: parsed.success ? parsed.data : [], status: 200 };

    // data.places は外部から来た不明なデータなので、まず unknown として扱う
    const rawPlaces: unknown[] = data.places || [];

    const validatedPlaces = rawPlaces
      .map((place: unknown) => {
        // Zodの safeParse は unknown 型をそのまま受け取れる設計になっている
        const result = GooglePlaceSchema.safeParse(place);
        
        // 合格（success: true）ならパース済みのきれいなデータ、失敗なら null を返す
        return result.success ? result.data : null;
      })
      .filter((place): place is GooglePlace => place !== null);

    return { places: validatedPlaces, status: 200 };
  },
  ["restaurants-search-persistent"],
  { revalidate: 86400 }
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const station = searchParams.get("station") || "";
    const lat = searchParams.get("lat")?.split(",").map(Number).filter(n => !isNaN(n)) || [];
    const lng = searchParams.get("lng")?.split(",").map(Number).filter(n => !isNaN(n)) || [];

    if (lat.length === 0) return NextResponse.json({ error: "No coordinates" }, { status: 400 });

    // 1. 固定データの検品と返却
    if (STATIC_PREDEFINED_DATA[station]) {
      const validatedStaticData = z.array(RestaurantSchema).safeParse(STATIC_PREDEFINED_DATA[station]);
      if (validatedStaticData.success) {
        return NextResponse.json({ results: validatedStaticData.data });
      }
      // もし固定データが壊れていたらログを出してAPIへフォールバック、またはエラー
      console.error(`Static data for ${station} is invalid:`, validatedStaticData.error);
    }

    const avgLat = lat.reduce((a, b) => a + b, 0) / lat.length;
    const avgLng = lng.reduce((a, b) => a + b, 0) / lng.length;
    const combinedQuery = `${station.split(",").join(" ")} ${GATSURI_KEYWORDS.join(" ")}`;

    const { places, status } = await getCachedPlaces(combinedQuery, avgLat, avgLng);

    // API制限（403）などの検知
    if (status !== 200) {
      return NextResponse.json({ error: "API Limit" }, { status: status });
    }

    // 2. データの成形と最終検品
    const results = places.map((place:any) => {
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
    });

    // 最終的な出力リストがRestaurantSchemaに従っているかチェック
    const finalResults = z.array(RestaurantSchema).parse(results);

    return NextResponse.json({ results: finalResults });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}