import rawData from "@/data/stations.json";

/**
 * 全国の駅・路線データ（HeartRails Express 由来、scripts/fetch-all-stations.mjs で生成）
 * へのアクセスヘルパー。サーバーサイド専用。
 */

export type StationEntry = {
  name: string;
  pref: string;
  x: number; // 経度
  y: number; // 緯度
};

export type LineEntry = {
  name: string;
  prefs: string[];
  stations: StationEntry[];
};

type StationsData = {
  updatedAt: string;
  lines: LineEntry[];
};

const data = rawData as StationsData;

// --- 遅延構築インデックス -------------------------------------------------

let lineIndex: Map<string, LineEntry> | null = null;
let stationIndex: Map<string, { entry: StationEntry; lines: string[] }[]> | null = null;
let prefIndex: Map<string, { lines: string[]; stationNames: Set<string> }> | null = null;

function buildIndexes() {
  if (lineIndex && stationIndex && prefIndex) return;

  lineIndex = new Map();
  stationIndex = new Map();
  prefIndex = new Map();

  for (const line of data.lines) {
    lineIndex.set(line.name, line);

    for (const pref of line.prefs) {
      if (!prefIndex.has(pref)) prefIndex.set(pref, { lines: [], stationNames: new Set() });
      prefIndex.get(pref)!.lines.push(line.name);
    }

    for (const st of line.stations) {
      const entry = prefIndex.get(st.pref);
      if (entry) entry.stationNames.add(st.name);

      const variants = stationIndex.get(st.name) ?? [];
      // 同名・同県・近接（約2km以内）の駅は同一駅とみなし路線を束ねる
      const existing = variants.find(
        (v) =>
          v.entry.pref === st.pref &&
          Math.abs(v.entry.y - st.y) < 0.02 &&
          Math.abs(v.entry.x - st.x) < 0.02
      );
      if (existing) {
        if (!existing.lines.includes(line.name)) existing.lines.push(line.name);
      } else {
        variants.push({ entry: st, lines: [line.name] });
      }
      stationIndex.set(st.name, variants);
    }
  }
}

// --- 公開API ---------------------------------------------------------------

/** ユニークな駅名の一覧（サイトマップ用） */
export function getAllStationNames(): string[] {
  buildIndexes();
  return [...stationIndex!.keys()];
}

/** 全路線名 */
export function getAllLineNames(): string[] {
  buildIndexes();
  return [...lineIndex!.keys()];
}

/** 全都道府県名（データ内に駅が存在するもの） */
export function getAllPrefectures(): string[] {
  buildIndexes();
  return [...prefIndex!.keys()];
}

/** 都道府県内の路線一覧（駅数つき） */
export function getLinesForPrefecture(
  pref: string
): { name: string; stationCount: number }[] {
  buildIndexes();
  const entry = prefIndex!.get(pref);
  if (!entry) return [];
  return entry.lines.map((lineName) => {
    const line = lineIndex!.get(lineName)!;
    return {
      name: lineName,
      stationCount: line.stations.filter((s) => s.pref === pref).length,
    };
  });
}

/** 都道府県のユニーク駅数 */
export function getStationCountForPrefecture(pref: string): number {
  buildIndexes();
  return prefIndex!.get(pref)?.stationNames.size ?? 0;
}

/** 路線情報（駅の並び順つき） */
export function getLine(lineName: string): LineEntry | undefined {
  buildIndexes();
  return lineIndex!.get(lineName);
}

/**
 * 駅名から代表駅を解決する。
 * 同名駅が複数都道府県にある場合は、乗り入れ路線数が最も多いものを代表とする。
 */
export function getRepresentativeStation(
  name: string
): { entry: StationEntry; lines: string[] } | undefined {
  buildIndexes();
  const variants = stationIndex!.get(name);
  if (!variants || variants.length === 0) return undefined;
  return [...variants].sort((a, b) => b.lines.length - a.lines.length)[0];
}

/**
 * 指定駅の「同じ路線の近隣駅」を路線ごとに返す。
 * 路線上の並び順で前後 radius 駅まで。
 */
export function getNeighborStations(
  stationName: string,
  radius = 4
): { line: string; neighbors: string[] }[] {
  buildIndexes();
  const rep = getRepresentativeStation(stationName);
  if (!rep) return [];

  return rep.lines.map((lineName) => {
    const line = lineIndex!.get(lineName)!;
    const idx = line.stations.findIndex(
      (s) => s.name === stationName && s.pref === rep.entry.pref
    );
    if (idx === -1) return { line: lineName, neighbors: [] };
    const neighbors = line.stations
      .slice(Math.max(0, idx - radius), idx + radius + 1)
      .map((s) => s.name)
      .filter((n) => n !== stationName);
    return { line: lineName, neighbors: [...new Set(neighbors)] };
  });
}
