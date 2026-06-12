import {
  ArticleSection,
  ArticleText,
  FaqList,
  NoteBox,
  StepList,
  ToolArticle,
} from "@/components/ToolArticle";
import { WAIT_TIME_GENRES } from "@/constants/waitTimeData";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Metadata } from "next";
import WaitTimeClient from "./_components/WaitTimeClient";

export const metadata: Metadata = {
  title: "【行列計算機】人気店の待ち時間・回転率 予測シミュレーター | がつがつグルメ",
  description:
    "並んでいる人数・席数・お店のジャンルを入れるだけで待ち時間をリアルタイム予測。今から並ぶと何時に入れる？入店予定時刻まで自動計算。ラーメン・寿司・ファミレスなど業態別の回転率データを使ったシミュレーター。",
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
  return (
    <>
      <WaitTimeClient />
      <ToolArticle>
        <ArticleSection title="待ち時間予測の仕組み">
          <ArticleText>
            この計算機は「待ち時間 ＝（並んでいる人数 ÷ 店の席数）× 業態別の平均滞在時間」というシンプルなモデルで待ち時間を見積もります。
            たとえば席数20のラーメン店に20人並んでいる場合、ちょうど1回転待つ計算になるため、平均滞在時間15分がそのまま待ち時間の目安になります。
          </ArticleText>
          <ArticleText>
            鍵になるのが「平均滞在時間」です。ラーメンや牛丼のように提供が速く食べ終わりも早い業態と、ファミレスやカフェのように長居しやすい業態とでは、同じ行列の長さでも待ち時間が大きく変わります。本ツールでは業態ごとに以下の目安値を設定しています。
          </ArticleText>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ "& th, & td": { fontWeight: 700 } }}>
              <TableHead>
                <TableRow>
                  <TableCell>業態</TableCell>
                  <TableCell>平均滞在時間（目安）</TableCell>
                  <TableCell>例</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {WAIT_TIME_GENRES.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell>{g.emoji} {g.label}</TableCell>
                    <TableCell>約{g.avgStayMin}分</TableCell>
                    <TableCell sx={{ color: "#666" }}>{g.examples.replace("例：", "")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </ArticleSection>

        <ArticleSection title="使い方（3ステップ）">
          <StepList
            steps={[
              {
                title: "お店の業態を選ぶ",
                body: "ラーメン・牛丼系か、回転寿司・うどん系か、ファミレス・カフェか、焼肉・居酒屋ランチか。業態によって1席あたりの回転速度が変わります。",
              },
              {
                title: "並んでいる人数を入力する",
                body: "自分の前に並んでいるおおよその人数を入力します。グループ客が多い場合は実際の組数より多めに見積もると精度が上がります。",
              },
              {
                title: "席数を選ぶ",
                body: "店内を覗いて席数の規模感（少なめ・普通・多め・大型）を選べばOK。正確な席数がわかる場合は直接入力もできます。結果には「今から並ぶと何時頃に入店できるか」の予定時刻も表示されます。",
              },
            ]}
          />
        </ArticleSection>

        <ArticleSection title="行列に並ぶか、別の店にするかの判断基準">
          <ArticleText>
            経験則として、ラーメン店なら10人待ちでも回転が速く15分前後で入れることが多い一方、ファミレスで10人待ちはグループ単位の入れ替えになるため30分以上かかるケースが珍しくありません。
            「行列の長さ」ではなく「行列 × 業態の回転率」で判断するのが、昼休みを無駄にしないコツです。
          </ArticleText>
          <ArticleText>
            計算結果の入店予定時刻が昼休みの残り時間を超えるようなら、潔く別の店に切り替えるのがおすすめです。駅周辺の代替候補は、トップページの駅検索からがっつり系の店舗を徒歩分数つきで探せます。
          </ArticleText>
        </ArticleSection>

        <ArticleSection title="よくある質問">
          <FaqList
            faqs={[
              {
                q: "予測はどのくらい正確ですか？",
                a: "あくまで平均滞在時間に基づく概算です。ピークタイムの相席運用、テイクアウト比率、グループ客の割合などで実際の待ち時間は前後します。「並ぶか帰るか」を判断するための目安としてご利用ください。",
              },
              {
                q: "平均滞在時間の根拠は何ですか？",
                a: "外食業界で一般的に言われる業態別の客席回転率の目安をもとに、編集部が各業態の代表的な値として設定したものです。個別店舗の実測値ではありません。",
              },
              {
                q: "行列が2列ある店や記名式の店でも使えますか？",
                a: "使えます。記名式の場合は待ち組数×平均人数で並び人数を見積もってください。フードコートのような完全入れ替え制でない業態では、誤差が大きくなる点にご注意ください。",
              },
              {
                q: "席数がわからないときはどうすればいいですか？",
                a: "カウンターのみの小型店なら「少なめ（10席）」、一般的な路面店なら「普通（20席）」、ロードサイドの大型店なら「大型（60席）」を選ぶと大きくは外れません。",
              },
            ]}
          />
        </ArticleSection>

        <NoteBox>
          ※本ツールの計算結果は目安であり、実際の入店時刻を保証するものではありません。確実に入店したい場合は、各店舗の予約システムや公式の待ち時間案内をご利用ください。
        </NoteBox>
      </ToolArticle>
    </>
  );
}
