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
