import { Metadata } from "next";
import TabehoudaiClient from "./_components/TabehoudaiClient";

export const metadata: Metadata = {
  title: "【元取れ計算機】大手チェーンの食べ放題で損しないためのシミュレーター | がつがつグルメ",
  description:
    "焼肉きんぐ・しゃぶ葉・鳥貴族・すたみな太郎など人気チェーンの食べ放題コースで「元が取れるか」をリアルタイム計算。食べた量を入力するだけで損得を瞬時に判定！",
  keywords: [
    "食べ放題", "元取れ", "シミュレーター", "計算機",
    "焼肉きんぐ", "しゃぶ葉", "鳥貴族", "すたみな太郎",
    "飲み放題", "バイキング",
  ],
  alternates: { canonical: "/tabehoudai" },
  openGraph: {
    title: "【元取れ計算機】食べ放題で損しないシミュレーター | がつがつグルメ",
    description:
      "食べた量を入力するだけで元が取れるか瞬時に判定。焼肉きんぐ・しゃぶ葉など人気4チェーン対応。",
    url: "https://gatsugatsu-gurume.com/tabehoudai",
    type: "website",
    siteName: "ガツガツグルメ",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "【元取れ計算機】食べ放題シミュレーター | がつがつグルメ",
    description: "焼肉きんぐ・しゃぶ葉など人気チェーンの食べ放題で元が取れるか計算！",
  },
};

export default function TabehoudaiPage() {
  return <TabehoudaiClient />;
}
