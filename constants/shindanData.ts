export type MeshiTypeId =
  | "dekamori"
  | "cospa"
  | "menloop"
  | "nikushoku"
  | "gekikara"
  | "teishoku"
  | "trendhunter"
  | "balancer";

export type MeshiType = {
  id: MeshiTypeId;
  name: string;
  emoji: string;
  catchphrase: string;
  description: string;
  /** 相性のいい飯タイプ */
  goodMatch: MeshiTypeId;
  /** おすすめツールへの内部リンク */
  tool: { href: string; label: string };
  /** おすすめ駅（内部リンク用） */
  stations: string[];
};

export type ShindanChoice = {
  label: string;
  /** このタイプに +2 点 */
  primary: MeshiTypeId;
  /** このタイプに +1 点 */
  secondary: MeshiTypeId;
};

export type ShindanQuestion = {
  question: string;
  choices: ShindanChoice[];
};

export const MESHI_TYPES: Record<MeshiTypeId, MeshiType> = {
  dekamori: {
    id: "dekamori",
    name: "限界デカ盛りストロンガー",
    emoji: "🍚",
    catchphrase: "量こそ正義。胃袋に限界はない。",
    description:
      "あなたの食の原動力は「満腹感」。大盛り無料の文字を見ると吸い込まれ、丼の高さにロマンを感じるタイプです。腹八分目という言葉は辞書にありません。週に一度は『今日は限界までいく』と決めて挑む、その姿はもはやアスリート。胃袋のコンディション管理さえ怠らなければ、外食ライフの満足度は全タイプ中ナンバーワンです。",
    goodMatch: "cospa",
    tool: { href: "/tabehoudai", label: "食べ放題・元取れ計算機" },
    stations: ["新宿", "池袋", "高田馬場", "立川"],
  },
  cospa: {
    id: "cospa",
    name: "コスパ番長",
    emoji: "💴",
    catchphrase: "うまい・安い・早い。三拍子なくして飯にあらず。",
    description:
      "値上げの時代を生き抜く知恵者。ワンコインの壁を死守し、クーポン・ランチセット・大盛り無料の情報網は誰よりも広い。「この内容でこの値段！？」という発見にこそ最大の喜びを感じるタイプです。安さだけでなく味も妥協しないバランス感覚を持ち合わせており、あなたの「ここ良いよ」は周囲からの信頼度抜群です。",
    goodMatch: "dekamori",
    tool: { href: "/warikan", label: "割り勘＆傾斜計算機" },
    stations: ["神田", "秋葉原", "大宮", "大阪"],
  },
  menloop: {
    id: "menloop",
    name: "無限麺ループ族",
    emoji: "🍜",
    catchphrase: "今日も麺。明日も麺。それの何が悪い。",
    description:
      "ラーメン・うどん・そば・パスタ・油そば——気づけば今週5日麺類、それがあなたです。スープの一滴に宿る情報量を読み取り、麺の太さ・加水率を語れる素質があります。「また麺なの？」と言われても動じない芯の強さこそ、麺ループ族の証。新店開拓のアンテナも高く、行きつけの一杯を持つ幸せを知っています。",
    goodMatch: "gekikara",
    tool: { href: "/waittime", label: "行列・待ち時間予測" },
    stations: ["高田馬場", "新宿", "吉祥寺", "横浜"],
  },
  nikushoku: {
    id: "nikushoku",
    name: "肉食ハンター",
    emoji: "🥩",
    catchphrase: "迷ったら肉。迷わなくても肉。",
    description:
      "焼肉・ステーキ・からあげ・カツ——タンパク質への嗅覚が研ぎ澄まされたハンター。「野菜も食べなよ」の声は肉の焼ける音でかき消されます。ソロ焼肉も余裕でこなす行動力があり、肉のためなら多少の遠征も惜しまない。ご褒美の基準が常に肉であるあなたは、人生の幸福度を肉でコントロールできる稀有な存在です。",
    goodMatch: "balancer",
    tool: { href: "/calorie", label: "外食カロリー＆PFC計算" },
    stations: ["上野", "新橋", "名古屋", "梅田"],
  },
  gekikara: {
    id: "gekikara",
    name: "激辛チャレンジャー",
    emoji: "🌶️",
    catchphrase: "汗は流すもの。辛さは超えるもの。",
    description:
      "辛さ表記「激辛」を見ると挑戦せずにはいられない冒険者。麻辣湯・激辛麻婆・蒙古タンメン系を制覇し、卓上の一味では物足りない体になっています。辛さの向こう側にある旨味を知っているため、ただ辛いだけの店は見抜く眼力も持つ。周囲を巻き込んで激辛会を開催しがちですが、その熱量こそがあなたの魅力です。",
    goodMatch: "menloop",
    tool: { href: "/gacha", label: "今日のご飯決定ガチャ" },
    stations: ["新宿", "池袋", "横浜", "神田"],
  },
  teishoku: {
    id: "teishoku",
    name: "丁寧定食マイスター",
    emoji: "🍱",
    catchphrase: "一汁三菜。それは様式美であり、安らぎである。",
    description:
      "ごはん・味噌汁・主菜・小鉢のフォーメーションに心の平穏を見出すタイプ。流行に流されず、自分の「間違いない店」リストを静かに育てています。食べるスピードも落ち着いていて、ランチタイムすら丁寧に過ごせる大人の風格。派手さはないけれど、あなたの選ぶ店にハズレなし。後輩から「おすすめの店ありますか」と聞かれがちです。",
    goodMatch: "trendhunter",
    tool: { href: "/calorie", label: "外食カロリー＆PFC計算" },
    stations: ["神田", "新宿", "大宮", "池袋"],
  },
  trendhunter: {
    id: "trendhunter",
    name: "トレンドフードハッカー",
    emoji: "📱",
    catchphrase: "話題の店は、話題になる前に行く。",
    description:
      "SNSで話題の新店・限定メニュー・コラボグルメへの反応速度が異常に速いタイプ。「それもう行った」が口癖になりつつあります。行列も情報収集の時間と捉えるポジティブさがあり、食のトレンドを把握する力はもはやマーケター級。あなたの投稿がきっかけで店に行った人、確実にいます。2026年もその嗅覚で食シーンの最前線を走ってください。",
    goodMatch: "teishoku",
    tool: { href: "/waittime", label: "行列・待ち時間予測" },
    stations: ["渋谷", "原宿", "新大久保", "心斎橋"],
  },
  balancer: {
    id: "balancer",
    name: "鋼の健康バランサー",
    emoji: "🥗",
    catchphrase: "ガッツリは食べる。ただしPFCは計算済み。",
    description:
      "食べたいものを我慢しない代わりに、タンパク質・脂質・炭水化物のバランスをきっちり管理する理性派。サラダチキンと唐揚げ定食を同じ週に成立させる調整力があります。「健康のために我慢」ではなく「食べるために整える」という発想ができるため、長期的に一番おいしい人生を送れるタイプ。周囲の食生活アドバイザーになりがちです。",
    goodMatch: "nikushoku",
    tool: { href: "/calorie", label: "外食カロリー＆PFC計算" },
    stations: ["恵比寿", "新宿", "横浜", "名古屋"],
  },
};

