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

async function getStationCoords(
  name: string
): Promise<{ lat: string; lng: string } | null> {
  try {
    const res = await fetch(
      `https://express.heartrails.com/api/json?method=getStations&name=${encodeURIComponent(name)}`,
      { next: { revalidate: 86400 } }
    );
    const data = (await res.json()) as {
      response?: { station?: { x: string; y: string }[] };
    };
    const station = data.response?.station?.[0];
    if (!station) return null;
    return { lat: String(station.y), lng: String(station.x) };
  } catch (e) {
    console.error("駅座標の取得失敗:", e);
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
    return (data.results ?? []).map((r) => ({
      ...r,
      description: r.description ?? "",
      station: r.station ?? decodedName,
      walkMinutes: r.walkMinutes ?? 5,
    }));
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

  const coords = await getStationCoords(decodedName);
  const restaurants = coords ? await getStationRestaurants(decodedName, coords) : [];
  const count = restaurants.length;
  const topGenres = getTopGenres(restaurants);

  const countLabel = count > 0 ? `${count}選` : "厳選";
  const genreLabel =
    topGenres.length > 0 ? topGenres.join("・") : "ラーメン・定食・カレー";
  const countText = count > 0 ? `${count}店舗` : "多数";

  // 「デカ盛り」を最前面に置き、ランチ・コスパ系クエリもカバー
  const title = `【2026最新】${decodedName}のデカ盛り・がっつりランチ${countLabel} | がつがつグルメ`;
  const description = `${decodedName}周辺のデカ盛り・大盛りランチを${countText}厳選！${genreLabel}など、コスパ最強のがっつり飯をまとめました。${decodedName}駅でお腹いっぱい食べるなら必見です。`;

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

  const coords = await getStationCoords(decodedName);
  const initialRestaurants = coords
    ? await getStationRestaurants(decodedName, coords)
    : [];

  const pageUrl = `${SITE_URL}/station/${encodeURIComponent(decodedName)}`;

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
        initialCoords={coords}
      />
    </>
  );
}
