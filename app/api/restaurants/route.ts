import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // カンマ区切りで複数の駅名が来る可能性がある ("横浜,川崎")
  const stationParam = searchParams.get("station") || "";
  const userKeyword = searchParams.get("keyword") || "";

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
  }

  // 駅名のリストを作成
  const stationNames = stationParam.split(",").filter((s) => s);
  const gatsuriKeywords = "ラーメン 牛丼 定食 カツ丼 中華料理 スタミナ料理";

  try {
    // 選択された各駅に対してAPIリクエストを作成（並列処理）
    const requests = stationNames.map((stationName) => {
      const textQuery = `${stationName} ${gatsuriKeywords} ${userKeyword}`;

      return fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.regularOpeningHours,places.priceLevel,places.types,places.location",
        },
        body: JSON.stringify({
          textQuery: textQuery,
          languageCode: "ja",
          maxResultCount: 10, // 複数駅検索時は件数が増えるので1駅あたりは少なめに調整
          minRating: 3.0,
        }),
      }).then((res) => res.json());
    });

    // 全てのリクエストを並列実行
    const results = await Promise.all(requests);

    // 結果を一つの配列に結合
    let allPlaces: any[] = [];
    results.forEach((data) => {
      if (data.places) {
        allPlaces = [...allPlaces, ...data.places];
      }
    });

    // 重複排除 (同じ店が複数の駅の検索結果に含まれる場合があるため)
    const uniquePlaces = Array.from(
      new Map(allPlaces.map((place) => [place.id, place])).values()
    );

    const formattedData = uniquePlaces.map((place: any) => ({
      id: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress,
      rating: place.rating,
      reviewCount: place.userRatingCount,
      photoReference: place.photos?.[0]?.name,
      isOpenNow: place.regularOpeningHours?.openNow,
      types: place.types,
      location: place.location,
    }));

    return NextResponse.json({ results: formattedData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
