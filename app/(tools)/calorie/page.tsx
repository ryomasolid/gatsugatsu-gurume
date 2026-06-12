import {
  ArticleSection,
  ArticleText,
  FaqList,
  NoteBox,
  StepList,
  ToolArticle,
} from "@/components/ToolArticle";
import { DAILY_REFERENCE } from "@/constants/calorieData";
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
  return (
    <>
      <CalorieClient />
      <ToolArticle>
        <ArticleSection title="PFCバランスとは？">
          <ArticleText>
            PFCバランスとは、摂取カロリーに占めるタンパク質（Protein）・脂質（Fat）・炭水化物（Carbohydrate）の割合のことです。
            カロリー換算では、タンパク質と炭水化物が1gあたり4kcal、脂質が1gあたり9kcalに相当します。
            同じ800kcalの食事でも、脂質に偏った800kcalと、タンパク質をしっかり含む800kcalでは体への影響が大きく異なります。
          </ArticleText>
          <ArticleText>
            本ツールでは、合計{DAILY_REFERENCE.calories}kcal・タンパク質{DAILY_REFERENCE.protein}g・脂質{DAILY_REFERENCE.fat}g・炭水化物{DAILY_REFERENCE.carbs}gを成人の1日の目安として、選んだメニューの合計値がどの程度に当たるかをグラフで表示します。
            がっつり食べたい日こそ、「今日はどこに振り切るか」を数字で把握しておくと、前後の食事で調整しやすくなります。
          </ArticleText>
        </ArticleSection>

        <ArticleSection title="使い方（3ステップ）">
          <StepList
            steps={[
              {
                title: "チェーン店を選ぶ",
                body: "牛丼・ハンバーガー・ファミレス・うどんなど、主要外食チェーンからお店を選びます。",
              },
              {
                title: "食べる予定のメニューを追加する",
                body: "メイン・サイド・ドリンクを組み合わせて追加すると、合計カロリーとPFCがリアルタイムで集計されます。",
              },
              {
                title: "1日の目安と比較する",
                body: "合計値が1日の目安摂取量の何％に当たるかをバーで確認。1食で100％を超える組み合わせは、他の食事を軽くするなどの調整材料にしてください。",
              },
            ]}
          />
        </ArticleSection>

        <ArticleSection title="がっつり食べたい日のカロリーとの付き合い方">
          <ArticleText>
            デカ盛りや大盛りを楽しむこと自体は悪いことではありません。ポイントは「知らずに超える」のと「知って選ぶ」の違いです。
            たとえば牛丼の特盛は並盛の約1.5倍のカロリーがありますが、タンパク質も増えるため、トレーニング後の食事としては理にかなった選択になり得ます。
          </ArticleText>
          <ArticleText>
            逆に、揚げ物中心の組み合わせは脂質が突出しやすく、カロリーの割に満腹感が持続しにくいことも。
            「ご飯もの＋汁物＋タンパク質系サイド」のような組み合わせにすると、同じ満腹感でもPFCバランスが整いやすくなります。
          </ArticleText>
        </ArticleSection>

        <ArticleSection title="よくある質問">
          <FaqList
            faqs={[
              {
                q: "メニューの栄養成分データはどこから取得していますか？",
                a: "各チェーンが公式に公表している栄養成分情報をもとに編集部が作成しています。メニュー改定により実際の値と異なる場合があるため、正確な数値は各チェーンの公式サイトでご確認ください。",
              },
              {
                q: "1日の目安摂取量はどう決めていますか？",
                a: "一般的な成人の推定エネルギー必要量を参考に、2000kcalを基準としてタンパク質75g・脂質55g・炭水化物300gを設定しています。年齢・性別・活動量によって適正値は変わるため、あくまで目安としてご利用ください。",
              },
              {
                q: "ダイエット中でも使えますか？",
                a: "使えます。外食前にメニューの組み合わせを試して、目標カロリー内に収まる「がっつり感のある組み合わせ」を探す、という使い方がおすすめです。",
              },
              {
                q: "掲載されていないチェーンやメニューがあります",
                a: "現在は主要チェーンの代表的なメニューに絞って収録しています。追加リクエストはお問い合わせページからお寄せください。",
              },
            ]}
          />
        </ArticleSection>

        <NoteBox>
          ※本ツールは一般的な食事管理の参考情報を提供するものであり、医学的な助言に代わるものではありません。食事制限が必要な方は医師・管理栄養士にご相談ください。
        </NoteBox>
      </ToolArticle>
    </>
  );
}
