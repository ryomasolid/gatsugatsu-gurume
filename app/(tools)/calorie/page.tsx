import { Metadata } from "next";
import CalorieClient from "./_components/CalorieClient";

export const metadata: Metadata = {
  title: "外食カロリー＆PFCバランス計算シミュレーター｜がっつりグルメ",
  description:
    "マクドナルド・吉野家・サイゼリヤ・丸亀製麺など主要外食チェーンのメニューを選んで合計カロリーとPFCバランスをリアルタイム計算。1日の目安摂取量との比較グラフで食事管理に役立てよう。",
  alternates: { canonical: "/calorie" },
  openGraph: {
    title: "外食カロリー＆PFCバランス計算シミュレーター｜ガツガツグルメ",
    description:
      "食べたいメニューを選んで追加するだけ。合計カロリーとPFC比率をリアルタイムで確認できる外食専用計算ツール。",
    url: "https://gatsugatsu-gurume.com/calorie",
    type: "website",
  },
};

export default function CaloriePage() {
  return <CalorieClient />;
}
