/**
 * 一時的に店舗データの提供を止める「メンテナンスモード」かどうか。
 *
 * 有効時（環境変数 MAINTENANCE_MODE="true"）は Places API を叩かず、
 * 店舗一覧の代わりにメンテナンス文言を表示する。
 * スナップショット（主要駅のローカルデータ）を持つ駅は API を使わないため、
 * メンテナンスモードでも従来どおり表示できる。
 */
export function isMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE === "true";
}
