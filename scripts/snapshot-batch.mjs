/**
 * 主要110駅「以外」の駅スナップショットを、優先度順に "100駅ずつ" 蓄積するスクリプト。
 *
 * ねらい:
 *   - Places API の月間上限（Text Search Pro 5,000回など）を見ながら、一気にではなく
 *     バッチで少しずつ取得・蓄積する。
 *   - 取得先は data/snapshotCandidates.json（generate-snapshot-candidates.mjs が出力する
 *     優先度順リスト）。上から未取得の駅を BATCH_SIZE 件だけ処理する。
 *   - 結果は data/stationSnapshotsExtended.json に保存（主要110駅の stationSnapshots.json とは
 *     別ファイル。--force 再生成や四半期更新で蓄積分が消えないように分離）。
 *     ランタイムは constants/stationSnapshots.ts で両者をマージして配信する。
 *
 * 1駅ごとに保存するため、中断しても次回は続きから再開する（再開＝再実行するだけ）。
 *
 * 実行例:
 *   npm run snapshot:batch -- --dry-run     次の100駅と概算コール数だけ表示（API不使用）
 *   npm run snapshot:batch                  次の100駅を取得（既定 BATCH_SIZE=100）
 *   BATCH_SIZE=50 npm run snapshot:batch    50駅だけ
 *   MAX_TIER=3 npm run snapshot:batch       Tier3まで（路線数1本の長い裾野=Tier4を除外）
 *   SNAPSHOT_QUERY="定食 がっつり" npm run snapshot:batch   取得クエリを変更
 *
 *   コール数 = 取得駅数 × 1。100駅 = 100コール（1駅1コール固定。コスト重視）。
 *   1コールで最大20件まで取得する。
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ROOT,
  sleep,
  WAIT_MS,
  loadEnv,
  buildStationIndex,
  representative,
  fetchStationPlacesSingle,
} from "./lib/places.mjs";

const BATCH_SIZE = Math.max(1, Number(process.env.BATCH_SIZE) || 100);
const MAX_TIER = Math.min(4, Math.max(1, Number(process.env.MAX_TIER) || 4));
// 1駅1コールで投げる検索クエリ。サイトの核となる語「がっつり」を既定にする。
const QUERY = process.env.SNAPSHOT_QUERY || "がっつり";
const DRY_RUN = process.argv.includes("--dry-run");

const CAND_PATH = path.join(ROOT, "data", "snapshotCandidates.json");
const EXT_PATH = path.join(ROOT, "data", "stationSnapshotsExtended.json");
const MAIN_PATH = path.join(ROOT, "data", "stationSnapshots.json");

async function loadJsonOr(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function main() {
  const cand = await loadJsonOr(CAND_PATH, null);
  if (!cand?.candidates?.length) {
    console.error(
      "data/snapshotCandidates.json がありません。先に `npm run snapshot:candidates` を実行してください。"
    );
    process.exit(1);
  }

  // 取得済み = 主要110駅 + これまで蓄積した拡張分。両方をスキップ対象にする。
  const main = await loadJsonOr(MAIN_PATH, { stations: {} });
  const ext = await loadJsonOr(EXT_PATH, { stations: {} });
  const extStations = ext.stations ?? {};
  const done = new Set([
    ...Object.keys(main.stations ?? {}),
    ...Object.keys(extStations).filter((n) => extStations[n]?.length > 0),
  ]);

  // 優先度順（candidates は tier昇順→路線数降順で並んでいる）に未取得・Tier条件内を抽出
  const queue = cand.candidates.filter(
    (c) => c.tier <= MAX_TIER && !done.has(c.name)
  );
  const batch = queue.slice(0, BATCH_SIZE);

  const projected = batch.length; // 1駅1コール
  console.log(`候補総数(Tier<=${MAX_TIER}): ${queue.length} 件 / 蓄積済: ${Object.keys(extStations).length} 件`);
  console.log(
    `今回の対象: ${batch.length} 駅（1駅1コール・クエリ "${QUERY}" = 概算 ${projected} コール）`
  );
  if (batch.length === 0) {
    console.log("取得対象がありません。すべて取得済みか、Tier条件で除外されています。");
    return;
  }

  const preview = batch
    .map((c) => `${c.name}(T${c.tier}/${c.lines}線/${c.pref})`)
    .join("  ");
  console.log("対象駅:\n  " + preview);

  if (DRY_RUN) {
    console.log("\n[dry-run] API は呼び出していません。実行するには --dry-run を外してください。");
    return;
  }

  await loadEnv();
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_API_KEY が設定されていません（.env を確認）");
    process.exit(1);
  }

  const index = await buildStationIndex();

  const save = () =>
    writeFile(
      EXT_PATH,
      JSON.stringify(
        { generatedAt: new Date().toISOString().slice(0, 10), stations: extStations },
        null,
        0
      ),
      "utf8"
    );

  let totalCalls = 0;
  const missing = [];
  let i = 0;
  for (const c of batch) {
    i++;
    // 候補の県で座標解決を絞り、同名異駅の取り違えを防ぐ
    const rep = representative(index, c.name, new Set([c.pref]));
    if (!rep) {
      missing.push(c.name);
      console.warn(`  [${i}/${batch.length}] ${c.name}: 座標を解決できず スキップ`);
      continue;
    }

    await sleep(WAIT_MS); // レート対策の小休止
    const { list, calls } = await fetchStationPlacesSingle(apiKey, rep, QUERY);
    totalCalls += calls;
    extStations[c.name] = list;
    await save(); // 1駅ごとに保存：中断しても続きから再開できる
    console.log(
      `  [${i}/${batch.length}] ${c.name}: ${list.length} 件（累計 ${totalCalls} コール）`
    );
  }

  await save();
  const remaining = queue.length - batch.length;
  console.log("--- バッチ完了 ---");
  console.log(`今回取得: ${batch.length - missing.length} 駅 / 実コール数: ${totalCalls}`);
  console.log(`蓄積累計: ${Object.keys(extStations).length} 駅 / 残り候補(Tier<=${MAX_TIER}): ${remaining} 件`);
  if (missing.length) console.log(`座標未解決: ${missing.join(", ")}`);
  console.log(`出力: ${EXT_PATH}`);
  if (remaining > 0) {
    console.log("次のバッチは、使用量を確認のうえ同じコマンドを再実行してください。");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
