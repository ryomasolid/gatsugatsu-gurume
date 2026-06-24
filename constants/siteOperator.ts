/**
 * サイト運営者・編集部に関する情報の単一の出どころ。
 * about ページの運営者情報や、コラム記事の執筆者プロフィールなどから参照する。
 *
 * AdSense をはじめとする審査・SEO（E-E-A-T）では運営者の実在性・連絡可能性が
 * 重視されるため、ここを一元管理して各所に表示する。
 */
export const SITE_OPERATOR = {
  siteName: "ガツガツグルメ",
  siteNameEn: "GATSUGATSU GURUME",
  url: "https://gatsugatsu-gurume.com",
  /** 編集部としての名義 */
  editorialName: "ガツガツグルメ編集部",
  /**
   * 運営責任者の表示名。
   * TODO: 実名（または屋号）に差し替えると E-E-A-T がさらに強くなります。
   * 当面は連絡先と一致するハンドル名を表示しています。
   */
  representativeName: "ryomasolid",
  contactEmail: "ryomasolid@yahoo.co.jp",
  contactPath: "/contact",
  established: "2025年",
  /** 編集部・運営の紹介文 */
  bio: "「腹いっぱい食べたい」という本能に応えるために、駅周辺のがっつり系グルメ情報と、外食に役立つ無料ツール・コラムを制作・運営しています。デカ盛り・大盛り・高コスパのお店を、駅からの徒歩分数つきで紹介。掲載基準やデータの扱いの透明性を大切にしています。",
} as const;
