import {
  ArticleSection,
  ArticleText,
  FaqList,
  NoteBox,
  StepList,
  ToolArticle,
} from "@/components/ToolArticle";
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
  return (
    <>
      <GachaClient />
      <ToolArticle>
        <ArticleSection title="「今日何食べよう」が決まらない理由">
          <ArticleText>
            ランチタイムの限られた時間で「何を食べるか」を決められず、結局いつもの店に流れてしまう——これは意思決定の回数が多い現代人によくある「決断疲れ」の典型例です。
            選択肢が多いほど決断のコストは上がり、空腹時は判断力も低下します。そこで有効なのが「選択肢をランダムに絞ってもらう」という発想。
            ご飯ガチャは、予算と気分だけ指定すれば、あとは運に任せて今日の一食を決めてくれるツールです。
          </ArticleText>
        </ArticleSection>

        <ArticleSection title="使い方（3ステップ）">
          <StepList
            steps={[
              {
                title: "予算と気分でフィルターする",
                body: "「安く済ませたい」「がっつりいきたい」「辛いものの気分」など、今日の条件を選びます。条件なしの完全ランダムも可能です。",
              },
              {
                title: "ガチャを回す",
                body: "スロット演出のあと、全22ジャンルの中から今日の一食が決定します。納得いかなければ何度でも回せます。",
              },
              {
                title: "近くのお店を探す",
                body: "結果のジャンルが決まったら、駅検索から最寄り駅周辺のがっつり店を徒歩分数つきで探せます。「決める→探す→食べる」までこのサイトで完結します。",
              },
            ]}
          />
        </ArticleSection>

        <ArticleSection title="よくある質問">
          <FaqList
            faqs={[
              {
                q: "ガチャの結果はどうやって決まっていますか？",
                a: "選んだ予算・気分の条件に合致するメニュー候補の中から、等確率のランダム抽選で1つを選んでいます。特定のジャンルが出やすくなる重み付けはありません。",
              },
              {
                q: "出てきたメニューのお店が近くにない場合は？",
                a: "もう一度回すか、駅検索でお近くの駅のがっつり店一覧から似たジャンルを探してみてください。主要駅であればラーメン・丼・定食などの定番ジャンルはほぼカバーされています。",
              },
              {
                q: "何度も回すのはアリですか？",
                a: "もちろんアリです。ただし「3回回して全部ピンとこなかったら、最初に出たものにする」のように自分ルールを決めておくと、決断疲れに戻らずに済みます。",
              },
            ]}
          />
        </ArticleSection>

        <NoteBox>
          ※ガチャの結果はあくまで提案です。アレルギーや体調に応じて、無理のない食事選びをしてください。
        </NoteBox>
      </ToolArticle>
    </>
  );
}
