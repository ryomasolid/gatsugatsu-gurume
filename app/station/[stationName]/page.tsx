import { getStationGuide } from "@/constants/stationGuides";
import { calculateDistance, calculateWalkMinutes } from "@/utils/geo";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { Metadata } from "next";
import StationClient from "./_components/StationClient";
import { RestaurantInfoDTO } from "./types";

export const revalidate = 86400;

const SITE_URL = "https://gatsugatsu-gurume.com";

type Props = {
  params: Promise<{ stationName: string }>;
};

type RawRestaurantResult = Omit<RestaurantInfoDTO, "description" | "station" | "walkMinutes"> & {
  description?: string;
  station?: string;
  walkMinutes?: number;
};

type StationInfo = {
  coords: { lat: string; lng: string };
  lines: string[];
};

async function getStationInfo(name: string): Promise<StationInfo | null> {
  try {
    const res = await fetch(
      `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(name)}`,
      { next: { revalidate: 86400 } }
    );
    const data = (await res.json()) as {
      response?: { station?: { x: string; y: string; line: string }[] };
    };
    const stations = data.response?.station;
    if (!stations || stations.length === 0) return null;

    const first = stations[0];
    const lat = parseFloat(first.y);
    const lng = parseFloat(first.x);

    // 同名駅が他県にある場合に備え、最初の駅から約1km以内の駅のみ路線集計の対象とする
    const nearby = stations.filter(
      (st) =>
        Math.abs(parseFloat(st.y) - lat) < 0.01 &&
        Math.abs(parseFloat(st.x) - lng) < 0.01
    );
    const lines = Array.from(new Set(nearby.map((st) => st.line)));

    return { coords: { lat: String(first.y), lng: String(first.x) }, lines };
  } catch (e) {
    console.error("駅情報の取得失敗:", e);
    return null;
  }
}

async function getStationRestaurants(
  decodedName: string,
  coords: { lat: string; lng: string }
): Promise<RestaurantInfoDTO[]> {
  const baseUrl = getBaseUrl();
  try {
    const apiUrl = `${baseUrl}/api/restaurants?station=${encodeURIComponent(decodedName)}&lat=${coords.lat}&lng=${coords.lng}`;
    const res = await fetch(apiUrl, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: RawRestaurantResult[] };
    const stationLat = parseFloat(coords.lat);
    const stationLng = parseFloat(coords.lng);

    return (data.results ?? [])
      .map((r) => {
        const walkMinutes = r.location
          ? calculateWalkMinutes(
              calculateDistance(
                stationLat,
                stationLng,
                r.location.latitude,
                r.location.longitude
              )
            )
          : 0;
        return {
          ...r,
          description: r.description ?? "",
          station: r.station ?? decodedName,
          walkMinutes,
        };
      })
      .sort((a, b) => a.walkMinutes - b.walkMinutes);
  } catch (e) {
    console.error("レストランデータの取得失敗:", e);
    return [];
  }
}

function getTopGenres(restaurants: RestaurantInfoDTO[], limit = 3): string[] {
  const counts: Record<string, number> = {};
  for (const r of restaurants) {
    if (r.genre) counts[r.genre] = (counts[r.genre] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([genre]) => genre);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stationName } = await params;
  const decodedName = decodeURIComponent(stationName);
  const canonicalPath = `/station/${encodeURIComponent(decodedName)}`;

  const info = await getStationInfo(decodedName);
  const restaurants = info ? await getStationRestaurants(decodedName, info.coords) : [];
  const count = restaurants.length;
  const topGenres = getTopGenres(restaurants);

  const countLabel = count > 0 ? `${count}選` : "厳選";
  const genreLabel =
    topGenres.length > 0 ? topGenres.join("・") : "ラーメン・定食・カレー";
  const countText = count > 0 ? `${count}店舗` : "多数";

  // 「デカ盛り」を最前面に置き、ランチ・コスパ系クエリもカバー
  const title = `【2026最新】${decodedName}のデカ盛り・がっつりランチ${countLabel} | がつがつグルメ`;
  const description = `${decodedName}周辺のデカ盛り・大盛りランチを${countText}厳選！${genreLabel}など、駅からの徒歩分数つきでがっつり飯をまとめました。${decodedName}駅でお腹いっぱい食べるなら必見です。`;

  return {
    title,
    description,
    keywords: [
      decodedName,
      "デカ盛り",
      "大盛り",
      "がっつり",
      "ランチ",
      "コスパ",
      "安い",
      "グルメ",
      ...topGenres,
    ],
    alternates: { canonical: canonicalPath },
    // 店舗データが取得できない駅は内容が薄いため、インデックス対象から除外する
    ...(count === 0 && { robots: { index: false, follow: true } }),
    openGraph: {
      title: `【2026最新】${decodedName}のデカ盛り・がっつりランチ${countLabel}`,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      type: "website",
      siteName: "がつがつグルメ",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: `【2026最新】${decodedName}のデカ盛り・がっつりランチ${countLabel}`,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const { stationName } = await params;
  const decodedName = decodeURIComponent(stationName);

  const info = await getStationInfo(decodedName);
  const initialRestaurants = info
    ? await getStationRestaurants(decodedName, info.coords)
    : [];

  const pageUrl = `${SITE_URL}/station/${encodeURIComponent(decodedName)}`;
  const guide = getStationGuide(decodedName);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${decodedName}駅のがっつりグルメ`,
        item: pageUrl,
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${decodedName}駅周辺のがっつりグルメ厳選リスト`,
    description: `${decodedName}駅周辺のデカ盛り・がっつり飯の名店${initialRestaurants.length}選`,
    url: pageUrl,
    numberOfItems: initialRestaurants.length,
    itemListElement: initialRestaurants.map((r, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Restaurant",
        name: r.name,
        servesCuisine: r.genre,
        address: {
          "@type": "PostalAddress",
          streetAddress: r.address,
          addressCountry: "JP",
        },
        ...(r.location && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: r.location.latitude,
            longitude: r.location.longitude,
          },
        }),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <StationClient
        stationName={decodedName}
        initialRestaurants={initialRestaurants}
        initialCoords={info?.coords ?? null}
        lines={info?.lines ?? []}
        guide={guide}
      />
    </>
  );
}
