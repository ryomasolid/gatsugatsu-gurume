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
 * 実行: npm run snapshot   (内部で node scripts/generate-station-snapshots.mjs)
 *   GOOGLE_API_KEY は .env から読み込む。
 *   主要駅数 × キーワード数 ぶんの Places アクセスが発生するため、頻繁な再実行は避けること
 *   （鮮度更新は四半期ごと程度を想定）。
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";
const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.primaryType";
// app/api/restaurants/helpers.ts の GATSURI_KEYWORDS と対応。
// ランタイムは毎回ランダムに1語だけ使うが、スナップショットは全語を叩いて
// id で重複排除し、安定した充実リストを作る。
const ALL_KEYWORDS = ["ラーメン", "定食", "中華", "カレー", "牛丼", "丼"];
// SNAPSHOT_KEYWORDS=2 のように指定すると先頭N語だけ使い、総コール数を 110×N に抑える。
const KEYWORD_COUNT = Math.min(
  Math.max(1, Number(process.env.SNAPSHOT_KEYWORDS) || ALL_KEYWORDS.length),
  ALL_KEYWORDS.length
);
const GATSURI_KEYWORDS = ALL_KEYWORDS.slice(0, KEYWORD_COUNT);
const MAX_PER_STATION = 20; // 1駅あたりの最大掲載件数
const OFFSET = 0.009; // placesClient.ts と同じ矩形範囲
const WAIT_MS = 200;
const MAX_RETRY = 5; // 429/5xx の再試行回数
const FORCE = process.argv.includes("--force"); // 既存スナップショットを無視して全再取得

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** .env を読み込んで process.env に反映（未設定のキーのみ） */
async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, ".env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* .env が無くても環境変数があれば動く */
  }
}

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

/** data/stations.json から駅名→代表駅(座標)の解決インデックスを構築 */
async function buildStationIndex() {
  const data = JSON.parse(
    await readFile(path.join(ROOT, "data", "stations.json"), "utf8")
  );
  const index = new Map();
  for (const line of data.lines) {
    for (const st of line.stations) {
      const variants = index.get(st.name) ?? [];
      // 同名・同県・近接（約2km以内）は同一駅とみなし路線を束ねる（utils/stationData.ts と同ロジック）
      const existing = variants.find(
        (v) =>
          v.pref === st.pref &&
          Math.abs(v.y - st.y) < 0.02 &&
          Math.abs(v.x - st.x) < 0.02
      );
      if (existing) {
        existing.lines.add(line.name);
      } else {
        variants.push({
          pref: st.pref,
          x: st.x,
          y: st.y,
          lines: new Set([line.name]),
        });
      }
      index.set(st.name, variants);
    }
  }
  return index;
}

function representative(index, name) {
  const variants = index.get(name);
  if (!variants || variants.length === 0) return null;
  // 乗り入れ路線数が最も多いものを代表とする
  return [...variants].sort((a, b) => b.lines.size - a.lines.size)[0];
}

async function fetchPlaces(apiKey, query, lat, lng) {
  const body = {
    textQuery: query,
    languageCode: "ja",
    maxResultCount: 10,
    locationRestriction: {
      rectangle: {
        low: { latitude: lat - OFFSET, longitude: lng - OFFSET },
        high: { latitude: lat + OFFSET, longitude: lng + OFFSET },
      },
    },
  };

  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    const res = await fetch(PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const data = await res.json();
      return data.places ?? [];
    }

    // 429（レート上限）・5xx は時間を置いて再試行。それ以外は即エラー。
    if (res.status === 429 || res.status >= 500) {
      if (attempt === MAX_RETRY) {
        throw new Error(`Places API HTTP ${res.status}（${MAX_RETRY}回再試行後も失敗）`);
      }
      // per-minute 制限を回復させるため長めに待つ（10s, 20s, 40s, 80s...）
      const backoff = 10000 * 2 ** (attempt - 1);
      console.log(`    HTTP ${res.status} → ${backoff / 1000}s 待って再試行 (${attempt}/${MAX_RETRY - 1})`);
      await sleep(backoff);
      continue;
    }

    const err = await res.text().catch(() => "");
    throw new Error(`Places API HTTP ${res.status}: ${err.slice(0, 200)}`);
  }
  return [];
}

/** GooglePlaceSchema（utils/restaurantHelpers.ts）に対応する最小限の整形・検証 */
function normalizePlace(p) {
  if (
    !p?.id ||
    !p?.displayName?.text ||
    !p?.formattedAddress ||
    typeof p?.location?.latitude !== "number" ||
    typeof p?.location?.longitude !== "number"
  ) {
    return null;
  }
  return {
    id: p.id,
    displayName: { text: p.displayName.text },
    formattedAddress: p.formattedAddress,
    types: Array.isArray(p.types) ? p.types : [],
    ...(p.primaryType ? { primaryType: p.primaryType } : {}),
    location: { latitude: p.location.latitude, longitude: p.location.longitude },
  };
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

    const byId = new Map();
    for (const keyword of GATSURI_KEYWORDS) {
      await sleep(WAIT_MS);
      try {
        const places = await fetchPlaces(apiKey, `${keyword} がっつり`, rep.y, rep.x);
        for (const raw of places) {
          const norm = normalizePlace(raw);
          if (norm && !byId.has(norm.id)) byId.set(norm.id, norm);
        }
      } catch (e) {
        console.warn(`  ${name} / "${keyword}": ${e.message}`);
      }
    }

    const list = [...byId.values()].slice(0, MAX_PER_STATION);
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
