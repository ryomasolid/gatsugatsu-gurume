// --- ジャンル判定ルール ---
export const GENRE_RULES = [
  { genre: "油そば", keywords: ["油そば", "まぜそば"] },
  { genre: "スープカレー", keywords: ["スープカレー"] },
  { genre: "カツ丼", keywords: ["カツ丼", "かつ丼"] },
  { genre: "牛丼", keywords: ["牛丼", "吉野家", "すき家", "松屋"] },
  { genre: "ラーメン", keywords: ["ラーメン", "麺屋"], types: ["ramen_restaurant"] },
  { genre: "中華料理", keywords: ["中華"], types: ["chinese_restaurant"] },
  { genre: "カレー", keywords: ["カレー", "curry"] },
  { genre: "定食", keywords: ["定食", "食堂", "御膳", "めし"] },
  { genre: "スタミナ料理", keywords: ["スタミナ", "がっつり", "すた丼", "背脂", "二郎", "特盛", "爆盛"] },
];