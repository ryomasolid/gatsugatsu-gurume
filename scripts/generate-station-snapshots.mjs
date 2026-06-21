/**
 * 主要駅（編集部ガイドを持つ駅）の「がっつり飯」店舗リストを Google Places API から
 * 一度だけ取得し、data/stationSnapshots.json として保存するスクリプト。
 *
 * ねらい:
 *   - 主要駅はランタイムで Places API を叩かず、このスナップショットを配信する
 *     （= 週次再生成のAPIコストを恒久ゼロ化＋API障害でも主力ページが落ちない）。
 *   - ジャンル判定は保存せず生データ(GooglePlace形状)のみ持つ。ジャンルは実行時に
 *     getGenre で導出するため、ここに GENRE_RULES を複製しない（単一ソース維持）。
 *
 * 110駅以外の駅を「使用量を見ながら100駅ずつ」蓄積したい場合は snapshot-batch.mjs を使う。
 * 取得ロジック（fetch/整形/座標解決）は scripts/lib/places.mjs に集約している。
 *
 * 実行: npm run snapshot   (内部で node scripts/generate-station-snapshots.mjs)
 *   GOOGLE_API_KEY は .env から読み込む。
 *   主要駅数 × キーワード数 ぶんの Places アクセスが発生するため、頻繁な再実行は避けること
 *   （鮮度更新は四半期ごと程度を想定）。
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  ROOT,
  resolveKeywords,
  loadEnv,
  buildStationIndex,
  representative,
  fetchStationPlaces,
} from "./lib/places.mjs";

const GATSURI_KEYWORDS = resolveKeywords();
const FORCE = process.argv.includes("--force"); // 既存スナップショットを無視して全再取得

/** constants/stationGuides.ts から主要駅名（オブジェクトのキー）を抽出する */
async function loadGuideStationNames() {
  const src = await readFile(
    path.join(ROOT, "constants", "stationGuides.ts"),
    "utf8"
  );
  const start = src.indexOf("= {");
  const body = src.slice(start, src.indexOf("\n};", start));
  const names = [];
  // 2スペースインデントの `駅名: "..."` 行を拾う（コメント `//` 行は除外）
  const re = /^ {2}([^\s/][^:]*?):\s*"/gm;
  let m;
  while ((m = re.exec(body)) !== null) names.push(m[1]);
  return names;
}

async function main() {
  await loadEnv();
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("GOOGLE_API_KEY が設定されていません（.env を確認）");
    process.exit(1);
  }

  const names = await loadGuideStationNames();
  const index = await buildStationIndex();
  const outPath = path.join(ROOT, "data", "stationSnapshots.json");

  // 既存スナップショットを読み込み、取得済みの駅は再開時にスキップする（--force で全再取得）
  const stations = {};
  if (!FORCE) {
    try {
      const prev = JSON.parse(await readFile(outPath, "utf8"));
      Object.assign(stations, prev.stations ?? {});
    } catch {
      /* 初回は無し */
    }
  }

  const todo = names.filter((n) => FORCE || !(stations[n]?.length > 0));
  console.log(
    `主要駅 ${names.length} 件中 ${todo.length} 件を取得します` +
      `（キーワード ${GATSURI_KEYWORDS.length} 語＝最大 ${todo.length * GATSURI_KEYWORDS.length} コール）`
  );

  const save = () =>
    writeFile(
      outPath,
      JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), stations }),
      "utf8"
    );

  const missing = [];
  let i = 0;
  for (const name of todo) {
    i++;
    const rep = representative(index, name);
    if (!rep) {
      missing.push(name);
      console.warn(`  [${i}/${todo.length}] ${name}: 座標を解決できず スキップ`);
      continue;
    }

    const { list } = await fetchStationPlaces(apiKey, rep, GATSURI_KEYWORDS);
    stations[name] = list;
    await save(); // 1駅ごとに保存：中断しても続きから再開できる
    console.log(`  [${i}/${todo.length}] ${name}: ${list.length} 件`);
  }

  await save();
  const total = Object.values(stations).reduce((a, l) => a + l.length, 0);
  console.log("--- 完了 ---");
  console.log(`駅: ${Object.keys(stations).length} / 店舗(延べ): ${total}`);
  if (missing.length) console.log(`座標未解決: ${missing.join(", ")}`);
  console.log(`出力: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
