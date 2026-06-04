import { Metadata } from "next";
import StationClient from "./StationClient";
import { RestaurantInfoDTO } from "./types";
import { getBaseUrl } from "@/utils/getBaseUrl";

type Props = {
  params: Promise<{ stationName: string }>;
  searchParams: Promise<{ lat?: string; lng?: string; prefecture?: string }>;
};

/**
 * サーバー側で駅の座標を取得する
 * 複数の同名駅がある場合、都道府県で絞り込むか、最初の駅を返す
 */
async function getStationCoords(
  name: string,
  prefecture?: string
): Promise<{ lat: string; lng: string; prefecture: string } | null> {
  try {
    const res = await fetch(
      `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(name)}`,
      { next: { revalidate: 86400 } } // 24時間キャッシュ
    );
    const data = await res.json();
    const stations = data.response?.station;

    if (!stations || stations.length === 0) {
      return null;
    }

    // 都道府県が指定されている場合、一致する駅を探す
    if (prefecture) {
      const matchedStation = stations.find(
        (s: any) => s.prefecture === prefecture
      );
      if (matchedStation) {
        return {
          lat: String(matchedStation.y),
          lng: String(matchedStation.x),
          prefecture: matchedStation.prefecture,
        };
      }
    }

    // 都道府県が指定されていない or 一致しない場合は最初の駅を返す
    const station = stations[0];
    return {
      lat: String(station.y),
      lng: String(station.x),
      prefecture: station.prefecture,
    };
  } catch (e) {
    console.error("駅座標の取得失敗:", e);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stationName } = await params;
  const decodedName = decodeURIComponent(stationName);
  return {
    title: `【2026最新】${decodedName}駅のデカ盛り・がっつりランチ聖地巡礼！腹ペコ必見の厳選店`,
    description: `${decodedName}駅周辺で、胃袋がはち切れるほどの「デカ盛り・がっつり飯」を探しているあなたへ。ラーメン、定食、カレーなど、地元で愛される高コスパな聖地を厳選紹介。`,
    keywords: [decodedName, "がっつり", "デカ盛り", "ランチ", "グルメ"],
  };
}

export default async function Page({ params, searchParams }: Props) {
  const { stationName } = await params;
  const { lat, lng, prefecture } = await searchParams;
  const decodedName = decodeURIComponent(stationName);

  // URLパラメータのlat/lngを優先、なければAPIから取得
  let coords: { lat: string; lng: string } | null = null;

  if (lat && lng) {
    // URLパラメータから座標を取得（Sidebarから遷移した場合）
    coords = { lat, lng };
  } else {
    // URLパラメータがない場合はAPIから取得
    const stationData = await getStationCoords(decodedName, prefecture);
    if (stationData) {
      coords = { lat: stationData.lat, lng: stationData.lng };
    }
  }

  const baseUrl = getBaseUrl();

  let initialRestaurants: RestaurantInfoDTO[] = [];
  if (coords) {
    try {
      const apiUrl = `${baseUrl}/api/restaurants?station=${encodeURIComponent(stationName)}&lat=${coords.lat}&lng=${coords.lng}`;
      const res = await fetch(apiUrl);

      if (res.ok) {
        const data = await res.json();

        initialRestaurants = (data.results || []).map((r: any) => ({
          ...r,
          description: r.description || "",
          station: r.station || decodedName,
          walkMinutes: r.walkMinutes || 5,
        }));
      }
    } catch (e) {
      console.error("初期データのフェッチ失敗:", e);
    }
  }

  // 構造化データの作成
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${decodedName}駅周辺のがっつりグルメ検索結果`,
    description: `${decodedName}駅周辺のデカ盛り店リスト`,
    url: `https://gatsugatsu-gurume.com/station/${stationName}`,
    itemListElement: initialRestaurants.map((r, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Restaurant",
        name: r.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: r.address,
          addressCountry: "JP",
        },
        servesCuisine: r.genre,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StationClient
        stationName={decodedName}
        initialRestaurants={initialRestaurants}
        initialCoords={coords}
      />
    </>
  );
}
