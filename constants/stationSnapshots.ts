import rawSnapshots from "@/data/stationSnapshots.json";
import rawExtended from "@/data/stationSnapshotsExtended.json";
import type { GooglePlace } from "@/utils/restaurantHelpers";

/**
 * 駅の店舗スナップショット。サーバーサイド専用。
 *
 * スナップショットを持つ駅はランタイムで Places API を叩かず、ここから配信することで
 * APIコスト削減とAPI障害耐性を得る。ジャンルは保存せず GooglePlace の生データのみ持ち、
 * 表示時に getGenre（formatPlaceResult 経由）で導出する。
 *
 * 2つのソースをマージして配信する:
 *   - stationSnapshots.json … 主要110駅（編集部ガイド付き）。generate-station-snapshots.mjs が生成。
 *   - stationSnapshotsExtended.json … 110駅以外を優先度順に蓄積した分。snapshot-batch.mjs が生成。
 * 同名キーがあれば主要110駅を優先する。
 */
type SnapshotData = {
  generatedAt: string;
  stations: Record<string, GooglePlace[]>;
};

const snapshots = rawSnapshots as SnapshotData;
const extended = rawExtended as SnapshotData;

// 主要110駅を後勝ちにして優先（蓄積分と同名でも主要側の手当て済みデータを使う）
const stations: Record<string, GooglePlace[]> = {
  ...extended.stations,
  ...snapshots.stations,
};

/** 指定駅のスナップショット店舗一覧を返す（未生成・0件は undefined） */
export function getStationSnapshot(name: string): GooglePlace[] | undefined {
  const list = stations[name];
  return list && list.length > 0 ? list : undefined;
}

/** 主要110駅スナップショットの生成日（YYYY-MM-DD）。未生成なら空文字 */
export function getSnapshotGeneratedAt(): string {
  return snapshots.generatedAt;
}
