import { getGuideStationNames, getStationGuide } from "./stationGuides";

/**
 * 審査モード。
 *
 * AdSense 等の審査は、インデックス対象ページを「少数精鋭」にしたほうが
 * 通過しやすい傾向がある。審査期間中だけ true にすると、編集部ガイドを持つ
 * 駅のうち、特に内容が充実した主要駅（PRIORITY_STATIONS）だけを index 対象にし、
 * それ以外の駅は noindex（follow は維持）にする。
 *
 * 審査通過後は false に戻すと、従来どおりガイド付きの全駅が index 対象になる。
 */
export const REVIEW_MODE = true;

/**
 * 審査モード中に index 対象とする主要駅。
 * いずれも編集部ガイド（STATION_GUIDES）を持ち、店舗数・情報量が多い駅を厳選。
 */
export const PRIORITY_STATIONS: string[] = [
  // 東京（主要ターミナル・激戦区）
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
  "中野",
  "吉祥寺",
  "蒲田",
  "立川",
  "町田",
  // 神奈川・埼玉・千葉
  "横浜",
  "川崎",
  "大宮",
  "千葉",
  "船橋",
];

/**
 * 指定駅を index 対象にしてよいか。
 * 審査モード中は「ガイドあり かつ 主要駅」のみ true。
 */
export function isStationIndexable(stationName: string): boolean {
  if (getStationGuide(stationName) === undefined) return false;
  if (REVIEW_MODE) return PRIORITY_STATIONS.includes(stationName);
  return true;
}

/**
 * サイトマップに載せる（= index 対象の）駅名一覧。
 * 審査モード中は主要駅だけに絞る。
 */
export function getIndexableStationNames(): string[] {
  const names = getGuideStationNames();
  if (!REVIEW_MODE) return names;
  return names.filter((n) => PRIORITY_STATIONS.includes(n));
}
