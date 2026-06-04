export type BudgetType = "cheap" | "normal" | "luxury";
export type MoodType = "gatsuri" | "assari" | "spicy" | "meat" | "noodle";

export type GachaItem = {
  name: string;
  genre: string;
  emoji: string;
  budget: BudgetType[];
  mood: MoodType[];
  comment: string;
};

export const BUDGET_LABELS: Record<BudgetType, string> = {
  cheap: "チープ 〜700円",
  normal: "普通 700〜1200円",
  luxury: "プチ贅沢 1200円〜",
};

export const MOOD_LABELS: Record<MoodType, string> = {
  gatsuri: "ガッツリ",
  assari: "あっさり",
  spicy: "辛い",
  meat: "肉厚",
  noodle: "麺系",
};

// ジャンル別の代表駅（内部リンク生成用）
export const GENRE_STATIONS: Record<string, string[]> = {
  ラーメン: ["新宿", "池袋", "渋谷", "高田馬場", "横浜"],
  油そば: ["新宿", "高田馬場", "吉祥寺", "渋谷"],
  牛丼: ["新宿", "渋谷", "秋葉原", "大阪"],
  定食: ["新宿", "池袋", "神田", "大宮"],
  カツ丼: ["新宿", "秋葉原", "上野", "名古屋"],
  中華料理: ["新宿", "池袋", "横浜", "神田"],
  スタミナ料理: ["新宿", "池袋", "立川", "大阪"],
  カレー: ["新宿", "神田", "渋谷", "名古屋"],
  スープカレー: ["札幌", "大通", "新宿", "梅田"],
};

