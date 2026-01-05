import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

// --- 型定義 ---
interface GooglePlace {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  types: string[];
  primaryType?: string;
  location: { latitude: number; longitude: number };
}

interface RestaurantDTO {
  id: string;
  name: string;
  genre: string;
  address: string;
  rating: number;
  reviewCount: number;
  location: { latitude: number; longitude: number };
}

// --- 定数・設定 ---
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
const IS_MOCK_MODE = false;

const GATSURI_KEYWORDS = [
  "ラーメン",
  "油そば",
  "牛丼",
  "定食",
  "カツ丼",
  "中華料理",
  "スタミナ料理",
  "カレー",
  "スープカレー",
];

// ジャンル判定用マップ
const GENRE_RULES = [
  { genre: "油そば", keywords: ["油そば", "まぜそば"] },
  { genre: "スープカレー", keywords: ["スープカレー"] },
  { genre: "カツ丼", keywords: ["カツ丼", "かつ丼"] },
  { genre: "牛丼", keywords: ["牛丼", "吉野家", "すき家", "松屋"] },
  {
    genre: "ラーメン",
    keywords: ["ラーメン", "麺屋"],
    types: ["ramen_restaurant"],
  },
  { genre: "中華料理", keywords: ["中華"], types: ["chinese_restaurant"] },
  { genre: "カレー", keywords: ["カレー", "curry"] },
  { genre: "定食", keywords: ["定食", "食堂", "御膳", "めし"] },
  {
    genre: "スタミナ料理",
    keywords: [
      "スタミナ",
      "がっつり",
      "すた丼",
      "背脂",
      "二郎",
      "特盛",
      "爆盛",
    ],
  },
];

/**
 * ジャンル判定ロジック
 */
function getGenre(name: string, types: string[], primaryType: string): string {
  const n = name || "";
  const allTypes = [...(types || []), primaryType].filter(Boolean);

  for (const rule of GENRE_RULES) {
    // キーワードチェック
    const hitKeyword = rule.keywords.some((k) => n.includes(k));
    // タイプチェック（定義されている場合）
    const hitType = rule.types?.some((t) => allTypes.includes(t));

    if (hitKeyword || hitType) return rule.genre;
  }

  return "その他";
}

// --- 疑似データ ---
const MOCK_RESTAURANTS = [
  {
    id: "m1",
    displayName: { text: "ガツガツ二郎系 麺屋極太" },
    formattedAddress: "神奈川県川崎市中原区小杉町",
    rating: 4.5,
    userRatingCount: 420,
    types: ["ramen_restaurant", "restaurant"],
    primaryType: "ramen_restaurant",
    location: { latitude: 35.5751, longitude: 139.6631 },
  },
  {
    id: "m2",
    displayName: { text: "スタミナ爆発 牛丼一番" },
    formattedAddress: "東京都千代田区有楽町",
    rating: 4.2,
    userRatingCount: 210,
    types: ["restaurant"],
    primaryType: "restaurant",
    location: { latitude: 35.675, longitude: 139.763 },
  },
  {
    id: "m3",
    displayName: { text: "ご飯おかわり無限！定食さくら" },
    formattedAddress: "東京都新宿区歌舞伎町",
    rating: 4.3,
    userRatingCount: 350,
    types: ["restaurant"],
    primaryType: "restaurant",
    location: { latitude: 35.6938, longitude: 139.7034 },
  },
];

/**
 * Google APIフェッチ (キャッシュ対応)
 */
const getCachedPlaces = unstable_cache(
  async (
    combinedQuery: string,
    avgLat: number,
    avgLng: number
  ): Promise<GooglePlace[]> => {
    if (IS_MOCK_MODE || !GOOGLE_API_KEY) {
      console.log("Mock Mode or API Key Missing");
      return MOCK_RESTAURANTS;
    }

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
        maxResultCount: 30,
        minRating: 3.0,
        locationBias: {
          circle: {
            center: { latitude: avgLat, longitude: avgLng },
            radius: 2000.0,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google API responded with ${response.status}`);
    }

    const data = await response.json();
    return data.places || [];
  },
  ["restaurants-search-persistent"],
  { revalidate: 86400, tags: ["restaurants"] }
);

/**
 * GET Handler
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stationParam = searchParams.get("station") || "";
    const lats =
      searchParams
        .get("lat")
        ?.split(",")
        .map(Number)
        .filter((n) => !isNaN(n)) || [];
    const lngs =
      searchParams
        .get("lng")
        ?.split(",")
        .map(Number)
        .filter((n) => !isNaN(n)) || [];

    // バリデーション
    if (lats.length === 0 || lngs.length === 0) {
      return NextResponse.json(
        { error: "座標パラメータが不足しています" },
        { status: 400 }
      );
    }

    // 中心座標の計算
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

    // クエリ構築
    const stationNames = stationParam.split(",").filter(Boolean);
    const combinedQuery = `${stationNames.join(" ")} ${GATSURI_KEYWORDS.join(
      " "
    )}`;

    // データ取得
    const places = await getCachedPlaces(combinedQuery, avgLat, avgLng);

    // データ成形とソート
    const results: RestaurantDTO[] = places
      .map((place) => {
        const name = place.displayName?.text || "";
        return {
          id: place.id,
          name: name,
          genre: getGenre(name, place.types, place.primaryType || ""),
          address: place.formattedAddress,
          rating: place.rating || 0,
          reviewCount: place.userRatingCount || 0,
          location: place.location,
        };
      })
      .sort((a, b) => b.reviewCount - a.reviewCount);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Route Error:", error);
    return NextResponse.json(
      { error: "データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
