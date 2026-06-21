/**
 * スナップショット化候補の優先度リストを生成するスクリプト。
 *
 * ねらい:
 *   - 主要110駅（= 編集部ガイドを持ちスナップショット済の駅）の「次に着手すべき駅」を
 *     客観指標で並べ、ガイド執筆の作業台帳 data/snapshotCandidates.json を作る。
 *   - スナップショット生成の真のボトルネックは Places API ではなく手書きガイドの執筆工数。
 *     よって本リストは「どの駅のガイドを次に書くか」の優先度を示す。
 *
 * 優先度の主軸:
 *   乗り入れ路線数（近接マージ後）。generate-station-snapshots.mjs の代表駅選定と同ロジックで、
 *   集客力の客観的な代理指標として用いる（外部データ不要・リポジトリ完結）。
 *
 * 階層:
 *   Tier 1 … UI一覧(STATION_GROUPS)に掲載済なのにスナップショット未生成（編集部が既に重要と判断済み）
 *   Tier 2 … UI一覧外・路線数 >= 4 のターミナル
 *   Tier 3 … UI一覧外・路線数 2〜3
 *   Tier 4 … 路線数 1（網羅対象外・参考）
 *
 * 対象エリア: 首都圏 = 東京都・神奈川県・埼玉県・千葉県（1都3県）。
 *
 * 実行: npm run snapshot:candidates
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CAPITAL_PREFS = new Set(["東京都", "神奈川県", "埼玉県", "千葉県"]);

async function loadJson(...parts) {
  return JSON.parse(await readFile(path.join(ROOT, ...parts), "utf8"));
}

/** data/stations.json から駅名→変種(近接マージ)で路線集合を構築（snapshotスクリプトと同ロジック） */
function buildStationIndex(data) {
  const index = new Map();
  for (const line of data.lines) {
    for (const st of line.stations) {
      const variants = index.get(st.name) ?? [];
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

/** constants/stations.ts の STATION_GROUPS から首都圏掲載駅名を抽出 */
async function loadCapitalGroupNames() {
  const src = await readFile(path.join(ROOT, "constants", "stations.ts"), "utf8");
  const names = new Set();
  const re = /region:\s*"([^"]+)"[\s\S]*?stations:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (!/23区|多摩|神奈川|埼玉|千葉/.test(m[1])) continue;
    for (const s of m[2].matchAll(/"([^"]+)"/g)) names.add(s[1]);
  }
  return names;
}

function tierOf(inGroups, lines) {
  if (inGroups) return 1;
  if (lines >= 4) return 2;
  if (lines >= 2) return 3;
  return 4;
}

async function main() {
  const data = await loadJson("data", "stations.json");
  const snap = await loadJson("data", "stationSnapshots.json");
  const major = new Set(Object.keys(snap.stations));
  const groupNames = await loadCapitalGroupNames();
  const index = buildStationIndex(data);

  const candidates = [];
  for (const [name, variants] of index) {
    const inCapital = variants.filter((v) => CAPITAL_PREFS.has(v.pref));
    if (inCapital.length === 0) continue; // 首都圏外
    if (major.has(name)) continue; // 既にスナップショット済
    // 代表 = 首都圏内で最も路線数の多い変種
    const rep = inCapital.sort((a, b) => b.lines.size - a.lines.size)[0];
    const inGroups = groupNames.has(name);
    candidates.push({
      name,
      pref: rep.pref,
      lines: rep.lines.size,
      inStationGroups: inGroups,
      tier: tierOf(inGroups, rep.lines.size),
    });
  }

  // Tier 昇順 → 路線数降順 → 駅名
  candidates.sort(
    (a, b) =>
      a.tier - b.tier ||
      b.lines - a.lines ||
      a.name.localeCompare(b.name, "ja")
  );

  const tierCounts = candidates.reduce((acc, c) => {
    acc[c.tier] = (acc[c.tier] || 0) + 1;
    return acc;
  }, {});

  const out = {
    generatedAt: new Date().toISOString().slice(0, 10),
    area: "首都圏（東京都・神奈川県・埼玉県・千葉県）",
    rankingSignal: "乗り入れ路線数（近接マージ後の代表駅）",
    snapshottedCount: major.size,
    candidateCount: candidates.length,
    tierLegend: {
      1: "UI一覧(STATION_GROUPS)掲載済・スナップショット未生成（最優先）",
      2: "UI一覧外・路線数4本以上のターミナル",
      3: "UI一覧外・路線数2〜3本",
      4: "路線数1本（網羅対象外・参考）",
    },
    tierCounts,
    candidates,
  };

  const outPath = path.join(ROOT, "data", "snapshotCandidates.json");
  await writeFile(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log(`Wrote ${candidates.length} candidates to data/snapshotCandidates.json`);
  console.log("tierCounts:", tierCounts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
