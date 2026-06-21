import rawSnapshots from "@/data/stationSnapshots.json";
import type { GooglePlace } from "@/utils/restaurantHelpers";

/**
 * 主要駅（編集部ガイドを持つ駅）の店舗スナップショット。
 * scripts/generate-station-snapshots.mjs で生成・更新する。サーバーサイド専用。
 *
 * スナップショットを持つ駅はランタイムで Places API を叩かず、ここから配信することで
 * APIコスト削減とAPI障害耐性を得る。ジャンルは保存せず GooglePlace の生データのみ持ち、
 * 表示時に getGenre（formatPlaceResult 経由）で導出する。
 */
type SnapshotData = {
  generatedAt: string;
  stations: Record<string, GooglePlace[]>;
};

const snapshots = rawSnapshots as SnapshotData;

/** 指定駅のスナップショット店舗一覧を返す（未生成・0件は undefined） */
export function getStationSnapshot(name: string): GooglePlace[] | undefined {
  const list = snapshots.stations[name];
  return list && list.length > 0 ? list : undefined;
}

/** スナップショットの生成日（YYYY-MM-DD）。未生成なら空文字 */
export function getSnapshotGeneratedAt(): string {
  return snapshots.generatedAt;
}
