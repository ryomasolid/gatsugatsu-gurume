import type { ColumnBlock } from "./columns";

/**
 * 編集部の「実食レポート」記事。
 *
 * サイトの独自性の核となる一次体験コンテンツ。実際に店舗を訪問し、
 * 自分で撮影した写真と実体験に基づいてのみ執筆する。
 *
 * 【絶対ルール】行っていない店のレポートを書かない。体験を創作しない。
 * 未訪問の内容は draft: true のまま公開しないこと。
 * （虚偽の体験談は AdSense ポリシー違反であると同時に読者への裏切りになる）
 *
 * 執筆手順は docs/REPORT_GUIDE.md を参照。
 */

export type ReportBlock = ColumnBlock;

export type Report = {
  slug: string;
  /** 記事タイトル（例: 「新宿・◯◯で"豚入り大"に挑んできた｜量・味・行列の実録」） */
  title: string;
  /** 一覧カード用の短いタイトル */
  cardTitle: string;
  description: string;
  emoji: string;
  /** 対応する駅名（/station/◯◯ と相互リンクされる。stations データの駅名と一致させる） */
  station: string;
  /** 訪問した店名 */
  shopName: string;
  /** ジャンル表記（ラーメン/定食/カレーなど） */
  genre: string;
  /** 実際に注文したメニュー */
  orderedItem: string;
  /** 実際に支払った金額（例: "1,050円"） */
  price: string;
  /** 実際に訪問した日 YYYY-MM-DD */
  visitedAt: string;
  updatedAt: string;
  readMinutes: number;
  /**
   * true の間は下書き扱い。
   * 一覧・トップページ・sitemap・駅ページのリンクに一切表示されず、
   * URL 直打ちでのみ noindex のプレビューとして閲覧できる。
   */
  draft: boolean;
  lead: string;
  /** 記事先頭に表示する自分で撮った写真（料理か外観） */
  heroImage?: { src: string; alt: string; caption?: string };
  blocks: ReportBlock[];
  /** 関連コラムの slug */
  relatedColumns: string[];
};