export const GACHA_ITEMS: GachaItem[] = [
  // ── ラーメン ──
  {
    name: "二郎系ラーメン",
    genre: "ラーメン",
    emoji: "🍜",
    budget: ["cheap", "normal"],
    mood: ["gatsuri", "noodle"],
    comment: "野菜マシマシ、背脂ドバドバ。これが本物のがっつり飯だ！腹を空にして挑め。",
  },
  {
    name: "家系ラーメン",
    genre: "ラーメン",
    emoji: "🍜",
    budget: ["cheap", "normal"],
    mood: ["gatsuri", "noodle"],
    comment: "濃厚豚骨醤油に太麺。ライス無料で米もかっ込め！これが横浜魂だ。",
  },
  {
    name: "鶏ガラ塩ラーメン",
    genre: "ラーメン",
    emoji: "🍜",
    budget: ["cheap", "normal"],
    mood: ["assari", "noodle"],
    comment: "澄んだスープが疲れた体に染みわたる。がっつりの合間の優しい一杯。",
  },
  {
    name: "辛味噌ラーメン",
    genre: "ラーメン",
    emoji: "🌶️",
    budget: ["cheap", "normal"],
    mood: ["spicy", "noodle"],
    comment: "辛さが脳を直撃。汗だくで啜るのが真の漢の流儀だ。",
  },
  {
    name: "激辛まぜそば",
    genre: "ラーメン",
    emoji: "🌶️",
    budget: ["cheap", "normal"],
    mood: ["spicy", "noodle"],
    comment: "辛さレベルMAX挑戦中——後悔はしない、これが目覚める瞬間だ。",
  },
  {
    name: "中華そば",
    genre: "ラーメン",
    emoji: "🍜",
    budget: ["cheap"],
    mood: ["assari", "noodle"],
    comment: "昔ながらの醤油スープ。食べてわかる、シンプルの圧倒的な力。",
  },
  {
    name: "チャーシュー麺（全部乗せ）",
    genre: "ラーメン",
    emoji: "🍜",
    budget: ["luxury"],
    mood: ["gatsuri", "noodle", "meat"],
    comment: "チャーシューが麺を完全に埋め尽くす。これのために今日も働いた。",
  },
  // ── 油そば ──
  {
    name: "油そば",
    genre: "油そば",
    emoji: "🍝",
    budget: ["cheap", "normal"],
    mood: ["gatsuri", "noodle"],
    comment: "混ぜれば混ぜるほど旨い。最後の一滴まで逃すな、追い飯で完全制覇！",
  },
  // ── 牛丼・丼 ──
  {
    name: "牛丼（特盛）",
    genre: "牛丼",
    emoji: "🥩",
    budget: ["cheap"],
    mood: ["gatsuri", "meat"],
    comment: "つゆだく特盛で腹を満たせ。コスパの王者に今日も感謝。",
  },
  {
    name: "すた丼",
    genre: "スタミナ料理",
    emoji: "🍚",
    budget: ["cheap", "normal"],
    mood: ["gatsuri", "meat"],
    comment: "ニンニク臭くても知らない。明日のことより今のがっつり飯だ！",
  },
  {
    name: "カツ丼",
    genre: "カツ丼",
    emoji: "🍱",
    budget: ["cheap", "normal"],
    mood: ["gatsuri", "meat"],
    comment: "とろとろ卵と分厚いカツ。食べてから挑め、全ての難局に。",
  },
  {
    name: "親子丼",
    genre: "定食",
    emoji: "🍳",
    budget: ["cheap", "normal"],
    mood: ["assari"],
    comment: "ふわとろ卵と鶏肉のハーモニー。心も体も温まる定番の一杯。",
  },
  {
    name: "焼肉丼（特盛）",
    genre: "スタミナ料理",
    emoji: "🥩",
    budget: ["normal", "luxury"],
    mood: ["gatsuri", "meat"],
    comment: "タレの絡んだ肉が米を溺れさせる。これぞ肉食獣の昼飯だ。",
  },
  // ── 定食 ──
  {
    name: "唐揚げ定食（大盛り）",
    genre: "定食",
    emoji: "🍗",
    budget: ["cheap", "normal"],
    mood: ["gatsuri", "meat"],
    comment: "サクサクジューシーな唐揚げの山。ご飯おかわり必須の最強メシ！",
  },
  {
    name: "豚汁定食",
    genre: "定食",
    emoji: "🍱",
    budget: ["cheap"],
    mood: ["assari", "gatsuri"],
    comment: "ご飯おかわり自由。根菜たっぷりの豚汁で体の芯から温まれ。",
  },
  {
    name: "海鮮丼",
    genre: "定食",
    emoji: "🐟",
    budget: ["luxury"],
    mood: ["assari"],
    comment: "贅沢なネタが山盛り。たまにはこんな昼もいいじゃないか。",
  },
  // ── カレー ──
  {
    name: "スタミナカレー（大盛り）",
    genre: "カレー",
    emoji: "🍛",
    budget: ["cheap", "normal"],
    mood: ["gatsuri", "spicy"],
    comment: "辛さと量で二重の地獄へようこそ。でも止まれない、これが沼だ。",
  },
  {
    name: "黒カレー（スペシャル）",
    genre: "カレー",
    emoji: "🍛",
    budget: ["normal", "luxury"],
    mood: ["spicy", "gatsuri"],
    comment: "一口で虜になる複雑な旨味。本気のカレーはこの色をしている。",
  },
  {
    name: "スープカレー",
    genre: "スープカレー",
    emoji: "🍲",
    budget: ["normal", "luxury"],
    mood: ["spicy"],
    comment: "スパイスが全身に染みわたる。北海道発の魂、今ここに降臨。",
  },
  // ── 中華 ──
  {
    name: "チャーハン（特盛）",
    genre: "中華料理",
    emoji: "🍳",
    budget: ["cheap", "normal"],
    mood: ["gatsuri"],
    comment: "パラパラ炒飯の山を崩しながら食べる幸福。中華の鉄人に感謝。",
  },
  {
    name: "回鍋肉定食",
    genre: "中華料理",
    emoji: "🥬",
    budget: ["cheap", "normal"],
    mood: ["gatsuri", "spicy"],
    comment: "ニンニクとごま油の香りに負けろ。飯が止まらなくなっても知らないぞ。",
  },
  {
    name: "麻婆豆腐定食",
    genre: "中華料理",
    emoji: "🌶️",
    budget: ["cheap", "normal"],
    mood: ["spicy", "gatsuri"],
    comment: "痺れる辛さと豊かな旨味。これぞ四川の本気、日本のガツ飯。",
  },
  // ── スタミナ ──
  {
    name: "鉄板焼き定食",
    genre: "スタミナ料理",
    emoji: "🥩",
    budget: ["luxury"],
    mood: ["gatsuri", "meat"],
    comment: "ジュージュー音が食欲を暴走させる。今日は自分にご褒美だ！",
  },
];
