import { formatPlaceResult } from "@/app/api/restaurants/helpers";
import { isStationIndexable } from "@/constants/reviewMode";
import { getStationGuide } from "@/constants/stationGuides";
import {
  getSnapshotGeneratedAt,
  getStationSnapshot,
} from "@/constants/stationSnapshots";
import { calculateDistance, calculateWalkMinutes } from "@/utils/geo";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { isMaintenanceMode } from "@/utils/maintenance";
import { getNeighborStations, getRepresentativeStation } from "@/utils/stationData";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import StationClient from "./_components/StationClient";
import { RestaurantInfoDTO } from "./types";

// 店舗データの鮮度とPlaces APIコストのバランスから7日キャッシュとする
export const revalidate = 604800;

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
  prefecture: string;
};

/**
 * ローカルの全国駅データから駅情報を解決する。
 * 同名駅が複数ある場合は乗り入れ路線数が最も多い駅を代表とする。
 */
function getStationInfo(name: string): StationInfo | null {
  const rep = getRepresentativeStation(name);
  if (!rep) return null;
  return {
    coords: { lat: String(rep.entry.y), lng: String(rep.entry.x) },
    lines: rep.lines,
    prefecture: rep.entry.pref,
  };
}

/**
 * 主要駅（スナップショットあり）はローカルデータから整形し、Places API を叩かない。
 * それ以外（長尾の駅）は従来通りライブの /api/restaurants にフォールバックする。
 */
async function getRawResults(
  decodedName: string,
  coords: { lat: string; lng: string }
): Promise<RawRestaurantResult[]> {
  const snapshot = getStationSnapshot(decodedName);
  if (snapshot) {
    // スナップショットを持つ駅は API を使わないためメンテナンス中も表示できる。
    // ジャンルはライブ経路と同じ formatPlaceResult で実行時に導出する
    return snapshot.map(formatPlaceResult);
  }

  // メンテナンスモード中はライブ API を叩かず空で返す（UI 側でメンテナンス文言を表示）
  if (isMaintenanceMode()) {
    return [];
  }

  const baseUrl = getBaseUrl();
  const apiUrl = `${baseUrl}/api/restaurants?station=${encodeURIComponent(decodedName)}&lat=${coords.lat}&lng=${coords.lng}`;
  const res = await fetch(apiUrl, { next: { revalidate: 604800 } });

  // 取得失敗（API障害など）は「店舗0件」と区別して5xxにする。
  // 200+noindexを返すと、一時障害のタイミングでクロールされたページが
  // 検索インデックスから除外されてしまうため。
  if (!res.ok) {
    throw new Error(`レストランデータの取得に失敗しました (HTTP ${res.status})`);
  }

  const data = (await res.json()) as { results?: RawRestaurantResult[] };
  return data.results ?? [];
}

// generateMetadata と Page の両方から呼ばれるため、React.cache で同一レンダリング内の重複実行を防ぐ
const getStationRestaurants = cache(async function getStationRestaurants(
  decodedName: string,
  coords: { lat: string; lng: string }
): Promise<RestaurantInfoDTO[]> {
  const rawResults = await getRawResults(decodedName, coords);
  const stationLat = parseFloat(coords.lat);
  const stationLng = parseFloat(coords.lng);

  return rawResults
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
});

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

  const info = getStationInfo(decodedName);
  if (!info) {
    return { robots: { index: false, follow: false } };
  }

  const restaurants = await getStationRestaurants(decodedName, info.coords);
  const count = restaurants.length;
  const topGenres = getTopGenres(restaurants);

  // 独自の編集部ガイドを持つ駅のみインデックス対象とする（審査モード中はさらに主要駅に限定）。
  // ガイドのない駅はテンプレート＋Places APIの自動生成内容で独自性が低いため、
  // noindex にして「ガイド付き駅＋ツール」だけの質の高いサイトとして審査・評価されるようにする。
  // （follow は残し、駅ページ経由のクロール・回遊は維持する）
  const isIndexable = count > 0 && isStationIndexable(decodedName);

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
    // 独自ガイドを持たない駅・店舗0件の駅は内容が薄いため、インデックス対象から除外する
    ...(!isIndexable && { robots: { index: false, follow: true } }),
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

  const info = getStationInfo(decodedName);
  if (!info) notFound();

  const initialRestaurants = await getStationRestaurants(decodedName, info.coords);
  const neighborLines = getNeighborStations(decodedName);

  const pageUrl = `${SITE_URL}/station/${encodeURIComponent(decodedName)}`;
  const guide = getStationGuide(decodedName);
  // スナップショット配信の駅は「情報の時点」を明示する（鮮度の正直さ＝品質シグナル）
  const dataDate = getStationSnapshot(decodedName) ? getSnapshotGeneratedAt() : "";
  // ライブ API 依存の駅は、メンテナンス中は店舗を出せないため文言表示に切り替える
  // （スナップショットを持つ駅は影響を受けない）
  const maintenance = isMaintenanceMode() && !getStationSnapshot(decodedName);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${info.prefecture}の路線一覧`,
        item: `${SITE_URL}/area/${encodeURIComponent(info.prefecture)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
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
        initialCoords={info.coords}
        lines={info.lines}
        guide={guide}
        dataDate={dataDate}
        maintenance={maintenance}
        prefecture={info.prefecture}
        neighborLines={neighborLines}
      />
    </>
  );
}
