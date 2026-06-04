// 検索対象とする「がっつりキーワード」の定義
export const GATSU_KEYWORDS = [
  {
    label: "🍚 ライス無料",
    keywords: [
      "ライス無料",
      "ご飯無料",
      "ライスおかわり",
      "ご飯おかわり",
      "ライスサービス",
      "おかわり自由",
    ],
  },
  {
    label: "🍜 大盛り無料",
    keywords: [
      "大盛り無料",
      "大盛無料",
      "麺大盛り無料",
      "特盛無料",
      "増量無料",
    ],
  },
  {
    label: "🐷 背脂たっぷり",
    keywords: [
      "背脂",
      "アブラ",
      "ギトギト",
      "こってり",
      "チャッチャ系",
      "背あぶら",
    ],
  },
  {
    label: "🥩 肉厚・爆肉",
    keywords: [
      "肉厚",
      "チャーシュー厚",
      "肉盛",
      "爆肉",
      "ステーキ",
      "塊肉",
      "肉たっぷり",
    ],
  },
  {
    label: "🔥 ジャンク",
    keywords: [
      "ジャンキー",
      "マシマシ",
      "二郎系",
      "パンチ",
      "濃い口",
      "ガツン",
    ],
  },
  {
    label: "⚖️ デカ盛り",
    keywords: [
      "デカ盛り",
      "爆盛り",
      "メガ盛り",
      "重量級",
      "完食困難",
      "ギガ盛り",
    ],
  },
];

/**
 * 店舗の説明文（description）から、該当する「がっつりタグ」を抽出する関数
 * @param description 店舗の説明テキスト
 * @returns 抽出されたラベルの配列
 */
export function detectGatsuTags(description: string = ""): string[] {
  if (!description) return [];

  // 説明文の中にキーワードが含まれているかチェックし、一致したラベルを返す
  return GATSU_KEYWORDS.filter((item) =>
    item.keywords.some((keyword) => description.includes(keyword))
  ).map((item) => item.label);
}

export const calculateGatsuIndex = (restaurant: any): number => {
  let score = 0;

  // 1. ジャンルによる基礎点（genreが空の場合も考慮）
  const heavyGenres = ["ラーメン", "牛丼", "カツ丼", "定食", "カレー", "中華料理"];
  
  // restaurant.genre が undefined や null の場合は空文字 "" として扱う
  const genre = restaurant.genre || ""; 
  
  if (heavyGenres.some(g => genre.includes(g))) {
    score += 50;
  } else {
    score += 20;
  }

  // 2. 徒歩ボーナス（walkMinutesがない場合は加点なし）
  const walkMinutes = restaurant.walkMinutes || 99;
  if (walkMinutes <= 2) score += 20;
  else if (walkMinutes <= 5) score += 10;

  return Math.floor(Math.min(score, 99));
};