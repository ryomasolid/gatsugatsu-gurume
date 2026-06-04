import { getBaseUrl } from "@/utils/getBaseUrl";
import { Metadata } from "next";
import StationClient from "./_components/StationClient";
import { RestaurantInfoDTO } from "./types";

// 24時間ごとに再生成（ISR）
export const revalidate = 86400;

type Props = {
  params: Promise<{ stationName: string }>;
};

async function getStationCoords(
  name: string
): Promise<{ lat: string; lng: string } | null> {
  try {
    const res = await fetch(
      `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(name)}`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    const station = data.response?.station?.[0];
    if (!station) return null;
    return { lat: String(station.y), lng: String(station.x) };
  } catch (e) {
    console.error("駅座標の取得失敗:", e);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stationName } = await params;
  const decodedName = decodeURIComponent(stationName);
  const canonicalPath = `/station/${encodeURIComponent(decodedName)}`;

  return {
    title: `【2026最新】${decodedName}駅のデカ盛り・がっつりランチ聖地巡礼！腹ペコ必見の厳選店`,
    description: `${decodedName}駅周辺で、胃袋がはち切れるほどの「デカ盛り・がっつり飯」を探しているあなたへ。ラーメン、定食、カレーなど、地元で愛される高コスパな聖地を厳選紹介。`,
    keywords: [decodedName, "がっつり", "デカ盛り", "ランチ", "グルメ"],
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `【2026最新】${decodedName}駅のデカ盛り・がっつりランチ聖地巡礼`,
      description: `${decodedName}駅周辺のデカ盛り・がっつり飯を厳選紹介。ラーメン・定食・カレーなど高コスパな名店をピックアップ。`,
      url: `https://gatsugatsu-gurume.com${canonicalPath}`,
      type: "website",
      siteName: "ガツガツグルメ",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: `【2026最新】${decodedName}駅のデカ盛り・がっつりランチ`,
      description: `${decodedName}駅周辺のデカ盛り・がっつり飯を厳選紹介。`,
    },
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
      const apiUrl = `${baseUrl}/api/restaurants?station=${encodeURIComponent(decodedName)}&lat=${coords.lat}&lng=${coords.lng}`;
      const res = await fetch(apiUrl, { next: { revalidate: 86400 } });

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${decodedName}駅周辺のがっつりグルメ検索結果`,
    description: `${decodedName}駅周辺のデカ盛り店リスト`,
    url: `https://gatsugatsu-gurume.com/station/${encodeURIComponent(decodedName)}`,
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
