import { 
  GooglePlace, 
  GooglePlaceSchema, 
  RestaurantSchema, 
  getGenre 
} from "@/utils/restaurantHelpers";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

// --- Constants ---
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";
const GATSURI_KEYWORDS = ["牛丼", "定食", "カツ丼", "中華料理", "カレー", "スープカレー"];

/**
 * クエリを構築する (ラーメンを確定で含め、もう1つをランダムに選択)
 */
const buildGatsuriQuery = () => {
  const shuffled = [...GATSURI_KEYWORDS].sort(() => 0.5 - Math.random());
  return `ラーメン 油そば すた丼 ${shuffled[0]}`;
};

/**
 * 座標の平均値を計算し、キャッシュヒット率を上げるために小数点第3位で丸める
 * (約100m程度の誤差を許容することで、微妙な座標ズレでもキャッシュを有効にする)
 */
const calculateAvgLocation = (lats: number[], lngs: number[]) => {
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
  return {
    lat: Math.round(avgLat * 1000) / 1000,
    lng: Math.round(avgLng * 1000) / 1000,
  };
};

/**
 * Google Places APIの生データを自社アプリの形式に変換
 */
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

const fetchPlacesWithCache = unstable_cache(
  async (query: string, lat: number, lng: number) => {
    if (!GOOGLE_API_KEY) return [];

    console.log(`[API Call] Query: "${query}" at (${lat}, ${lng})`);

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
        maxResultCount: 20,
        minRating: 3.0,
        locationBias: {
          circle: { center: { latitude: lat, longitude: lng }, radius: 800.0 }
        },
        includedType: "restaurant",
      }),
    });

    if (!response.ok) {
      console.error("Google Places API Error Status:", response.status);
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
  },
  ["restaurants-search-v2"],
  { revalidate: 86400 }
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // パラメータ取得と数値化
    const parseCoords = (key: string) => 
      searchParams.get(key)?.split(",").map(Number).filter(n => !isNaN(n)) || [];
    
    const lats = parseCoords("lat");
    const lngs = parseCoords("lng");

    if (lats.length === 0 || lngs.length === 0) {
      return NextResponse.json({ error: "Missing or invalid coordinates" }, { status: 400 });
    }

    // 1. クエリ構築と座標計算
    const query = buildGatsuriQuery();
    const { lat, lng } = calculateAvgLocation(lats, lngs);

    // 2. データ取得 (キャッシュ対応)
    const places = await fetchPlacesWithCache(query, lat, lng);

    // 3. データ成形とバリデーション
    const formattedResults = places.map(formatPlaceResult);
    const validatedResults = z.array(RestaurantSchema).parse(formattedResults);

    // 4. レスポンス (ブラウザキャッシュ用ヘッダーも付与)
    return NextResponse.json(
      { results: validatedResults },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
        },
      }
    );
  } catch (error) {
    console.error("Critical API Route Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}