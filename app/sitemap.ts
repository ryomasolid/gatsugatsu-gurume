import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gatsugatsu-gurume.com";
  const now = new Date();

  // 全国主要駅リスト
  const stations = [
    // --- 東京23区・多摩エリア ---
    "新宿", "渋谷", "池袋", "東京", "秋葉原", "品川", "上野", "新橋", "北千住", "高田馬場", "有楽町", "浜松町", "田町", "恵比寿", "目黒", "五反田", "大崎", "代々木", "原宿", "目白", "大塚", "巣鴨", "駒込", "田端", "西日暮里", "日暮里", "鶯谷", "御徒町", "神田", "駒沢大学", "御茶ノ水", "水道橋", "飯田橋", "市ケ谷", "四ツ谷", "早稲田", "日吉", "明大前", "下北沢", "三軒茶屋", "経堂", "成城学園前", "江古田", "錦糸町", "亀戸", "新小岩", "小岩", "綾瀬", "金町", "葛西", "西葛西", "門前仲町", "中野", "高円寺", "阿佐ケ谷", "荻窪", "吉祥寺", "三鷹", "笹塚", "千歳烏山", "二子玉川", "自由が丘", "蒲田", "大井町", "大森", "赤羽", "十条", "板橋", "練馬", "成増", "光が丘", "王子", "立川", "町田", "八王子",

    // --- 神奈川・埼玉・千葉エリア ---
    "横浜", "川崎", "武蔵小杉", "藤沢", "戸塚", "溝の口", "本厚木", "海老名", "登戸", "大宮", "浦和", "川口", "西船橋", "柏", "千葉", "松戸", "津田沼", "船橋",

    // --- 大阪・関西エリア ---
    "大阪", "梅田", "難波", "心斎橋", "天王寺", "阿部野橋", "京橋", "淀屋橋", "本町", "鶴橋", "十三", "新大阪", "江坂", "千里中央", "豊中", "茨木", "高槻", "枚方市", "寝屋川市", "三ノ宮", "三宮", "神戸", "元町", "西宮北口", "尼崎", "明石", "姫路", "京都", "四条", "河原町", "烏丸", "天満", "出町柳", "桂",

    // --- 名古屋・中部エリア ---
    "名古屋", "栄", "金山", "伏見", "大須観音", "矢場町", "千種", "今池", "星ヶ丘", "静岡", "浜松", "豊橋",

    // --- 福岡・九州エリア ---
    "博多", "天神", "小倉", "西鉄福岡", "薬院", "大橋", "久留米", "熊本", "鹿児島中央",

    // --- 北海道・東北・中四国 ---
    "札幌", "大通", "さっぽろ", "すすきの", "琴似", "麻生", "仙台", "あおば通", "勾当台公園", "広島", "本通", "八丁堀", "岡山", "倉敷", "松山市", "高松",
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
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
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