export const REPORTS: Report[] = [
  // ------------------------------------------------------------------
  // ▼ 執筆テンプレート（draft: true のため公開されません）
  //   実際に店舗を訪問したら、このオブジェクトをコピーして
  //   【】の箇所を実体験で埋め、写真を public/reports/<slug>/ に置き、
  //   最後に draft: false へ変更してください。詳細は docs/REPORT_GUIDE.md。
  // ------------------------------------------------------------------
  {
    slug: "_template",
    title: "【駅名】・【店名】で【メニュー名】を食べてきた｜量・味・混雑の実録レポ",
    cardTitle: "【店名】実食レポ",
    description:
      "【駅名】駅の【店名】を編集部が実際に訪問。【メニュー名】（【価格】）の量・味・提供スピード・混雑状況を写真つきでレポートします。",
    emoji: "🍜",
    station: "新宿",
    shopName: "【店名】",
    genre: "ラーメン",
    orderedItem: "【メニュー名】",
    price: "【0,000円】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 5,
    draft: true,
    lead: "【なぜこの店に行ったのか、どんな期待をしていたのかを2〜3文で。例: SNSで見かけた大盛り無料の看板が気になっていた、仕事帰りに寄れる立地だった、など動機を正直に書くと独自性が出ます】",
    heroImage: {
      src: "/reports/_template/hero.jpg",
      alt: "【店名】の【メニュー名】",
      caption: "【撮影日と一言。例: 2026年1月訪問。着丼直後の一杯】",
    },
    blocks: [
      { type: "heading", text: "店の場所と行き方" },
      {
        type: "p",
        text: "【駅のどの出口から何分歩いたか、目印、迷いやすいポイントを実体験で。Googleマップに書いていない「実際に歩いた感想」が価値になります】",
      },
      { type: "heading", text: "注文したもの" },
      {
        type: "p",
        text: "【券売機か口頭注文か、何を頼んだか、無料トッピングやサイズの選択肢、迷った点。値段はレシート基準で正確に】",
      },
      {
        type: "photo",
        src: "/reports/_template/food.jpg",
        alt: "【メニュー名】の全景",
        caption: "【量の伝わる一言。例: 丼の直径は顔より大きい】",
      },
      { type: "heading", text: "実食：量・味・食べきれるか" },
      {
        type: "p",
        text: "【一番大事なセクション。実際の量の体感（普通盛りの何倍か）、味の変化、後半つらくなったか、完食できたか、卓上調味料は使ったか。正直に書く。イマイチだった点も隠さないことが信頼につながります】",
      },
      { type: "heading", text: "混雑・回転・店内の様子" },
      {
        type: "p",
        text: "【訪問した曜日・時間帯と行列の有無、待ち時間、席のタイプ（カウンター/テーブル）、一人客の割合、滞在時間。次に行く人が知りたい実用情報を】",
      },
      { type: "heading", text: "まとめ：どんな人におすすめか" },
      {
        type: "p",
        text: "【総評。どんな空腹度・シーンの人に向くか、リピートするか、次は何を頼みたいか】",
      },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["dekamori-kanshoku", "jiro-kei-guide"],
  },

  // ------------------------------------------------------------------
  // ▼ 店別の準備済み下書き（すべて draft: true、未訪問）
  //   編集部が訪問候補として選んだ実在の掲載店10店。店の背景解説・構成・
  //   執筆プロンプトまで準備済み。訪問したら【】を実体験で埋め、
  //   写真を public/reports/<slug>/ に置き、draft: false にして公開する。
  //   ※【】が1つでも残った状態で draft: false にしないこと。
  // ------------------------------------------------------------------
  {
    slug: "ikebukuro-ramen-jiro",
    title: "池袋・ラーメン二郎 池袋東口店で【メニュー】に挑んできた｜量・コール・行列の実録",
    cardTitle: "ラーメン二郎 池袋東口店 実食レポ",
    description:
      "二郎直系の池袋東口店を編集部が実際に訪問。【メニュー】（【価格】）の量の体感、コールの実際、行列と回転を写真つきでレポートします。",
    emoji: "🍜",
    station: "池袋",
    shopName: "ラーメン二郎 池袋東口店",
    genre: "ラーメン",
    orderedItem: "【例: 小ラーメン（豚入りにしたかどうかも）】",
    price: "【券売機で払った額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 6,
    draft: true,
    lead: "【訪問の動機を正直に。例: 当サイトで二郎系初心者ガイドを書いておきながら、直系の実食記録がないのはまずいだろうということで、編集部が池袋東口店に並んできました——のような書き出しが自然です】",
    heroImage: {
      src: "/reports/ikebukuro-ramen-jiro/hero.jpg",
      alt: "ラーメン二郎 池袋東口店の一杯",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "ラーメン二郎 池袋東口店とはどんな店か" },
      {
        type: "p",
        text: "三田本店から暖簾分けされた直系「ラーメン二郎」の一つで、池袋東口の繁華街からほど近い場所に構える。極太麺・非乳化〜微乳化の豚骨醤油・山盛りのヤサイという二郎の文法はここでも健在で、都心からのアクセスの良さもあって、初めて直系に挑む人の名前がよく挙がる店でもある。無料トッピングは提供直前の「コール」で申告する方式だ。",
      },
      { type: "heading", text: "行列と入店までの流れ" },
      {
        type: "p",
        text: "【並び始めた時刻・前に何人・着席まで何分・食券を買うタイミング・並び方のローカルルール（店員の案内があったか）を実録で。行く前に一番知りたい情報です】",
      },
      { type: "heading", text: "注文とコール" },
      {
        type: "p",
        text: "【買った食券、麺量を聞かれたときのやり取り、実際のコール内容（例: ニンニク少なめヤサイそのまま）と、その結果どんな盛りで出てきたか】",
      },
      {
        type: "photo",
        src: "/reports/ikebukuro-ramen-jiro/food.jpg",
        alt: "着丼直後の全景",
        caption: "【ヤサイの高さなど量が伝わる一言】",
      },
      { type: "heading", text: "実食：量の体感と完食できたか" },
      {
        type: "p",
        text: "【普通のラーメンの何倍に感じたか、麺・スープ・豚の感想、後半の失速、卓上調味料、完食可否と所要時間。正直に】",
      },
      { type: "heading", text: "まとめ：初挑戦の人へのアドバイス" },
      {
        type: "p",
        text: "【自分の体験から言える具体的な助言（狙い目の時間帯、無難な注文、心構え）】",
      },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["jiro-kei-guide", "dekamori-kanshoku"],
  },
  {
    slug: "yokohama-yoshimuraya",
    title: "横浜・家系総本山 吉村家で【メニュー】を食べてきた｜発祥の一杯と行列の実録",
    cardTitle: "家系総本山 吉村家 実食レポ",
    description:
      "家系ラーメン発祥の総本山・吉村家を編集部が実際に訪問。【メニュー】（【価格】）の味、ライスとの組み合わせ、行列の実態を写真つきでレポートします。",
    emoji: "🍜",
    station: "横浜",
    shopName: "家系総本山 吉村家",
    genre: "ラーメン",
    orderedItem: "【例: ラーメン並＋ライス、好みの指定も】",
    price: "【支払額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 6,
    draft: true,
    lead: "【動機を正直に。例: 全国に数千店あるといわれる家系の「原点」を食べずに家系を語れない、と思い立って横浜へ——など】",
    heroImage: {
      src: "/reports/yokohama-yoshimuraya/hero.jpg",
      alt: "吉村家のラーメン",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "吉村家とはどんな店か" },
      {
        type: "p",
        text: "1974年創業。豚骨醤油スープ×太麺×ほうれん草・チャーシュー・海苔という「家系ラーメン」のスタイルを生み出した発祥の店であり、全国に広がった家系すべての総本山にあたる。麺の硬さ・味の濃さ・油の量を好みで指定できるのも家系文化の原点で、スープに海苔を浸してライスを巻く食べ方は今や全国区の作法になった。行列店として知られ、並ぶこと自体が名物のような存在でもある。",
      },
      { type: "heading", text: "行列の実態" },
      {
        type: "p",
        text: "【並んだ曜日・時刻・待ち時間・列の進み方・食券や整理の方式。「実際どのくらい待つのか」が読者の最大の関心事です】",
      },
      { type: "heading", text: "注文と好みの指定" },
      {
        type: "p",
        text: "【注文内容と「硬め・濃いめ・多め」等の指定をどうしたか、ライスを付けたか】",
      },
      {
        type: "photo",
        src: "/reports/yokohama-yoshimuraya/food.jpg",
        alt: "着丼直後の全景",
        caption: "【一言】",
      },
      { type: "heading", text: "実食：総本山の一杯はどうだったか" },
      {
        type: "p",
        text: "【スープ・麺・チャーシューの感想、普段食べる家系チェーンとの違いの体感、海苔ライスをやったか、満腹度。正直に】",
      },
      { type: "heading", text: "まとめ：並んでも行く価値はあるか" },
      { type: "p", text: "【自分の結論。どんな人なら並ぶ価値があるか】" },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["ramen-genre-zukan", "kuchikomi-mikata"],
  },
  {
    slug: "shinjuku-sutameshi-dondon",
    title: "新宿・情熱のすためしどんどんで【メニュー】をかき込んできた｜スタ丼の実録",
    cardTitle: "すためしどんどん 新宿 実食レポ",
    description:
      "スタミナ丼の老舗系列・情熱のすためしどんどん（新宿東口アルタ裏店）を編集部が実際に訪問。【メニュー】（【価格】）の量・味・提供スピードを写真つきでレポートします。",
    emoji: "🍚",
    station: "新宿",
    shopName: "情熱のすためしどんどん 新宿東口アルタ裏店",
    genre: "スタミナ丼",
    orderedItem: "【例: すためし並/大盛、トッピング】",
    price: "【支払額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 5,
    draft: true,
    lead: "【動機。例: 安く早く米で満たすなら丼だろう、ということで歌舞伎町の入り口にあるこの店へ——など】",
    heroImage: {
      src: "/reports/shinjuku-sutameshi-dondon/hero.jpg",
      alt: "すためしどんどんのスタミナ丼",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "すためしどんどんとはどんな店か" },
      {
        type: "p",
        text: "ニンニクの効いた甘辛ダレの豚バラ肉を白米に載せた「スタミナ丼（すためし）」を看板にする老舗系列。生卵を絡めて一気にかき込むスタイルで、深夜帯まで営業する店舗が多く、新宿では飲んだ後のシメや夜勤前後の食事としても定着している。丼一つで完結する潔さと提供の速さが身上だ。",
      },
      { type: "heading", text: "店の場所と入りやすさ" },
      {
        type: "p",
        text: "【新宿駅からの実際の徒歩ルートと分数、店の広さ・カウンターの様子、一人でも入りやすいか】",
      },
      { type: "heading", text: "注文と提供スピード" },
      {
        type: "p",
        text: "【注文方式、頼んだサイズ、着丼までの実測時間。「早さ」はこの店の核なので体感を具体的に】",
      },
      {
        type: "photo",
        src: "/reports/shinjuku-sutameshi-dondon/food.jpg",
        alt: "スタミナ丼の全景",
        caption: "【一言】",
      },
      { type: "heading", text: "実食：量・味・ニンニクの効き" },
      {
        type: "p",
        text: "【米と肉のバランス、タレの濃さ、生卵の効果、並/大盛の量の体感、翌日のニンニク残り具合まで正直に】",
      },
      { type: "heading", text: "まとめ：どんなシーンに向くか" },
      { type: "p", text: "【自分の結論と再訪意向】" },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["gyudon-tsukaikonashi", "asagatsuri"],
  },
  {
    slug: "akihabara-pancho",
    title: "秋葉原・スパゲッティーのパンチョで【サイズ】ナポリタンに挑んできた｜大盛り文化の実録",
    cardTitle: "パンチョ 秋葉原 実食レポ",
    description:
      "大盛りナポリタンの代名詞・スパゲッティーのパンチョ（秋葉原昭和通り口店）を編集部が実際に訪問。【サイズ】（【価格】）の麺量の体感と完食の記録を写真つきでレポートします。",
    emoji: "🍝",
    station: "秋葉原",
    shopName: "スパゲッティーのパンチョ 秋葉原昭和通り口店",
    genre: "ナポリタン",
    orderedItem: "【例: ナポリタン（サイズ）＋トッピング】",
    price: "【支払額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 5,
    draft: true,
    lead: "【動機。例: 「炭水化物でがっつり」の代表格を体を張って確かめるべく、サイズ表の上の方に挑戦——など】",
    heroImage: {
      src: "/reports/akihabara-pancho/hero.jpg",
      alt: "パンチョのナポリタン",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "パンチョとはどんな店か" },
      {
        type: "p",
        text: "昔ながらの喫茶店スタイルの太麺ナポリタン・ミートソースを専門にするチェーンで、麺量をサイズで大きく増やせる「大盛り文化」の代名詞的存在。もちもちの極太麺と鉄板の懐かしい味付けで、炭水化物を正面から浴びたい日の受け皿として支持されている。",
      },
      { type: "heading", text: "サイズ選びと注文" },
      {
        type: "p",
        text: "【サイズ体系がどうなっていたか、自分が選んだサイズと理由、トッピング。サイズ選びの迷いどころは読者に一番役立つ部分です】",
      },
      {
        type: "photo",
        src: "/reports/akihabara-pancho/food.jpg",
        alt: "ナポリタンの全景",
        caption: "【皿の大きさが伝わる一言】",
      },
      { type: "heading", text: "実食：麺量の体感と完食の記録" },
      {
        type: "p",
        text: "【茹で前グラム表記と実際の体感の差、味変（粉チーズ・タバスコ）の効果、後半戦の苦しさ、完食可否と所要時間】",
      },
      { type: "heading", text: "混雑・客層・居心地" },
      {
        type: "p",
        text: "【訪問時間帯の混み具合、一人客の割合、回転の速さ】",
      },
      { type: "heading", text: "まとめ：次に行く人へのサイズ助言" },
      { type: "p", text: "【体験に基づく「初回はこのサイズが無難」という具体的助言】" },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["dekamori-kanshoku", "gatsuri-calorie"],
  },
  {
    slug: "tokyo-kaminari",
    title: "東京駅・雷 東京本丸店で【メニュー】を食べてきた｜とみ田系の豪快な一杯の実録",
    cardTitle: "雷 東京本丸店 実食レポ",
    description:
      "松戸の名店「中華蕎麦とみ田」系列の豪快豚ラーメン業態・雷（東京駅構内）を編集部が実際に訪問。【メニュー】（【価格】）の量・味・駅ナカの回転を写真つきでレポートします。",
    emoji: "🍜",
    station: "東京",
    shopName: "雷 東京本丸店",
    genre: "ラーメン",
    orderedItem: "【例: 雷そば（サイズ）】",
    price: "【支払額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 5,
    draft: true,
    lead: "【動機。例: 新幹線の乗車前に駅ナカで「名門のがっつり」が本当に成立するのか確かめに——など】",
    heroImage: {
      src: "/reports/tokyo-kaminari/hero.jpg",
      alt: "雷の一杯",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "雷とはどんな店か" },
      {
        type: "p",
        text: "つけ麺の頂点として名前の挙がる松戸「中華蕎麦とみ田」の系列が手がける、豚骨醤油×極太麺の豪快な二郎インスパイア業態。名門の製麺技術を土台にしたワシワシの麺と濃いめのスープで「とみ田系のがっつり枠」として知られる。東京本丸店は東京駅構内にあり、移動の合間に名門系列の一杯を挟めるのが最大の特徴だ。",
      },
      { type: "heading", text: "駅構内でのアクセスと行列" },
      {
        type: "p",
        text: "【改札内外どちらか、何口から何分か、行列と回転の実測。新幹線までの残り時間で入れるかの判断材料を具体的に】",
      },
      { type: "heading", text: "注文したもの" },
      {
        type: "p",
        text: "【券売機の構成、選んだメニューとサイズ、無料トッピングの有無とやり取り】",
      },
      {
        type: "photo",
        src: "/reports/tokyo-kaminari/food.jpg",
        alt: "着丼直後の全景",
        caption: "【一言】",
      },
      { type: "heading", text: "実食：量・麺・スープ" },
      {
        type: "p",
        text: "【麺の食感（とみ田系らしさを感じたか）、スープの濃度、量の体感、完食までの時間。正直に】",
      },
      { type: "heading", text: "まとめ：乗車前がっつりの選択肢としてどうか" },
      { type: "p", text: "【所要時間込みの結論。時間に余裕がない人への助言】" },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["ramen-genre-zukan", "dekamori-kanshoku"],
  },
  {
    slug: "shimbashi-musashiya",
    title: "新橋・むさしやでナポリタンを食べてきた｜駅前ビルの老舗スタンドの実録",
    cardTitle: "むさしや 新橋 実食レポ",
    description:
      "新橋駅前ビルの老舗洋食スタンド・むさしやを編集部が実際に訪問。名物ナポリタン（【価格】）の味・量・行列と、立ち食い文化の空気を写真つきでレポートします。",
    emoji: "🍝",
    station: "新橋",
    shopName: "むさしや",
    genre: "洋食",
    orderedItem: "【例: ナポリタン（目玉焼きのせ等）】",
    price: "【支払額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 5,
    draft: true,
    lead: "【動機。例: サラリーマンの聖地・新橋の象徴のような店を一度体験しておきたかった——など】",
    heroImage: {
      src: "/reports/shimbashi-musashiya/hero.jpg",
      alt: "むさしやのナポリタン",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "むさしやとはどんな店か" },
      {
        type: "p",
        text: "新橋駅前ビルの一角で長年営業を続ける洋食スタンド。鉄板で仕上げるナポリタンを目当てに行列ができることで知られ、昭和の空気を残す新橋のランチ文化を象徴する存在としてメディアにもたびたび登場する。カウンター中心の店構えで、回転の速さも持ち味だ。",
      },
      { type: "heading", text: "場所と行列" },
      {
        type: "p",
        text: "【駅前ビルのどこにあるか（初見で迷わない説明）、並んだ時刻と待ち時間、列のさばかれ方】",
      },
      {
        type: "photo",
        src: "/reports/shimbashi-musashiya/food.jpg",
        alt: "ナポリタンの全景",
        caption: "【一言】",
      },
      { type: "heading", text: "実食：味・量・提供の速さ" },
      {
        type: "p",
        text: "【注文から提供までの体感、味の感想、量は足りたか、食べ終えるまでの滞在時間】",
      },
      { type: "heading", text: "まとめ：行列に並ぶ価値はあるか" },
      { type: "p", text: "【自分の結論。おすすめの時間帯】" },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["kosupa-lunch", "solo-gaishoku"],
  },
  {
    slug: "ueno-chinchinken",
    title: "上野・珍々軒でガード下の町中華を食べてきた｜昼から賑わう老舗の実録",
    cardTitle: "珍々軒 上野 実食レポ",
    description:
      "上野ガード下の老舗町中華・珍々軒を編集部が実際に訪問。【メニュー】（【価格】）の味と量、アメ横の喧騒ごと味わう店の空気を写真つきでレポートします。",
    emoji: "🥟",
    station: "上野",
    shopName: "珍々軒",
    genre: "町中華",
    orderedItem: "【例: チャーハン＋餃子など実際の注文】",
    price: "【支払額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 5,
    draft: true,
    lead: "【動機。例: 上野の「安くて多い」文化の原風景を見たくてガード下へ——など】",
    heroImage: {
      src: "/reports/ueno-chinchinken/hero.jpg",
      alt: "珍々軒の料理",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "珍々軒とはどんな店か" },
      {
        type: "p",
        text: "上野〜御徒町のガード下、アメ横の喧騒の中で長年営業を続ける老舗の町中華。頭上を電車が走る開放的な店先で、昼からラーメンや炒め物と一緒に一杯やる客の姿が絶えない、下町・上野を象徴する一軒だ。観光地化した上野にあって、地元の空気をそのまま残している。",
      },
      { type: "heading", text: "場所と席の様子" },
      {
        type: "p",
        text: "【駅からの実ルート、店先の席の雰囲気、一人でも入りやすいか、注文の仕方】",
      },
      {
        type: "photo",
        src: "/reports/ueno-chinchinken/food.jpg",
        alt: "注文した料理の全景",
        caption: "【一言】",
      },
      { type: "heading", text: "実食：味・量・値段のバランス" },
      {
        type: "p",
        text: "【頼んだものそれぞれの感想、量の体感、支払額に対する満足度。正直に】",
      },
      { type: "heading", text: "まとめ：どんな使い方が合う店か" },
      { type: "p", text: "【観光ついで/昼飲み/がっつり飯、自分の体験からの結論】" },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["solo-gaishoku", "kosupa-lunch"],
  },
  {
    slug: "takadanobaba-suehiro",
    title: "高田馬場・末廣ラーメン本舗で真っ黒な一杯とヤキメシを食べてきた｜実録",
    cardTitle: "末廣ラーメン本舗 高田馬場 実食レポ",
    description:
      "秋田発祥・京都新福菜館の流れを汲む末廣ラーメン本舗（高田馬場分店）を編集部が実際に訪問。名物の真っ黒な中華そばとヤキメシのセット（【価格】）を写真つきでレポートします。",
    emoji: "🍜",
    station: "高田馬場",
    shopName: "末廣ラーメン本舗 高田馬場分店",
    genre: "ラーメン",
    orderedItem: "【例: 中華そば並＋ヤキメシ小】",
    price: "【支払額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 5,
    draft: true,
    lead: "【動機。例: 見た目は濃そうで実は…と言われる「黒い中華そば」の正体を確かめに——など】",
    heroImage: {
      src: "/reports/takadanobaba-suehiro/hero.jpg",
      alt: "末廣ラーメン本舗の中華そばとヤキメシ",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "末廣ラーメン本舗とはどんな店か" },
      {
        type: "p",
        text: "秋田発祥で、京都の老舗「新福菜館」の流れを汲むことで知られる系列。醤油の色がスープ一面に広がる真っ黒な見た目の中華そばと、同じく黒いヤキメシの組み合わせが名物で、見た目のインパクトに反して食べやすい味わいと評されることが多い。麺とメシを一度に楽しむ「セットでがっつり」の型が確立している。",
      },
      { type: "heading", text: "店の場所と入店" },
      {
        type: "p",
        text: "【駅からの実ルートと分数、店内の広さ、注文方式、卓上の無料トッピング（ネギ等）があったか】",
      },
      {
        type: "photo",
        src: "/reports/takadanobaba-suehiro/food.jpg",
        alt: "中華そばとヤキメシのセット",
        caption: "【黒さが伝わる一言】",
      },
      { type: "heading", text: "実食：見た目と味のギャップ" },
      {
        type: "p",
        text: "【スープの実際の塩加減・味の印象、ヤキメシとの相性、セットの量の体感、完食できたか】",
      },
      { type: "heading", text: "まとめ：学生街・馬場での立ち位置" },
      { type: "p", text: "【ワセメシ激戦区の中でどう使うのが良いか、自分の結論】" },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["ramen-genre-zukan", "kosupa-lunch"],
  },
  {
    slug: "tachikawa-mashimashi",
    title: "立川・立川マシマシ 総本店で【メニュー】に挑んできた｜マシライスの実録",
    cardTitle: "立川マシマシ 実食レポ",
    description:
      "二郎インスパイア系の人気店・立川マシマシ（立川総本店）を編集部が実際に訪問。名物【メニュー】（【価格】）の量・味・攻めたメニュー構成を写真つきでレポートします。",
    emoji: "🍚",
    station: "立川",
    shopName: "立川マシマシ 立川総本店",
    genre: "ラーメン",
    orderedItem: "【例: マシライス（サイズ）or ラーメン小】",
    price: "【支払額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 5,
    draft: true,
    lead: "【動機。例: 「ラーメン屋なのにライスが名物」という逆転現象を確かめるべく立川へ——など】",
    heroImage: {
      src: "/reports/tachikawa-mashimashi/hero.jpg",
      alt: "立川マシマシの一品",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "立川マシマシとはどんな店か" },
      {
        type: "p",
        text: "店名の通り二郎インスパイア系の文法で人気を集める店。極太麺のラーメンに加え、二郎的な豚とタレの世界観を白米の上で展開する「マシライス」という独自メニューで広く知られ、麺かライスかを選べる懐の深さが特徴だ。多摩エリアのがっつり勢の定番として、遠征してくるファンも多い。",
      },
      { type: "heading", text: "注文：麺かマシライスか" },
      {
        type: "p",
        text: "【券売機の構成と迷いどころ、選んだメニューとサイズ、コール的な調整があったか】",
      },
      {
        type: "photo",
        src: "/reports/tachikawa-mashimashi/food.jpg",
        alt: "注文品の全景",
        caption: "【一言】",
      },
      { type: "heading", text: "実食：量・味・独自性" },
      {
        type: "p",
        text: "【量の体感、味の感想（二郎系としての濃度、マシライスなら米との一体感）、完食可否】",
      },
      { type: "heading", text: "混雑と回転" },
      { type: "p", text: "【訪問時間帯の行列・待ち時間・客層】" },
      { type: "heading", text: "まとめ：麺派とライス派それぞれへの助言" },
      { type: "p", text: "【体験に基づく結論】" },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["jiro-kei-guide", "dekamori-kanshoku"],
  },
  {
    slug: "shibuya-vegiro",
    title: "渋谷・ベジ郎で二郎系の肉野菜炒め定食を食べてきた｜麺なし二郎の実録",
    cardTitle: "ベジ郎 渋谷総本店 実食レポ",
    description:
      "二郎系の世界観を肉野菜炒め定食にした「ベジ郎」渋谷総本店を編集部が実際に訪問。【サイズ】（【価格】）の野菜量・味・満腹度を写真つきでレポートします。",
    emoji: "🥬",
    station: "渋谷",
    shopName: "二郎系定食 肉野菜炒めベジ郎 渋谷総本店",
    genre: "定食",
    orderedItem: "【例: 肉野菜炒め定食（サイズ・トッピング）】",
    price: "【支払額】",
    visitedAt: "2026-01-01",
    updatedAt: "2026-01-01",
    readMinutes: 5,
    draft: true,
    lead: "【動機。例: 「二郎は食べたい、でも麺は重い」という矛盾に応える店があると聞いて——など】",
    heroImage: {
      src: "/reports/shibuya-vegiro/hero.jpg",
      alt: "ベジ郎の肉野菜炒め定食",
      caption: "【訪問月と一言】",
    },
    blocks: [
      { type: "heading", text: "ベジ郎とはどんな店か" },
      {
        type: "p",
        text: "ヤサイマシ・ニンニク・背脂という二郎系の文法を、麺ではなく肉野菜炒め定食に持ち込んだ変化球の業態。山盛りの野菜と豚肉を白米で受け止めるスタイルで、「がっつり食べたいが麺の炭水化物は控えたい」という層の受け皿として注目されている。増量やトッピングの構成にも二郎的な語彙が生きている。",
      },
      { type: "heading", text: "注文とサイズ・トッピング" },
      {
        type: "p",
        text: "【サイズ体系と選んだ量、ニンニク等のトッピング指定、ライスの量の選択】",
      },
      {
        type: "photo",
        src: "/reports/shibuya-vegiro/food.jpg",
        alt: "肉野菜炒め定食の全景",
        caption: "【野菜の山の高さが伝わる一言】",
      },
      { type: "heading", text: "実食：野菜の量・味・満腹度" },
      {
        type: "p",
        text: "【野菜の量の体感、タレの味、米との相性、「二郎欲」は満たされたか、食後の重さは麺と比べてどうか】",
      },
      { type: "heading", text: "まとめ：どんな人に刺さる店か" },
      { type: "p", text: "【自分の結論。二郎経験者/未経験者それぞれへの目線で】" },
      {
        type: "note",
        text: "本記事は編集部が実際に訪問した時点の体験に基づきます。価格・メニュー・営業時間は変更される場合があるため、最新情報は店舗にご確認ください。",
      },
    ],
    relatedColumns: ["jiro-kei-guide", "gatsuri-calorie"],
  },
];

/** 公開済み（draft でない）レポートを新しい順で返す */
export function getPublishedReports(): Report[] {
  return REPORTS.filter((r) => !r.draft).sort((a, b) =>
    b.visitedAt.localeCompare(a.visitedAt)
  );
}

/** slug からレポートを返す（draft も含む。ページ側でプレビュー表示に使う） */
export function getReport(slug: string): Report | undefined {
  return REPORTS.find((r) => r.slug === slug);
}

/** sitemap・静的生成に使う公開済み slug 一覧 */
export function getPublishedReportSlugs(): string[] {
  return getPublishedReports().map((r) => r.slug);
}

/** 指定駅の公開済みレポート一覧（駅ページからの相互リンクに使う） */
export function getReportsByStation(stationName: string): Report[] {
  return getPublishedReports().filter((r) => r.station === stationName);
}
