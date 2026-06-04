export type ChainMenuItem = {
  name: string;
  calories: number; // kcal
  protein: number;  // g
  fat: number;      // g
  carbs: number;    // g
};

export type Chain = {
  id: string;
  name: string;
  emoji: string;
  genre: string;
  stations: string[]; // 関連する代表駅（内部リンク用）
  menu: ChainMenuItem[];
};

// 1日の目安摂取量（成人・2000kcal基準）
export const DAILY_REFERENCE = {
  calories: 2000,
  protein: 75,  // g
  fat: 55,      // g
  carbs: 300,   // g
};

export const CHAINS: Chain[] = [
  {
    id: "yoshinoya",
    name: "吉野家",
    emoji: "🥩",
    genre: "牛丼",
    stations: ["新宿", "渋谷", "秋葉原", "大阪"],
    menu: [
      { name: "牛丼（並盛）",       calories: 641,  protein: 20, fat: 17, carbs: 96  },
      { name: "牛丼（大盛）",       calories: 785,  protein: 24, fat: 19, carbs: 122 },
      { name: "牛丼（特盛）",       calories: 956,  protein: 29, fat: 24, carbs: 142 },
      { name: "牛皿定食（並）",     calories: 597,  protein: 24, fat: 15, carbs: 87  },
      { name: "牛カルビ定食",       calories: 835,  protein: 31, fat: 22, carbs: 116 },
      { name: "から揚げ定食",       calories: 900,  protein: 37, fat: 28, carbs: 105 },
      { name: "豚汁（単品）",       calories: 108,  protein: 7,  fat: 5,  carbs: 9   },
    ],
  },
  {
    id: "matsuya",
    name: "松屋",
    emoji: "🍚",
    genre: "牛丼",
    stations: ["新宿", "池袋", "横浜", "名古屋"],
    menu: [
      { name: "牛めし（並）",           calories: 589,  protein: 20, fat: 13, carbs: 93  },
      { name: "牛めし（大盛）",         calories: 759,  protein: 25, fat: 16, carbs: 122 },
      { name: "カレーライス（並）",     calories: 736,  protein: 14, fat: 12, carbs: 139 },
      { name: "ロースかつ定食",         calories: 920,  protein: 37, fat: 33, carbs: 108 },
      { name: "鶏のスタミナ焼き定食",   calories: 817,  protein: 38, fat: 21, carbs: 100 },
      { name: "豚汁（単品）",           calories: 83,   protein: 5,  fat: 4,  carbs: 7   },
      { name: "半熟玉子（単品）",       calories: 72,   protein: 5,  fat: 5,  carbs: 1   },
    ],
  },
  {
    id: "sukiya",
    name: "すき家",
    emoji: "🍜",
    genre: "牛丼",
    stations: ["新宿", "池袋", "渋谷", "博多"],
    menu: [
      { name: "牛丼（並盛）",           calories: 668,  protein: 23, fat: 19, carbs: 95  },
      { name: "牛丼（大盛）",           calories: 845,  protein: 29, fat: 23, carbs: 124 },
      { name: "牛丼（メガ）",           calories: 1198, protein: 43, fat: 33, carbs: 176 },
      { name: "3種のチーズ牛丼（並）", calories: 801,  protein: 35, fat: 33, carbs: 86  },
      { name: "カレー（並）",           calories: 666,  protein: 16, fat: 11, carbs: 127 },
      { name: "豚汁（単品）",           calories: 101,  protein: 6,  fat: 5,  carbs: 8   },
    ],
  },
  {
    id: "mcdonalds",
    name: "マクドナルド",
    emoji: "🍔",
    genre: "ファストフード",
    stations: ["新宿", "渋谷", "秋葉原", "大阪"],
    menu: [
      { name: "ビッグマック",               calories: 557,  protein: 26, fat: 30, carbs: 46 },
      { name: "マックフライポテト（M）",    calories: 454,  protein: 5,  fat: 23, carbs: 58 },
      { name: "フィレオフィッシュ",         calories: 375,  protein: 15, fat: 17, carbs: 38 },
      { name: "チキンナゲット（5個）",      calories: 262,  protein: 16, fat: 15, carbs: 16 },
      { name: "エッグマックマフィン",       calories: 329,  protein: 19, fat: 16, carbs: 27 },
      { name: "ダブルチーズバーガー",       calories: 450,  protein: 26, fat: 23, carbs: 34 },
      { name: "マックシェイク チョコ（M）", calories: 381,  protein: 9,  fat: 10, carbs: 64 },
    ],
  },
  {
    id: "saizeriya",
    name: "サイゼリヤ",
    emoji: "🍝",
    genre: "ファミレス",
    stations: ["新宿", "池袋", "横浜", "梅田"],
    menu: [
      { name: "ミラノ風ドリア",               calories: 621,  protein: 25, fat: 21, carbs: 83 },
      { name: "マルゲリータピザ",             calories: 499,  protein: 18, fat: 17, carbs: 62 },
      { name: "ハンバーグステーキ",           calories: 390,  protein: 23, fat: 24, carbs: 19 },
      { name: "アラビアータ",                 calories: 503,  protein: 15, fat: 10, carbs: 90 },
      { name: "ペペロンチーノ",               calories: 540,  protein: 14, fat: 14, carbs: 86 },
      { name: "エビグラタン",                 calories: 476,  protein: 19, fat: 16, carbs: 62 },
      { name: "半熟卵のミートグラタン（小）", calories: 300,  protein: 16, fat: 15, carbs: 24 },
    ],
  },
  {
    id: "hidakaya",
    name: "日高屋",
    emoji: "🍜",
    genre: "中華",
    stations: ["新宿", "池袋", "錦糸町", "横浜"],
    menu: [
      { name: "中華そば",         calories: 462,  protein: 19, fat: 14, carbs: 63  },
      { name: "チャーシュー麺",   calories: 554,  protein: 29, fat: 18, carbs: 68  },
      { name: "中盛チャーハン",   calories: 705,  protein: 17, fat: 21, carbs: 107 },
      { name: "餃子（6個）",      calories: 246,  protein: 11, fat: 10, carbs: 28  },
      { name: "野菜炒め定食",     calories: 699,  protein: 26, fat: 19, carbs: 96  },
      { name: "タンメン",         calories: 509,  protein: 16, fat: 13, carbs: 79  },
    ],
  },
  {
    id: "marugame",
    name: "丸亀製麺",
    emoji: "🍵",
    genre: "うどん",
    stations: ["新宿", "渋谷", "大阪", "名古屋"],
    menu: [
      { name: "かけうどん（並）",   calories: 290,  protein: 9,  fat: 1,  carbs: 59 },
      { name: "肉うどん（並）",     calories: 452,  protein: 18, fat: 12, carbs: 65 },
      { name: "釜玉うどん（並）",   calories: 384,  protein: 14, fat: 7,  carbs: 65 },
      { name: "ぶっかけうどん（並）",calories: 310, protein: 10, fat: 2,  carbs: 62 },
      { name: "天ぷら（えび）",     calories: 102,  protein: 5,  fat: 5,  carbs: 10 },
      { name: "とり天",             calories: 130,  protein: 8,  fat: 8,  carbs: 7  },
      { name: "ちくわ天",           calories: 90,   protein: 5,  fat: 3,  carbs: 11 },
    ],
  },
  {
    id: "coco",
    name: "CoCo壱番屋",
    emoji: "🍛",
    genre: "カレー",
    stations: ["新宿", "名古屋", "大阪", "博多"],
    menu: [
      { name: "チキンカツカレー（300g）",   calories: 701,  protein: 22, fat: 21, carbs: 103 },
      { name: "ビーフカレー（300g）",       calories: 636,  protein: 16, fat: 18, carbs: 99  },
      { name: "手仕込みカツカレー（300g）", calories: 737,  protein: 25, fat: 24, carbs: 101 },
      { name: "野菜カレー（300g）",         calories: 541,  protein: 8,  fat: 11, carbs: 97  },
      { name: "ロースカツカレー（300g）",   calories: 749,  protein: 26, fat: 26, carbs: 100 },
      { name: "トッピング：チーズ",         calories: 66,   protein: 4,  fat: 5,  carbs: 0   },
      { name: "トッピング：温玉",           calories: 55,   protein: 5,  fat: 4,  carbs: 0   },
    ],
  },
];
