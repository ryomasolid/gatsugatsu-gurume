// app/sitemap.ts
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gatsugatsu-gurume.com";
  const now = new Date();

  // SEO効果が高い「乗降客数が多い駅」および「ガッツリ需要がある学生街」のリスト
  const stations = [
    // 東京エリア
    "新宿",
    "渋谷",
    "池袋",
    "東京",
    "秋葉原",
    "品川",
    "上野",
    "新橋",
    "北千住",
    "高田馬場",
    "立川",
    "吉祥寺",
    "町田",
    "蒲田",
    "中野",
    "五反田",
    "大崎",
    "恵比寿",
    "目黒",
    "駒沢大学",
    "水道橋",
    "御茶ノ水",
    "飯田橋",
    "練馬",
    "荻窪",
    "赤羽",
    "下北沢",
    "自由が丘",
    "八王子",
    // 神奈川エリア
    "横浜",
    "川崎",
    "武蔵小杉",
    "藤沢",
    "戸塚",
    "溝の口",
    "本厚木",
    "海老名",
    "日吉",
    "登戸",
    // 埼玉・千葉エリア
    "大宮",
    "浦和",
    "川口",
    "西船橋",
    "柏",
    "千葉",
    "松戸",
    "津田沼",
    "船橋",
    // 大阪・関西エリア
    "大阪",
    "梅田",
    "難波",
    "心斎橋",
    "天王寺",
    "京橋",
    "淀屋橋",
    "本町",
    "鶴橋",
    "三ノ宮",
    "京都",
    "四条",
    "河原町",
    "烏丸",
    "天満",
    "江坂",
    "千里中央",
    // 名古屋・中部エリア
    "名古屋",
    "栄",
    "金山",
    "伏見",
    "静岡",
    "浜松",
    // 福岡・九州エリア
    "博多",
    "天神",
    "小倉",
    "西鉄福岡",
    "熊本",
    "鹿児島中央",
    // その他主要都市
    "札幌",
    "大通",
    "仙台",
    "広島",
    "岡山",
  ];

  // 駅ページのエントリを生成
  const stationEntries: MetadataRoute.Sitemap = stations.map((name) => ({
    url: `${baseUrl}/station/${encodeURIComponent(name)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...stationEntries,
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
