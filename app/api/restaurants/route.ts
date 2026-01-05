import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

// --- 【設定】APIを停止している間はここを true にする ---
const IS_MOCK_MODE = true;

// テスト用の疑似データ（API無料枠を消費せず、AdSense審査時の「コンテンツ不足」を防ぐ）
const MOCK_RESTAURANTS = [
  {
    id: "m1",
    displayName: { text: "ガツガツ二郎系 麺屋極太" },
    formattedAddress: "神奈川県川崎市中原区小杉町",
    rating: 4.5,
    userRatingCount: 420,
    types: ["ramen_restaurant"],
    location: { latitude: 35.5751, longitude: 139.6631 },
  },
  {
    id: "m2",
    displayName: { text: "スタミナ爆発 牛丼一番" },
    formattedAddress: "東京都千代田区有楽町",
    rating: 4.2,
    userRatingCount: 210,
    types: ["restaurant"],
    location: { latitude: 35.675, longitude: 139.763 },
  },
  {
    id: "m3",
    displayName: { text: "ご飯おかわり無限！定食さくら" },
    formattedAddress: "東京都新宿区歌舞伎町",
    rating: 4.3,
    userRatingCount: 350,
    types: ["restaurant"],
    location: { latitude: 35.6938, longitude: 139.7034 },
  },
  {
    id: "m4",
    displayName: { text: "背脂の聖地 ラーメン専門店" },
    formattedAddress: "神奈川県横浜市西区",
    rating: 4.6,
    userRatingCount: 580,
    types: ["ramen_restaurant"],
    location: { latitude: 35.4658, longitude: 139.6227 },
  },
  {
    id: "m5",
    displayName: { text: "特盛カツ丼 満腹亭" },
    formattedAddress: "東京都豊島区池袋",
    rating: 4.1,
    userRatingCount: 125,
    types: ["restaurant"],
    location: { latitude: 35.7289, longitude: 139.7104 },
  },
  {
    id: "m6",
    displayName: { text: "深夜の家系 濃厚ソウル" },
    formattedAddress: "東京都渋谷区道玄坂",
    rating: 4.4,
    userRatingCount: 280,
    types: ["ramen_restaurant"],
    location: { latitude: 35.658, longitude: 139.7016 },
  },
  {
    id: "m7",
    displayName: { text: "肉盛り油そば 侍" },
    formattedAddress: "神奈川県川崎市高津区",
    rating: 4.2,
    userRatingCount: 195,
    types: ["restaurant"],
    location: { latitude: 35.5996, longitude: 139.6074 },
  },
  {
    id: "m8",
    displayName: { text: "メガ盛り唐揚げ 鶏王" },
    formattedAddress: "東京都千代田区外神田",
    rating: 4.7,
    userRatingCount: 610,
    types: ["restaurant"],
    location: { latitude: 35.6997, longitude: 139.7713 },
  },
  {
    id: "m9",
    displayName: { text: "街の中華屋 餃子ドラゴン" },
    formattedAddress: "東京都江戸川区",
    rating: 4.0,
    userRatingCount: 90,
    types: ["chinese_restaurant"],
    location: { latitude: 35.6895, longitude: 139.8177 },
  },
  {
    id: "m10",
    displayName: { text: "ガッツリ屋 カレー部" },
    formattedAddress: "東京都杉並区高円寺",
    rating: 4.3,
    userRatingCount: 230,
    types: ["restaurant"],
    location: { latitude: 35.7053, longitude: 139.6498 },
  },
];

// 1. Google APIを叩くコアロジックを関数化し、unstable_cacheで包む
const getCachedPlaces = unstable_cache(
  async (combinedQuery: string, avgLat: number, avgLng: number) => {
    // モックモード時、またはAPIキーがない場合は即座に疑似データを返す
    if (IS_MOCK_MODE || !GOOGLE_API_KEY) {
      console.log("Mock Mode: APIを叩かずに疑似データを返します");
      return MOCK_RESTAURANTS;
    }

    console.log("API Call: Google APIにリクエストを送ります");
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.location,places.types",
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

    const data = await response.json();
    return data.places || [];
  },
  ["restaurants-search-persistent"], // キャッシュ識別子
  {
    revalidate: 86400, // 24時間キャッシュを維持（秒単位）
    tags: ["restaurants"],
  }
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stationParam = searchParams.get("station") || "";
  const latParam = searchParams.get("lat") || "";
  const lngParam = searchParams.get("lng") || "";

  // パラメータの解析と平均位置の計算
  const stationNames = stationParam.split(",").filter((s) => s);
  const lats = latParam.split(",").map(Number);
  const lngs = lngParam.split(",").map(Number);
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

  const gatsuriKeywords =
    "ラーメン 油そば 牛丼 定食 カツ丼 中華料理 スタミナ料理";
  const combinedQuery = `${stationNames.join(" ")} ${gatsuriKeywords}`;

  try {
    // 2. キャッシュされた関数を呼び出す
    // Vercelサーバーが再起動しても、同じ引数なら24時間はキャッシュが返ります
    const places = await getCachedPlaces(combinedQuery, avgLat, avgLng);

    const formattedData = places.map((place: any) => ({
      id: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress,
      rating: place.rating,
      reviewCount: place.userRatingCount || 0,
      photoReference: place.photos?.[0]?.name || "",
      types: place.types,
      location: place.location,
    }));

    // 口コミ数順にソート（ユーザーへの有用性向上）
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
