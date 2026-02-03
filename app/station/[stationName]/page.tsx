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
    title: `【2026最新】${decodedName}駅のデカ盛り・がっつりランチ聖地巡礼！腹ペコ必見の厳選店`,
    description: `${decodedName}駅周辺で、胃袋がはち切れるほどの「デカ盛り・がっつり飯」を探しているあなたへ。ラーメン、定食、カレーなど、地元で愛される高コスパな聖地を、実際の口コミをもとに厳選してご紹介。今日のランチはここで決まり！`,
    keywords: [decodedName, "がっつり", "デカ盛り", "ランチ", "グルメ"],
  };
}

export default async function Page({ params }: Props) {
  const { stationName } = await params;
  const decodedName = decodeURIComponent(stationName);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${decodedName}駅周辺のがっつりグルメ検索結果`,
    description: `${decodedName}駅周辺で「今日はお腹いっぱい食べたい」方必見！1kg超えのデカ盛り店から、コスパ最強のがっつりランチまで地元で人気の聖地を厳選。ラーメン・定食・カレーなど、腹ペコも唸る名店を最速検索。今日のガッツリ飯はここで決まり！`,
    url: `https://gatsugatsu-gurume.com/station/${stationName}`,
  };

  return (
    <>
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
