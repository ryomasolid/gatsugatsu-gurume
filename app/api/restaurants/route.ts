import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

// 簡易的なキャッシュ（メモリ保存）
// 実際の運用では Redis やデータベースを使うのが理想ですが、まずはこれでリクエストを激減させます。
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24時間有効

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stationParam = searchParams.get("station") || "";
  const latParam = searchParams.get("lat") || "";
  const lngParam = searchParams.get("lng") || "";

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
  }

  // キャッシュキーの作成（駅名の組み合わせ）
  const cacheKey = `${stationParam}_${latParam}_${lngParam}`;
  const cachedResponse = cache.get(cacheKey);

  if (
    cachedResponse &&
    Date.now() - cachedResponse.timestamp < CACHE_DURATION
  ) {
    console.log("Cache Hit: Google APIを叩かずに結果を返します");
    return NextResponse.json(cachedResponse.data);
  }

  const stationNames = stationParam.split(",").filter((s) => s);
  const lats = latParam.split(",").map(Number);
  const lngs = lngParam.split(",").map(Number);

  // 1. 全ての駅名を1つのクエリに統合（リクエスト回数を1回に絞る）
  const gatsuriKeywords =
    "ラーメン 油そば 牛丼 定食 カツ丼 中華料理 スタミナ料理";
  const combinedQuery = `${stationNames.join(" ")} ${gatsuriKeywords}`;

  // 2. 中間地点を計算して locationBias に設定
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;

  try {
    const requestBody: any = {
      textQuery: combinedQuery,
      languageCode: "ja",
      maxResultCount: 20,
      minRating: 3.0,
    };

    if (!isNaN(avgLat) && !isNaN(avgLng)) {
      requestBody.locationBias = {
        circle: {
          center: { latitude: avgLat, longitude: avgLng },
          radius: 2000.0, // 少し広めに設定
        },
      };
    }

    console.log("API Call: Google APIにリクエストを送ります");
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        // 必要最低限のフィールドに絞る（特に photos は料金が高いので注意が必要ですが一旦維持）
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.location,places.types",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!data.places) {
      return NextResponse.json({ results: [] });
    }

    const formattedData = data.places.map((place: any) => ({
      id: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress,
      rating: place.rating,
      reviewCount: place.userRatingCount || 0,
      photoReference: place.photos?.[0]?.name,
      types: place.types,
      location: place.location,
    }));

    // 口コミ数順にソート
    formattedData.sort((a: any, b: any) => b.reviewCount - a.reviewCount);

    const finalResult = { results: formattedData };

    // 結果をキャッシュに保存
    cache.set(cacheKey, { data: finalResult, timestamp: Date.now() });

    return NextResponse.json(finalResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
