"use client";

import {
  Chain,
  ChainMenuItem,
  CHAINS,
  DAILY_REFERENCE,
} from "@/constants/calorieData";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  keyframes,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

const P_COLOR = "#3B82F6"; // blue
const F_COLOR = "#FF6B00"; // brand orange
const C_COLOR = "#22C55E"; // green

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

type AddedItem = { item: ChainMenuItem; qty: number };

export default function CalorieClient() {
  const [selectedChainId, setSelectedChainId] = useState<string>(CHAINS[0].id);
  const [addedItems, setAddedItems] = useState<AddedItem[]>([]);

  const selectedChain = CHAINS.find((c) => c.id === selectedChainId)!;

  // ── 合計計算 ──────────────────────────────────
  const totals = useMemo(() => {
    const calories = addedItems.reduce((s, i) => s + i.item.calories * i.qty, 0);
    const protein  = addedItems.reduce((s, i) => s + i.item.protein  * i.qty, 0);
    const fat      = addedItems.reduce((s, i) => s + i.item.fat      * i.qty, 0);
    const carbs    = addedItems.reduce((s, i) => s + i.item.carbs    * i.qty, 0);

    // カロリー由来（P:4kcal/g, F:9kcal/g, C:4kcal/g）
    const calP = protein * 4;
    const calF = fat * 9;
    const calC = carbs * 4;
    const calTotal = calP + calF + calC || 1; // ゼロ除算防止

    return {
      calories, protein, fat, carbs,
      pPct: Math.round((calP / calTotal) * 100),
      fPct: Math.round((calF / calTotal) * 100),
      cPct: Math.round((calC / calTotal) * 100),
    };
  }, [addedItems]);

  const caloriePct = Math.min(Math.round((totals.calories / DAILY_REFERENCE.calories) * 100), 200);

  // ── 操作 ──────────────────────────────────────
  const addItem = (item: ChainMenuItem) => {
    setAddedItems((prev) => {
      const idx = prev.findIndex((i) => i.item.name === item.name);
      if (idx >= 0) {
        return prev.map((i, n) => n === idx ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const changeQty = (name: string, delta: number) => {
    setAddedItems((prev) =>
      prev
        .map((i) => i.item.name === name ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (name: string) => {
    setAddedItems((prev) => prev.filter((i) => i.item.name !== name));
  };

  const relatedChains = addedItems
    .map((i) => {
      const chain = CHAINS.find((c) => c.menu.some((m) => m.name === i.item.name));
      return chain ?? null;
    })
    .filter(Boolean) as Chain[];

  const uniqueStations = Array.from(
    new Set(relatedChains.flatMap((c) => c.stations))
  ).slice(0, 6);

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pt: { xs: 10, md: 4 }, pb: 8 }}>
      <Container maxWidth="md">

        {/* ── ページタイトル ── */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "1.8rem", md: "2.6rem" },
              letterSpacing: "-0.03em",
              color: DARK_COLOR,
              mb: 1,
            }}
          >
            外食カロリー
            <Box component="span" sx={{ color: BRAND_COLOR }}>＆PFC</Box>
            計算
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#666" }}>
            食べたいメニューを選んで追加するだけ。1日の目安と比べてみよう。
          </Typography>
        </Box>

        {/* ── チェーン選択 ── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3,
            borderRadius: 4,
            border: `2px solid ${DARK_COLOR}`,
            boxShadow: `6px 6px 0px ${DARK_COLOR}`,
            bgcolor: "#fff",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: DARK_COLOR }}>
            チェーン店を選ぶ
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {CHAINS.map((chain) => (
              <Box
                key={chain.id}
                component="button"
                onClick={() => setSelectedChainId(chain.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  border: `2px solid ${selectedChainId === chain.id ? BRAND_COLOR : "#DDD"}`,
                  bgcolor: selectedChainId === chain.id ? "#FFF5ED" : "#fff",
                  color: selectedChainId === chain.id ? BRAND_COLOR : "#444",
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: selectedChainId === chain.id ? `3px 3px 0px ${BRAND_COLOR}` : "none",
                  transition: "all 0.15s",
                  "&:hover": {
                    borderColor: BRAND_COLOR,
                    color: BRAND_COLOR,
                  },
                }}
              >
                <span>{chain.emoji}</span>
                {chain.name}
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* ── メニューリスト ── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3,
            borderRadius: 4,
            border: `2px solid ${DARK_COLOR}`,
            boxShadow: `6px 6px 0px ${DARK_COLOR}`,
            bgcolor: "#fff",
            animation: `${fadeUp} 0.2s ease-out`,
          }}
          key={selectedChainId}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Typography variant="h2" sx={{ fontSize: "1.8rem", lineHeight: 1 }}>
              {selectedChain.emoji}
            </Typography>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.2 }}>
                {selectedChain.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#999", fontWeight: 700 }}>
                {selectedChain.genre}
              </Typography>
            </Box>
          </Box>

          <Stack spacing={1}>
            {selectedChain.menu.map((item) => (
              <MenuItem key={item.name} item={item} onAdd={() => addItem(item)} />
            ))}
          </Stack>
        </Paper>

        {/* ── 計算結果 ── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3,
            borderRadius: 4,
            border: `2px solid ${addedItems.length > 0 ? BRAND_COLOR : "#DDD"}`,
            boxShadow: addedItems.length > 0 ? `6px 6px 0px ${BRAND_COLOR}` : `6px 6px 0px #DDD`,
            bgcolor: addedItems.length > 0 ? "#FFF9F5" : "#fff",
            transition: "all 0.3s",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR }}>
              合計カロリー
            </Typography>
            {addedItems.length > 0 && (
              <Button
                size="small"
                onClick={() => setAddedItems([])}
                sx={{ fontWeight: 900, color: "#999", fontSize: "0.75rem" }}
              >
                すべてクリア
              </Button>
            )}
          </Box>

          {/* カロリー大表示 */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              component="span"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "3.5rem", md: "5rem" },
                lineHeight: 1,
                color: addedItems.length === 0 ? "#CCC" : caloriePct > 100 ? "#EF4444" : BRAND_COLOR,
                transition: "color 0.3s",
              }}
            >
              {totals.calories.toLocaleString()}
            </Typography>
            <Typography component="span" sx={{ fontWeight: 900, fontSize: "1.2rem", color: "#666", ml: 1 }}>
              kcal
            </Typography>
            {addedItems.length > 0 && (
              <Typography variant="body2" sx={{ color: "#888", fontWeight: 700, mt: 0.5 }}>
                1日の目安（2000kcal）の {caloriePct}%
              </Typography>
            )}
          </Box>

          {/* カロリー進捗バー */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                height: 14,
                borderRadius: 99,
                bgcolor: "#F0F0F0",
                overflow: "hidden",
                border: "1px solid #E0E0E0",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${Math.min(caloriePct / 2, 100)}%`,
                  bgcolor: caloriePct > 100 ? "#EF4444" : BRAND_COLOR,
                  borderRadius: 99,
                  transition: "width 0.4s ease-out",
                }}
              />
            </Box>
          </Box>

          {/* PFC スタック棒グラフ */}
          {addedItems.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: DARK_COLOR }}>
                  PFCバランス（カロリー比）
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  {[
                    { label: "P", color: P_COLOR, pct: totals.pPct },
                    { label: "F", color: F_COLOR, pct: totals.fPct },
                    { label: "C", color: C_COLOR, pct: totals.cPct },
                  ].map(({ label, color, pct }) => (
                    <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
                      <Typography variant="caption" sx={{ fontWeight: 900, color: "#666" }}>
                        {label} {pct}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: "flex", height: 20, borderRadius: 2, overflow: "hidden" }}>
                <Box sx={{ width: `${totals.pPct}%`, bgcolor: P_COLOR, transition: "width 0.4s" }} />
                <Box sx={{ width: `${totals.fPct}%`, bgcolor: F_COLOR, transition: "width 0.4s" }} />
                <Box sx={{ width: `${totals.cPct}%`, bgcolor: C_COLOR, transition: "width 0.4s" }} />
              </Box>
            </Box>
          )}

          {/* PFC 詳細バー */}
          <Stack spacing={1.5} sx={{ mb: 3 }}>
            <MacroBar label="タンパク質 (P)" value={totals.protein} ref={DAILY_REFERENCE.protein} color={P_COLOR} unit="g" />
            <MacroBar label="脂質 (F)"       value={totals.fat}     ref={DAILY_REFERENCE.fat}     color={F_COLOR} unit="g" />
            <MacroBar label="炭水化物 (C)"   value={totals.carbs}   ref={DAILY_REFERENCE.carbs}   color={C_COLOR} unit="g" />
          </Stack>

          {/* 追加済みアイテムリスト */}
          {addedItems.length > 0 ? (
            <>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="caption" sx={{ fontWeight: 900, color: "#888", letterSpacing: "0.1em" }}>
                選択中のメニュー
              </Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {addedItems.map(({ item, qty }) => (
                  <Box
                    key={item.name}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#fff",
                      border: "1px solid #EEE",
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.2 }} noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#888", fontWeight: 700 }}>
                        {(item.calories * qty).toLocaleString()} kcal
                        <Box component="span" sx={{ mx: 0.5 }}>·</Box>
                        P {item.protein * qty}g · F {item.fat * qty}g · C {item.carbs * qty}g
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                      <IconButton size="small" onClick={() => changeQty(item.name, -1)} sx={{ border: "1px solid #EEE", width: 26, height: 26 }}>
                        <RemoveIcon sx={{ fontSize: "0.85rem" }} />
                      </IconButton>
                      <Typography sx={{ fontWeight: 900, fontSize: "0.9rem", minWidth: 20, textAlign: "center" }}>
                        {qty}
                      </Typography>
                      <IconButton size="small" onClick={() => changeQty(item.name, 1)} sx={{ border: "1px solid #EEE", width: 26, height: 26 }}>
                        <AddIcon sx={{ fontSize: "0.85rem" }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => removeItem(item.name)} sx={{ color: "#CCC", ml: 0.5 }}>
                        <DeleteOutlineIcon sx={{ fontSize: "1.1rem" }} />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </>
          ) : (
            <Alert severity="info" sx={{ borderRadius: 2, fontWeight: 700 }}>
              上のメニューから「追加」ボタンを押してください
            </Alert>
          )}
        </Paper>

        {/* ── 内部リンク：関連駅 ── */}
        {uniqueStations.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              border: `2px solid ${DARK_COLOR}`,
              boxShadow: `6px 6px 0px ${DARK_COLOR}`,
              bgcolor: "#fff",
              animation: `${fadeUp} 0.3s ease-out`,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR, mb: 2 }}>
              選んだチェーン店が近い駅を探す
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {uniqueStations.map((station) => (
                <Link
                  key={station}
                  href={`/station/${encodeURIComponent(station)}`}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: `2px solid ${DARK_COLOR}`,
                      fontWeight: 900,
                      fontSize: "0.9rem",
                      color: DARK_COLOR,
                      bgcolor: "#fff",
                      boxShadow: `3px 3px 0px ${DARK_COLOR}`,
                      transition: "all 0.15s",
                      "&:hover": {
                        borderColor: BRAND_COLOR,
                        color: BRAND_COLOR,
                        transform: "translate(-1px, -1px)",
                        boxShadow: `4px 4px 0px ${BRAND_COLOR}`,
                      },
                    }}
                  >
                    {station}駅周辺を見る
                    <NavigateNextIcon sx={{ fontSize: "1rem" }} />
                  </Box>
                </Link>
              ))}
            </Stack>
          </Paper>
        )}
      </Container>
    </Box>
  );
}

// ── サブコンポーネント：メニュー行 ────────────────────────
function MenuItem({ item, onAdd }: { item: ChainMenuItem; onAdd: () => void }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        border: "1px solid #EEE",
        bgcolor: "#FAFAFA",
        transition: "all 0.15s",
        "&:hover": { borderColor: BRAND_COLOR, bgcolor: "#FFF9F5" },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 900, color: DARK_COLOR, mb: 0.3 }} noWrap>
          {item.name}
        </Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <Tooltip title="カロリー" arrow>
            <Typography variant="caption" sx={{ fontWeight: 900, color: BRAND_COLOR }}>
              {item.calories} kcal
            </Typography>
          </Tooltip>
          {[
            { label: "P", val: item.protein, color: P_COLOR },
            { label: "F", val: item.fat,     color: F_COLOR },
            { label: "C", val: item.carbs,   color: C_COLOR },
          ].map(({ label, val, color }) => (
            <Typography key={label} variant="caption" sx={{ fontWeight: 800, color }}>
              {label}: {val}g
            </Typography>
          ))}
        </Stack>
      </Box>
      <Button
        size="small"
        variant="contained"
        onClick={onAdd}
        sx={{
          minWidth: 56,
          flexShrink: 0,
          fontWeight: 900,
          bgcolor: DARK_COLOR,
          borderRadius: 1.5,
          "&:hover": { bgcolor: BRAND_COLOR },
        }}
      >
        追加
      </Button>
    </Box>
  );
}

// ── サブコンポーネント：マクロ栄養素バー ─────────────────
function MacroBar({
  label,
  value,
  ref: refVal,
  color,
  unit,
}: {
  label: string;
  value: number;
  ref: number;
  color: string;
  unit: string;
}) {
  const pct = Math.min(Math.round((value / refVal) * 100), 200);
  const over = pct > 100;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: "#555" }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 900, color: over ? "#EF4444" : color }}>
          {value}{unit} / {refVal}{unit}（{pct}%）
        </Typography>
      </Box>
      <Box sx={{ height: 8, borderRadius: 99, bgcolor: "#F0F0F0", overflow: "hidden" }}>
        <Box
          sx={{
            height: "100%",
            width: `${Math.min(pct, 100)}%`,
            bgcolor: over ? "#EF4444" : color,
            borderRadius: 99,
            transition: "width 0.4s ease-out",
          }}
        />
      </Box>
    </Box>
  );
}
