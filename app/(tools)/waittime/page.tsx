import { Metadata } from "next";
import WaitTimeClient from "./_components/WaitTimeClient";

export const metadata: Metadata = {
  title: "【行列計算機】人気店の待ち時間・回転率 予測シミュレーター | がつがつグルメ",
  description:
    "並んでいる人数・席数・お店のジャンルを入れるだけで待ち時間をリアルタイム予測。今から並ぶと何時に入れる？入店予定時刻まで自動計算。ラーメン・寿司・ファミレスなど業態別の回転率データを使った科学的シミュレーター。",
  keywords: [
    "行列", "待ち時間", "予測", "シミュレーター", "回転率",
    "ラーメン", "牛丼", "回転寿司", "ファミレス", "焼肉",
    "入店時刻", "計算",
  ],
  alternates: { canonical: "/waittime" },
  openGraph: {
    title: "【行列計算機】待ち時間・回転率 予測シミュレーター | がつがつグルメ",
    description:
      "並び人数・席数を入力するだけ。業態別の平均滞在時間をもとに待ち時間と入店予定時刻を自動計算！",
    url: "https://gatsugatsu-gurume.com/waittime",
    type: "website",
    siteName: "ガツガツグルメ",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "【行列計算機】待ち時間予測シミュレーター | がつがつグルメ",
    description: "並び人数と席数で入店時刻をリアルタイム計算！",
  },
};

export default function WaitTimePage() {
  return <WaitTimeClient />;
}
