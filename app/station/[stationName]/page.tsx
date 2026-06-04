import { Metadata } from "next";
import StationClient, { RestaurantInfoDTO } from "./StationClient";
import { getBaseUrl } from "@/utils/getBaseUrl";

type Props = {
  params: Promise<{ stationName: string }>;
};

/**
 * サーバー側で駅の座標を取得する
 */
async function getStationCoords(name: string) {
  try {
    const res = await fetch(
      `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(name)}`
    );
    const data = await res.json();
    const station = data.response?.station?.[0];
    return station ? { lat: String(station.y), lng: String(station.x) } : null;
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

export default async function Page({ params }: Props) {
  const { stationName } = await params;
  const decodedName = decodeURIComponent(stationName);

  const coords = await getStationCoords(decodedName);
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
          description: r.description || `★${r.rating || 0} (${r.reviewCount || 0}件) ${r.address || ""}`,
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
    "name": `${decodedName}駅周辺のがっつりグルメ検索結果`,
    "description": `${decodedName}駅周辺のデカ盛り店リスト`,
    "url": `https://gatsugatsu-gurume.com/stations/${stationName}`,
    "itemListElement": initialRestaurants.map((r, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Restaurant",
        "name": r.name,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": r.address,
          "addressCountry": "JP"
        },
        "servesCuisine": r.genre
      }
    }))
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