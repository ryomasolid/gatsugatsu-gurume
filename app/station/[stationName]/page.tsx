import { Metadata } from "next";
import { Suspense } from "react";
import StationClient from "./StationClient";

type Props = {
  params: Promise<{ stationName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stationName } = await params;
  const decodedName = decodeURIComponent(stationName);
  return {
    title: `【${decodedName}駅】周辺のがっつりグルメ！ラーメン・定食・デカ盛り検索 | ガツガツグルメ`,
    description: `${decodedName}駅周辺で「がっつり」食べられるお店を最速検索！お腹いっぱい食べたい人におすすめの人気店を口コミ順で紹介します。`,
    keywords: [decodedName, "がっつり", "デカ盛り", "ランチ", "グルメ"],
  };
}

export default async function Page({ params }: Props) {
  const { stationName } = await params;
  const decodedName = decodeURIComponent(stationName);

  // 構造化データ（JSON-LD）の定義
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${decodedName}駅周辺のがっつりグルメ検索結果`,
    description: `${decodedName}駅周辺でボリューム満点のお店リスト`,
    url: `https://gatsugatsu-gurume.com/station/${stationName}`,
  };

  return (
    <>
      {/* 構造化データをヘッドに挿入 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<div>読み込み中...</div>}>
        <StationClient stationName={decodedName} />
      </Suspense>
    </>
  );
}
