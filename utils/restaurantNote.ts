/**
 * 店舗カードに表示する紹介文を生成する。
 *
 * Google Places のデータには各店の説明文が含まれないため、
 * 「店名＋住所＋徒歩分数」だけのそっけないカードになりがちだった。
 * ここでは確認可能な事実（判定ジャンル・駅からの徒歩分数）のみを根拠に、
 * そのジャンルの一般的な魅力とアクセスを伝える紹介文を生成する。
 *
 * 個別の店舗について未確認の具体的事実（特定メニュー・味・量など）は
 * 断定しない。あくまで「どんなジャンルの店か・どれくらい近いか」という
 * オリエンテーション目的の文章とする。文末の一言は店舗IDから決定的に
 * 選び、全カードが同一文にならないよう配慮している。
 */

const GENRE_BLURBS: Record<string, string> = {
  ラーメン:
    "一杯で満足感の高いラーメンは、がっつり補給の定番ジャンル。麺の量や味の濃さを選べる店なら、自分のペースで楽しめます。",
  油そば:
    "スープがない分、濃厚なタレと太めの麺をダイレクトに味わえる油そば。最後まで力強い味が続くのが魅力です。",
  牛丼:
    "早い・安い・ボリュームの三拍子がそろう牛丼。時間がない日でもしっかり腹を満たせる、がっつり派の味方です。",
  定食:
    "主菜・ごはん・汁物がそろう定食は、バランスよくがっつり食べたい日にぴったり。ごはんのおかわりに対応する店も多いジャンルです。",
  カツ丼:
    "揚げたてのカツとごはんをかき込む満足感が魅力のカツ丼。しっかり食べたい日の鉄板メニューです。",
  中華料理:
    "炒め物から麺・丼ものまで、ボリュームメニューが豊富な中華。がっつり派の選択肢が広いジャンルです。",
  スタミナ料理:
    "にんにくや肉を効かせたスタミナ系。しっかり食べてパワーをつけたい日に頼れる一軒です。",
  カレー:
    "スパイスとごはんで満たされるカレー。大盛りに対応する店も多く、コスパよくお腹を満たせます。",
  スープカレー:
    "具だくさんでスパイスの効いたスープカレー。食べごたえと満足感を両立できる一杯が楽しめます。",
  その他:
    "がっつり食べられるお店として掲載しています。詳しいメニューや営業状況はGoogleマップでご確認ください。",
};

const CLOSING_TIPS = [
  "営業時間や定休日は変わることがあるため、来店前にご確認ください。",
  "混雑する時間帯は待ちが出ることもあります。時間に余裕を持って。",
  "気になったら、まずGoogleマップで口コミや写真をチェックしてみてください。",
  "メニューや価格は変更されることがあります。最新情報は店舗にご確認を。",
];

function accessPhrase(stationName: string, walkMinutes: number): string {
  if (walkMinutes <= 0) return `${stationName}駅周辺にあります。`;
  if (walkMinutes <= 3) return `${stationName}駅からすぐの好立地（徒歩約${walkMinutes}分）。`;
  if (walkMinutes <= 7) return `${stationName}駅から徒歩約${walkMinutes}分。`;
  return `${stationName}駅から徒歩約${walkMinutes}分。少し歩きますが、行動範囲なら候補に入れたい一軒です。`;
}

/** 店舗IDから決定的に 0..n-1 を返す（文末の一言を店ごとに散らすため） */
function pickById(id: string, n: number): number {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return sum % n;
}

export function generateRestaurantNote(params: {
  genre: string;
  stationName: string;
  walkMinutes: number;
  id: string;
}): string {
  const { genre, stationName, walkMinutes, id } = params;
  const blurb = GENRE_BLURBS[genre] ?? GENRE_BLURBS["その他"];
  const access = accessPhrase(stationName, walkMinutes);
  const tip = CLOSING_TIPS[pickById(id, CLOSING_TIPS.length)];
  return `${access}${blurb}${tip}`;
}
