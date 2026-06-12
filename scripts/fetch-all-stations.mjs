/**
 * HeartRails Express API から全国の「都道府県 → 路線 → 駅」データを取得し、
 * data/stations.json として保存するスクリプト。
 *
 * 実行: node scripts/fetch-all-stations.mjs
 * （路線数分のAPIアクセスが発生するため、頻繁な再実行は避けること）
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const API = "https://express.heartrails.com/api/json";
const WAIT_MS = 150;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(params) {
  const url = `${API}?${new URLSearchParams(params)}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (attempt === 3) throw new Error(`取得失敗: ${url} (${e.message})`);
      await sleep(1000 * attempt);
    }
  }
}

async function main() {
  console.log("都道府県一覧を取得中...");
  const prefData = await getJson({ method: "getPrefectures" });
  const prefectures = prefData.response.prefecture;
  console.log(`${prefectures.length}都道府県`);

  // 路線名 → 都道府県の対応を収集（路線は複数県にまたがるため Set で持つ）
  const linePrefs = new Map();
  for (const pref of prefectures) {
    await sleep(WAIT_MS);
    const data = await getJson({ method: "getLines", prefecture: pref });
    const lines = data.response?.line ?? [];
    for (const line of lines) {
      if (!linePrefs.has(line)) linePrefs.set(line, new Set());
      linePrefs.get(line).add(pref);
    }
    console.log(`  ${pref}: ${lines.length}路線`);
  }
  console.log(`路線総数（重複除去後）: ${linePrefs.size}`);

  const lines = [];
  let stationCount = 0;
  let i = 0;
  for (const [lineName, prefs] of linePrefs) {
    i++;
    await sleep(WAIT_MS);
    const data = await getJson({ method: "getStations", line: lineName });
    const stations = (data.response?.station ?? []).map((s) => ({
      name: s.name,
      pref: s.prefecture,
      x: Number(s.x),
      y: Number(s.y),
    }));
    stationCount += stations.length;
    lines.push({ name: lineName, prefs: [...prefs], stations });
    if (i % 50 === 0) console.log(`  路線 ${i}/${linePrefs.size} 取得済み`);
  }

  const out = {
    updatedAt: new Date().toISOString().slice(0, 10),
    lines,
  };

  const outPath = path.join(process.cwd(), "data", "stations.json");
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(out), "utf8");

  const uniqueNames = new Set(lines.flatMap((l) => l.stations.map((s) => s.name)));
  console.log("--- 完了 ---");
  console.log(`路線: ${lines.length}`);
  console.log(`駅（延べ）: ${stationCount}`);
  console.log(`駅（ユニーク名）: ${uniqueNames.size}`);
  console.log(`出力: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
