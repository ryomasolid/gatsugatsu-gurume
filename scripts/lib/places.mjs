/**
 * スナップショット生成スクリプト群の共有ライブラリ。
 * Google Places API（Text Search）の呼び出し・整形・駅座標解決をここに集約し、
 * generate-station-snapshots.mjs（主要110駅）と snapshot-batch.mjs（110駅以外の蓄積）で
 * 同一ロジックを使う（取得仕様の単一ソース維持）。
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

export const ROOT = process.cwd();
export const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";
export const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.location,places.types,places.primaryType";
// app/api/restaurants/helpers.ts の GATSURI_KEYWORDS と対応。
// ランタイムは毎回ランダムに1語だけ使うが、スナップショットは全語を叩いて
// id で重複排除し、安定した充実リストを作る。
export const ALL_KEYWORDS = ["ラーメン", "定食", "中華", "カレー", "牛丼", "丼"];
export const MAX_PER_STATION = 20; // 1駅あたりの最大掲載件数
export const OFFSET = 0.009; // placesClient.ts と同じ矩形範囲
export const WAIT_MS = 200;
export const MAX_RETRY = 5; // 429/5xx の再試行回数

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * SNAPSHOT_KEYWORDS=2 のように指定すると先頭N語だけ使い、API総コール数を抑える。
 * （未指定なら全語。API使用量を見ながら絞れるようにするためのつまみ）
 */
export function resolveKeywords() {
  const n = Math.min(
    Math.max(1, Number(process.env.SNAPSHOT_KEYWORDS) || ALL_KEYWORDS.length),
    ALL_KEYWORDS.length
  );
  return ALL_KEYWORDS.slice(0, n);
}

/** .env を読み込んで process.env に反映（未設定のキーのみ） */
export async function loadEnv() {
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

/** data/stations.json から駅名→代表駅(座標)の解決インデックスを構築 */
export async function buildStationIndex() {
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
        variants.push({ pref: st.pref, x: st.x, y: st.y, lines: new Set([line.name]) });
      }
      index.set(st.name, variants);
    }
  }
  return index;
}

/**
 * 駅名から代表駅（座標）を返す。乗り入れ路線数が最も多い変種を採用。
 * prefFilter（県名の Set）を渡すと、まずその県の変種に絞ってから選ぶ。
 * 同名異駅（例: 東京の駅とローカル線の同名駅）を取り違えないために使う。
 */
export function representative(index, name, prefFilter) {
  let variants = index.get(name);
  if (!variants || variants.length === 0) return null;
  if (prefFilter) {
    const filtered = variants.filter((v) => prefFilter.has(v.pref));
    if (filtered.length > 0) variants = filtered;
  }
  return [...variants].sort((a, b) => b.lines.size - a.lines.size)[0] ?? null;
}

/**
 * Places API（searchText）を矩形範囲で叩く。429/5xx は指数バックオフで再試行。
 * onCall コールバックがあれば HTTP リクエスト1回ごとに呼ぶ（API使用量カウント用・再試行も含む）。
 */
export async function fetchPlaces(apiKey, query, lat, lng, onCall, maxResultCount = 10) {
  const body = {
    textQuery: query,
    languageCode: "ja",
    // Places API searchText の上限は20。1駅1コール運用では20まで引き上げて取りこぼしを減らす。
    maxResultCount: Math.min(20, Math.max(1, maxResultCount)),
    locationRestriction: {
      rectangle: {
        low: { latitude: lat - OFFSET, longitude: lng - OFFSET },
        high: { latitude: lat + OFFSET, longitude: lng + OFFSET },
      },
    },
  };

  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    if (onCall) onCall();
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
export function normalizePlace(p) {
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

/**
 * 1駅ぶんの「がっつり飯」店舗を複数キーワードで取得し、整形・重複排除したリストを返す。
 * キーワード数ぶんの HTTP コールが発生する（充実重視。主要110駅の生成で使用）。
 * 返り値: { list, calls }（calls はこの駅で実際に投げた HTTP リクエスト数）
 */
export async function fetchStationPlaces(apiKey, rep, keywords) {
  const byId = new Map();
  let calls = 0;
  for (const keyword of keywords) {
    await sleep(WAIT_MS);
    try {
      const places = await fetchPlaces(
        apiKey,
        `${keyword} がっつり`,
        rep.y,
        rep.x,
        () => calls++
      );
      for (const raw of places) {
        const norm = normalizePlace(raw);
        if (norm && !byId.has(norm.id)) byId.set(norm.id, norm);
      }
    } catch (e) {
      console.warn(`  "${keyword}": ${e.message}`);
    }
  }
  return { list: [...byId.values()].slice(0, MAX_PER_STATION), calls };
}

/**
 * 1駅ぶんを「1コールだけ」で取得する版（コスト重視。バッチ蓄積で使用）。
 * 単一クエリで最大20件まで取得し、整形・重複排除して返す。
 * 返り値: { list, calls }（calls は 0 か 1。成功・失敗いずれもHTTP1回ぶん）
 */
export async function fetchStationPlacesSingle(apiKey, rep, query) {
  const byId = new Map();
  let calls = 0;
  try {
    const places = await fetchPlaces(
      apiKey,
      query,
      rep.y,
      rep.x,
      () => calls++,
      MAX_PER_STATION
    );
    for (const raw of places) {
      const norm = normalizePlace(raw);
      if (norm && !byId.has(norm.id)) byId.set(norm.id, norm);
    }
  } catch (e) {
    console.warn(`  "${query}": ${e.message}`);
  }
  return { list: [...byId.values()].slice(0, MAX_PER_STATION), calls };
}
