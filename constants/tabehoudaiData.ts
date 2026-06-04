export type Course = {
  id: string;
  name: string;
  price: number;
  note: string;
};

export type TabehoudaiMenuItem = {
  name: string;
  unitPrice: number;
  category: string;
};

export type TabehoudaiChain = {
  id: string;
  name: string;
  emoji: string;
  genre: string;
  catchcopy: string;
  courses: Course[];
  menu: TabehoudaiMenuItem[];
  stations: string[];
};

export const TABEHOUDAI_CHAINS: TabehoudaiChain[] = [
  {
    id: "yakiniku-king",
    name: "焼肉きんぐ",
    emoji: "🥩",
    genre: "焼肉食べ放題",
    catchcopy: "人気No.1焼肉食べ放題チェーン。コース料金でどこまで元が取れるかチェック！",
    courses: [
      { id: "one-king", name: "ワンキングコース", price: 3480, note: "豚・鶏・サイドメニュー含む" },
      { id: "king",     name: "きんぐコース",   price: 4180, note: "牛カルビ・ハラミが追加" },
      { id: "premium",  name: "プレミアムきんぐコース", price: 4980, note: "牛タン・上カルビ含む全品" },
    ],
    menu: [
      { name: "きんぐカルビ",       unitPrice: 660, category: "牛肉" },
      { name: "上カルビ",           unitPrice: 770, category: "牛肉" },
      { name: "牛ハラミ",           unitPrice: 660, category: "牛肉" },
      { name: "やわらか牛タン",     unitPrice: 880, category: "牛肉" },
      { name: "骨付きカルビ",       unitPrice: 880, category: "牛肉" },
      { name: "豚バラ",             unitPrice: 440, category: "豚肉" },
      { name: "サムギョプサル",     unitPrice: 550, category: "豚肉" },
      { name: "鶏もも塩ダレ",       unitPrice: 360, category: "鶏肉" },
      { name: "ホルモンミックス",   unitPrice: 440, category: "内臓系" },
      { name: "ナムル盛り合わせ",   unitPrice: 360, category: "サイド" },
      { name: "キムチ盛り合わせ",   unitPrice: 330, category: "サイド" },
      { name: "白飯",               unitPrice: 220, category: "ご飯" },
      { name: "クッパ",             unitPrice: 440, category: "ご飯" },
      { name: "冷麺",               unitPrice: 440, category: "麺" },
      { name: "デザート盛り合わせ", unitPrice: 440, category: "デザート" },
    ],
    stations: ["大宮", "立川", "千葉", "藤沢", "町田", "川口"],
  },
  {
    id: "shabuyo",
    name: "しゃぶ葉",
    emoji: "🫕",
    genre: "しゃぶしゃぶ食べ放題",
    catchcopy: "スープ・タレ選び放題！家族でも一人でも使いやすいしゃぶしゃぶ食べ放題。",
    courses: [
      { id: "pork-veg",    name: "ポーク＆ベジタブルコース", price: 2189, note: "豚肉・野菜・デザート食べ放題" },
      { id: "pork-sea",    name: "ポーク＆シーフードコース", price: 2519, note: "豚肉・海鮮・デザート食べ放題" },
      { id: "premium",     name: "プレミアムコース",         price: 3069, note: "牛・豚・海鮮・デザート全品" },
    ],
    menu: [
      { name: "豚バラ",           unitPrice: 407, category: "豚肉" },
      { name: "豚ロース",         unitPrice: 440, category: "豚肉" },
      { name: "牛ロース",         unitPrice: 638, category: "牛肉" },
      { name: "牛バラ",           unitPrice: 550, category: "牛肉" },
      { name: "えび",             unitPrice: 550, category: "海鮮" },
      { name: "ほたて",           unitPrice: 638, category: "海鮮" },
      { name: "豆腐",             unitPrice: 198, category: "野菜・豆腐" },
      { name: "白菜・きのこセット", unitPrice: 264, category: "野菜・豆腐" },
      { name: "うどん",           unitPrice: 264, category: "シメ" },
      { name: "雑炊セット",       unitPrice: 264, category: "シメ" },
      { name: "白飯",             unitPrice: 198, category: "シメ" },
      { name: "ソフトクリーム",   unitPrice: 264, category: "デザート" },
      { name: "アイスクリーム",   unitPrice: 264, category: "デザート" },
    ],
    stations: ["新宿", "渋谷", "池袋", "横浜", "大阪", "名古屋", "博多"],
  },
  {
    id: "toritake",
    name: "鳥貴族",
    emoji: "🍗",
    genre: "焼き鳥・飲み放題",
    catchcopy: "全品均一価格の人気焼き鳥居酒屋。飲み放題コースでドリンクの元を取ろう！",
    courses: [
      { id: "nomi-2h", name: "2時間飲み放題コース", price: 1980, note: "ドリンク2時間飲み放題" },
      { id: "nomi-3h", name: "3時間飲み放題コース", price: 2480, note: "ドリンク3時間飲み放題" },
    ],
    menu: [
      { name: "生ビール（中）",   unitPrice: 638, category: "ビール" },
      { name: "ハイボール",       unitPrice: 550, category: "ウイスキー" },
      { name: "レモンサワー",     unitPrice: 550, category: "サワー" },
      { name: "梅酒ソーダ",       unitPrice: 495, category: "サワー" },
      { name: "日本酒（1合）",    unitPrice: 660, category: "日本酒" },
      { name: "ウーロン茶",       unitPrice: 330, category: "ソフトドリンク" },
      { name: "コーラ",           unitPrice: 330, category: "ソフトドリンク" },
      { name: "焼き鳥（1本）",    unitPrice: 360, category: "フード" },
      { name: "ネギ塩豚トロ",     unitPrice: 360, category: "フード" },
      { name: "つくね",           unitPrice: 360, category: "フード" },
      { name: "唐揚げ",           unitPrice: 360, category: "フード" },
    ],
    stations: ["新宿", "渋谷", "池袋", "三ノ宮", "天神", "梅田", "錦糸町"],
  },
  {
    id: "sutamina-taro",
    name: "すたみな太郎",
    emoji: "🍖",
    genre: "バイキング食べ放題",
    catchcopy: "焼肉・寿司・デザートまで！ファミリー向けバイキングの定番チェーン。",
    courses: [
      { id: "lunch",   name: "ランチバイキング",   price: 1320, note: "平日ランチ限定" },
      { id: "dinner",  name: "ディナーバイキング",  price: 2178, note: "毎日ディナー" },
      { id: "holiday", name: "土日祝バイキング",    price: 2398, note: "土日祝・全時間帯" },
    ],
    menu: [
      { name: "カルビ",           unitPrice: 400, category: "焼肉" },
      { name: "豚バラ",           unitPrice: 350, category: "焼肉" },
      { name: "ホルモン",         unitPrice: 300, category: "焼肉" },
      { name: "サーモン握り",     unitPrice: 250, category: "寿司" },
      { name: "えび握り",         unitPrice: 250, category: "寿司" },
      { name: "マグロ握り",       unitPrice: 250, category: "寿司" },
      { name: "ピザ",             unitPrice: 260, category: "洋食" },
      { name: "カレー",           unitPrice: 260, category: "洋食" },
      { name: "チャーハン",       unitPrice: 300, category: "洋食" },
      { name: "ラーメン",         unitPrice: 350, category: "麺" },
      { name: "デザートケーキ",   unitPrice: 180, category: "デザート" },
      { name: "ソフトクリーム",   unitPrice: 160, category: "デザート" },
      { name: "ソフトドリンク",   unitPrice: 220, category: "ドリンク" },
    ],
    stations: ["大宮", "浦和", "川口", "船橋", "柏", "立川", "千葉"],
  },
];
