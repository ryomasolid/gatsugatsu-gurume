import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stationParam = searchParams.get("station") || "";
  const latParam = searchParams.get("lat") || "";
  const lngParam = searchParams.get("lng") || "";

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: "API Key is missing" }, { status: 500 });
  }

  const stationNames = stationParam.split(",").filter((s) => s);
  const lats = latParam.split(",");
  const lngs = lngParam.split(",");

  const gatsuriKeywords =
    "ラーメン 油そば 牛丼 定食 カツ丼 中華料理 スタミナ料理";

  try {
    const requests = stationNames.map((stationName, index) => {
      const textQuery = `${stationName} ${gatsuriKeywords}`;

      const lat = parseFloat(lats[index]);
      const lng = parseFloat(lngs[index]);

      // リクエストボディ
      const requestBody: any = {
        textQuery: textQuery,
        languageCode: "ja",
        maxResultCount: 20,
        minRating: 3.0,
      };

      // 緯度経度がある場合、半径1000m以内を優先検索 (locationBias)
      if (!isNaN(lat) && !isNaN(lng)) {
        requestBody.locationBias = {
          circle: {
            center: {
              latitude: lat,
              longitude: lng,
            },
            radius: 1000.0,
          },
        };
      }

      return fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.photos,places.regularOpeningHours,places.priceLevel,places.types,places.location",
        },
        body: JSON.stringify(requestBody),
      }).then((res) => res.json());
    });

    const results = await Promise.all(requests);

    let allPlaces: any[] = [];
    results.forEach((data) => {
      if (data.places) {
        allPlaces = [...allPlaces, ...data.places];
      }
    });

    const uniquePlaces = Array.from(
      new Map(allPlaces.map((place) => [place.id, place])).values()
    );

    const formattedData = uniquePlaces.map((place: any) => ({
      id: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress,
      rating: place.rating,
      reviewCount: place.userRatingCount || 0,
      photoReference: place.photos?.[0]?.name,
      isOpenNow: place.regularOpeningHours?.openNow,
      types: place.types,
      location: place.location,
    }));

    // 口コミ数順にソート
    formattedData.sort((a, b) => b.reviewCount - a.reviewCount);

    return NextResponse.json({ results: formattedData });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
