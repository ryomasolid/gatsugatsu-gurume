import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

// --- 【設定】APIを停止している間はここを true にする ---
const IS_MOCK_MODE = false;

/**
 * ジャンル判定ロジック
 * Googleの施設タイプ(types/primaryType)と店名キーワードを組み合わせて
 * 指定された9つのカテゴリのいずれかに分類します。
 */
function getGenre(name: string, types: string[], primaryType: string): string {
  const n = name || "";
  const allTypes = [...(types || []), primaryType].filter(Boolean);

  // 1. 特徴的なキーワードで判定（最優先）
  if (n.includes("油そば") || n.includes("まぜそば")) return "油そば";
  if (n.includes("スープカレー")) return "スープカレー";
  if (n.includes("カツ丼") || n.includes("かつ丼")) return "カツ丼";
  if (
    n.includes("牛丼") ||
    n.includes("吉野家") ||
    n.includes("すき家") ||
    n.includes("松屋")
  )
    return "牛丼";

  // 2. Googleの施設タイプ(英語ID)と日本語キーワードの組み合わせ
  // ラーメン
  if (
    allTypes.includes("ramen_restaurant") ||
    n.includes("ラーメン") ||
    n.includes("麺屋")
  )
    return "ラーメン";

  // 中華料理
  if (allTypes.includes("chinese_restaurant") || n.includes("中華"))
    return "中華料理";

  // カレー
  if (n.includes("カレー") || n.includes("curry")) return "カレー";

  // 定食
  if (
    n.includes("定食") ||
    n.includes("食堂") ||
    n.includes("御膳") ||
    n.includes("めし")
  )
    return "定食";

  // 3. スタミナ料理（がっつり系のキーワードで判定）
  const staminaKeywords = [
    "スタミナ",
    "がっつり",
    "すた丼",
    "背脂",
    "二郎",
    "特盛",
    "爆盛",
  ];
  if (staminaKeywords.some((keyword) => n.includes(keyword)))
    return "スタミナ料理";

  return "その他";
}

// テスト用の疑似データ
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

// Google APIフェッチ (キャッシュ対応)
const getCachedPlaces = unstable_cache(
  async (combinedQuery: string, avgLat: number, avgLng: number) => {
    if (IS_MOCK_MODE || !GOOGLE_API_KEY) {
      console.log("Mock Mode: 疑似データを返します");
      return MOCK_RESTAURANTS;
    }

    console.log("API Call: Google APIにリクエストを送ります");
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

    const data = await response.json();
    return data.places || [];
  },
  ["restaurants-search-persistent"],
  {
    revalidate: 86400, // 24時間
    tags: ["restaurants"],
  }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stationParam = searchParams.get("station") || "";
  const latParam = searchParams.get("lat") || "";
  const lngParam = searchParams.get("lng") || "";

  // パラメータ解析
  const stationNames = stationParam.split(",").filter((s) => s);
  const lats = latParam.split(",").map(Number);
  const lngs = lngParam.split(",").map(Number);

  if (lats.length === 0 || lngs.length === 0) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

  const gatsuriKeywords =
    "ラーメン 油そば 牛丼 定食 カツ丼 中華料理 スタミナ料理 カレー スープカレー";
  const combinedQuery = `${stationNames.join(" ")} ${gatsuriKeywords}`;

  try {
    const places = await getCachedPlaces(combinedQuery, avgLat, avgLng);

    // 取得したデータを成形
    const formattedData = places.map((place: any) => {
      const name = place.displayName?.text || "";
      const types = place.types || [];
      const primaryType = place.primaryType || "";

      return {
        id: place.id,
        name: name,
        genre: getGenre(name, types, primaryType),
        address: place.formattedAddress,
        rating: place.rating,
        reviewCount: place.userRatingCount || 0,
        location: place.location,
      };
    });

    // クチコミ数順にソート
    formattedData.sort((a: any, b: any) => b.reviewCount - a.reviewCount);

    return NextResponse.json({ results: formattedData });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
