export type WaitTimeGenre = {
  id: string;
  label: string;
  emoji: string;
  avgStayMin: number;
  examples: string;
  stations: string[];
};

export const WAIT_TIME_GENRES: WaitTimeGenre[] = [
  {
    id: "fastfood",
    label: "ラーメン・牛丼・ファストフード",
    emoji: "🍜",
    avgStayMin: 15,
    examples: "例：ラーメン・吉野家・マクドナルド",
    stations: ["新宿", "渋谷", "池袋", "秋葉原", "博多", "大阪", "名古屋"],
  },
  {
    id: "sushi",
    label: "回転寿司・うどん・そば",
    emoji: "🍣",
    avgStayMin: 25,
    examples: "例：スシロー・丸亀製麺・富士そば",
    stations: ["横浜", "大宮", "錦糸町", "千葉", "吉祥寺", "川崎", "藤沢"],
  },
  {
    id: "cafe",
    label: "ファミレス・カフェ",
    emoji: "☕",
    avgStayMin: 45,
    examples: "例：ガスト・デニーズ・スターバックス",
    stations: ["吉祥寺", "三鷹", "二子玉川", "自由が丘", "成城学園前", "三ノ宮", "栄"],
  },
  {
    id: "yakiniku",
    label: "焼肉・居酒屋（ランチ）",
    emoji: "🥩",
    avgStayMin: 40,
    examples: "例：焼肉・牛角・居酒屋のランチ",
    stations: ["錦糸町", "上野", "梅田", "天神", "栄", "三ノ宮", "大宮"],
  },
];

export const SEAT_PRESETS = [
  { label: "少なめ", seats: 10 },
  { label: "普通",   seats: 20 },
  { label: "多め",   seats: 40 },
  { label: "大型",   seats: 60 },
] as const;
