import { Metadata } from "next";
import WarikanClient from "./_components/WarikanClient";

export const metadata: Metadata = {
  title: "割り勘＆傾斜計算ツール｜食事会・飲み会の幹事さん向け｜がつがつグルメ",
  description:
    "幹事さん必携。グループごとに支払い金額に傾斜をかけて一発計算。計算結果はLINEやSNSにそのままコピペできるテキストで出力。100円単位の端数処理も自動対応。",
  alternates: { canonical: "/warikan" },
  openGraph: {
    title: "割り勘＆傾斜計算ツール｜ガツガツグルメ",
    description:
      "上司は多め・遅刻者は少なめ。グループ別の傾斜割り勘をサクッと計算してLINEに共有できる幹事向けツール。",
    url: "https://gatsugatsu-gurume.com/warikan",
    type: "website",
  },
};

export default function WarikanPage() {
  return <WarikanClient />;
}
