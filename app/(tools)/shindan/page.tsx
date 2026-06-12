import {
  ArticleSection,
  ArticleText,
  FaqList,
  NoteBox,
  StepList,
  ToolArticle,
} from "@/components/ToolArticle";
import { Metadata } from "next";
import ShindanClient from "./_components/ShindanClient";

export const metadata: Metadata = {
  title: "飯タイプ診断｜8つの質問でわかる、あなたの食の本性【全8タイプ】",
  description:
    "8つの質問に直感で答えるだけで、あなたの「飯タイプ」を判定する無料診断。限界デカ盛りストロンガー・コスパ番長・無限麺ループ族など全8タイプ。結果はXでシェアして友達と相性チェック！登録不要・2分で完了。",
  alternates: { canonical: "/shindan" },
  openGraph: {
    title: "飯タイプ診断｜あなたの食の本性は？【全8タイプ】",
    description:
      "8つの質問でわかる、あなたの飯タイプ。デカ盛り族？コスパ番長？麺ループ族？診断結果をシェアして友達と相性チェック！",
    url: "https://gatsugatsu-gurume.com/shindan",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "飯タイプ診断｜あなたの食の本性は？【全8タイプ】",
    description: "8つの質問でわかる、あなたの飯タイプ。結果をシェアして友達と相性チェック！",
  },
};

export default function ShindanPage() {
  return (
    <>
      <ShindanClient />
      <ToolArticle>
        <ArticleSection title="飯タイプ診断とは">
          <ArticleText>
            「飯タイプ診断」は、食にまつわる8つの質問に直感で答えるだけで、あなたの外食スタイルの傾向＝「飯タイプ」を判定する無料コンテンツです。
            量を求めるのか、コスパを極めるのか、トレンドを追うのか——人によって「うまい飯」の定義はまったく違います。
            自分のタイプを知っておくと、店選びの軸がはっきりして「なんか違った」という外食の失敗が減ります。
            友達や同僚と結果を見せ合えば、ランチメンバーの相性チェックにも使えます。
          </ArticleText>
        </ArticleSection>

        <ArticleSection title="全8タイプ一覧">
          <ArticleText>
            診断結果は次の8タイプのいずれかになります。
            🍚 限界デカ盛りストロンガー（量こそ正義）、💴 コスパ番長（安くてうまいが正義）、
            🍜 無限麺ループ族（週5で麺）、🥩 肉食ハンター（迷ったら肉）、
            🌶️ 激辛チャレンジャー（辛さの向こう側へ）、🍱 丁寧定食マイスター（一汁三菜の様式美）、
            📱 トレンドフードハッカー（話題の店に最速到達）、🥗 鋼の健康バランサー（食べるために整える）。
            それぞれのタイプには相性のいいタイプ・おすすめツール・おすすめ駅もあわせて表示されます。
          </ArticleText>
        </ArticleSection>

        <ArticleSection title="使い方（3ステップ）">
          <StepList
            steps={[
              {
                title: "診断スタートを押す",
                body: "登録・ログインは一切不要。ボタンを押すとすぐに1問目が表示されます。所要時間は約2分です。",
              },
              {
                title: "8つの質問に直感で答える",
                body: "深く考えず、最初に「これだ」と思った選択肢を選ぶのがコツ。回答に応じて8タイプそれぞれにスコアが加算されます。",
              },
              {
                title: "結果をシェアして相性チェック",
                body: "判定されたタイプはX（旧Twitter）にワンタップでシェアできます。友達のタイプと見比べて、次のランチや飲み会の店選びに活用してください。",
              },
            ]}
          />
        </ArticleSection>

        <ArticleSection title="よくある質問">
          <FaqList
            faqs={[
              {
                q: "診断結果はどうやって決まりますか？",
                a: "各質問の選択肢に8タイプへの加点が設定されており、8問の合計スコアが最も高いタイプが結果として表示されます。心理テストのような統計的裏付けのあるものではなく、あくまでエンタメコンテンツとしてお楽しみください。",
              },
              {
                q: "何度でも診断できますか？",
                a: "はい、何度でも無料で診断できます。気分やお腹の空き具合で結果が変わることもあるので、ランチ前とディナー前で試してみるのも面白いですよ。",
              },
              {
                q: "診断結果は保存されますか？",
                a: "回答や結果がサーバーに送信・保存されることはありません。ブラウザを閉じると結果は消えるので、残したい場合はシェアやスクリーンショットをご利用ください。",
              },
            ]}
          />
        </ArticleSection>

        <NoteBox>
          ※本診断はエンタメコンテンツです。診断結果に関わらず、アレルギーや体調に応じて無理のない食事選びをしてください。
        </NoteBox>
      </ToolArticle>
    </>
  );
}