export const MESHI_TYPE_ORDER: MeshiTypeId[] = [
  "dekamori",
  "cospa",
  "menloop",
  "nikushoku",
  "gekikara",
  "teishoku",
  "trendhunter",
  "balancer",
];

export const SHINDAN_QUESTIONS: ShindanQuestion[] = [
  {
    question: "ランチの店を選ぶとき、いちばん重視するのは？",
    choices: [
      { label: "量。大盛り無料は神", primary: "dekamori", secondary: "cospa" },
      { label: "値段。コスパがすべて", primary: "cospa", secondary: "teishoku" },
      { label: "話題性。新しい店に行きたい", primary: "trendhunter", secondary: "gekikara" },
      { label: "栄養バランス。PFCは見る", primary: "balancer", secondary: "teishoku" },
    ],
  },
  {
    question: "「一生ひとつしか食べられない」なら、どれを選ぶ？",
    choices: [
      { label: "麺。麺がない人生は無理", primary: "menloop", secondary: "gekikara" },
      { label: "肉。迷う余地なし", primary: "nikushoku", secondary: "dekamori" },
      { label: "白米。すべての主役", primary: "dekamori", secondary: "teishoku" },
      { label: "選べない。だから定食", primary: "teishoku", secondary: "balancer" },
    ],
  },
  {
    question: "SNSで行列のできる話題の新店を発見。どうする？",
    choices: [
      { label: "即ブックマーク、今週行く", primary: "trendhunter", secondary: "menloop" },
      { label: "並ぶくらいなら行きつけの店", primary: "teishoku", secondary: "cospa" },
      { label: "隣の空いてる店で大盛りを頼む", primary: "dekamori", secondary: "cospa" },
      { label: "落ち着いた頃に行く。賢く", primary: "balancer", secondary: "trendhunter" },
    ],
  },
  {
    question: "辛さ、どこまでいける？",
    choices: [
      { label: "激辛上等。辛さの向こう側へ", primary: "gekikara", secondary: "trendhunter" },
      { label: "中辛まで。旨辛が好き", primary: "menloop", secondary: "nikushoku" },
      { label: "辛味より塩とタレ", primary: "nikushoku", secondary: "dekamori" },
      { label: "辛いの苦手。優しい味がいい", primary: "teishoku", secondary: "balancer" },
    ],
  },
  {
    question: "給料日のご褒美ディナー、何にする？",
    choices: [
      { label: "焼肉。いい肉を焼く", primary: "nikushoku", secondary: "balancer" },
      { label: "食べ放題で限界に挑む", primary: "dekamori", secondary: "nikushoku" },
      { label: "話題のあの店を予約する", primary: "trendhunter", secondary: "gekikara" },
      { label: "ご褒美でも普段どおりが落ち着く", primary: "cospa", secondary: "teishoku" },
    ],
  },
  {
    question: "ラーメン屋でのあなたの行動に近いのは？",
    choices: [
      { label: "麺大盛り＋ライスは基本", primary: "dekamori", secondary: "menloop" },
      { label: "スープの系統から店を語れる", primary: "menloop", secondary: "trendhunter" },
      { label: "辛味増しトッピングを探す", primary: "gekikara", secondary: "menloop" },
      { label: "チャーシュー多めが正義", primary: "nikushoku", secondary: "dekamori" },
    ],
  },
  {
    question: "外食の会計のとき、考えていることは？",
    choices: [
      { label: "この量でこの値段、勝った", primary: "cospa", secondary: "dekamori" },
      { label: "今日のタンパク質摂取量の計算", primary: "balancer", secondary: "nikushoku" },
      { label: "次はあの店に行こうという計画", primary: "trendhunter", secondary: "menloop" },
      { label: "ごちそうさま。いい店だった", primary: "teishoku", secondary: "cospa" },
    ],
  },
  {
    question: "2026年、あなたの外食ライフの目標に近いのは？",
    choices: [
      { label: "メガ盛りチャレンジ制覇", primary: "dekamori", secondary: "gekikara" },
      { label: "コスパ最強店リストの完成", primary: "cospa", secondary: "teishoku" },
      { label: "トレンドグルメを誰より早く", primary: "trendhunter", secondary: "menloop" },
      { label: "食べたいものを食べて健康維持", primary: "balancer", secondary: "nikushoku" },
    ],
  },
];
