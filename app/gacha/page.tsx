import { Metadata } from "next";
import GachaClient from "./_components/GachaClient";

export const metadata: Metadata = {
  title: "今日のご飯決定ガチャ｜迷ったらコレ！運命の一食を引き当てろ",
  description:
    "予算・気分を選んでガチャを回すだけで今日のランチ・夕飯が決まる！がっつり飯・あっさり・辛い・肉厚など全22種から運命の一食を引き当てて、近くの駅のお店まで一直線。",
  alternates: { canonical: "/gacha" },
  openGraph: {
    title: "今日のご飯決定ガチャ｜ガツガツグルメ",
    description: "迷ったらガチャに任せろ。予算・気分でフィルターして運命の一食を引き当てろ！",
    url: "https://gatsugatsu-gurume.com/gacha",
    type: "website",
  },
};

export default function GachaPage() {
  return <GachaClient />;
}
