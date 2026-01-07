// app/station/[stationName]/page.tsx

import { Metadata } from "next";
import { Suspense } from "react"; // 追加
import StationClient from "./StationClient";

type Props = {
  params: Promise<{ stationName: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stationName } = await params; // ここで必ず await する
  const decodedName = decodeURIComponent(stationName);
  return {
    title: `【${decodedName}駅】周辺のがっつりグルメ！ | ガツガツグルメ`,
  };
}

export default async function Page({ params }: Props) {
  const { stationName } = await params; // ここでも必ず await する
  const decodedName = decodeURIComponent(stationName);

  return (
    // 2つ目の「Hydration failed」対策：useSearchParamsを使うコンポーネントはSuspenseで囲むのがルールです
    <Suspense fallback={<div>読み込み中...</div>}>
      <StationClient stationName={decodedName} />
    </Suspense>
  );
}
