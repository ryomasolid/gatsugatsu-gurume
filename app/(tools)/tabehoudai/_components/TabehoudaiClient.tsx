"use client";

import { isStationReachable } from "@/constants/reviewMode";
import {
  TABEHOUDAI_CHAINS,
  TabehoudaiMenuItem,
} from "@/constants/tabehoudaiData";
import AddIcon from "@mui/icons-material/Add";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  keyframes,
} from "@mui/material";
import Link from "next/link";
import { useMemo, useState } from "react";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";
const SUCCESS_COLOR = "#22C55E";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

type OrderedItem = { item: TabehoudaiMenuItem; qty: number };

export default function TabehoudaiClient() {
  const [selectedChainId, setSelectedChainId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [orderedItems, setOrderedItems] = useState<OrderedItem[]>([]);

  const selectedChain = TABEHOUDAI_CHAINS.find((c) => c.id === selectedChainId) ?? null;
  const selectedCourse = selectedChain?.courses.find((c) => c.id === selectedCourseId) ?? null;

  const totalValue = useMemo(
    () => orderedItems.reduce((sum, { item, qty }) => sum + item.unitPrice * qty, 0),
    [orderedItems]
  );

  const coursePrice = selectedCourse?.price ?? 0;
  const remaining = coursePrice - totalValue;
  const progressPct = coursePrice > 0 ? Math.min((totalValue / coursePrice) * 100, 150) : 0;
  const isBreakEven = remaining <= 0;

  const handleChainSelect = (chainId: string) => {
    setSelectedChainId(chainId);
    setSelectedCourseId(null);
    setOrderedItems([]);
  };

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setOrderedItems([]);
  };

  const addItem = (item: TabehoudaiMenuItem) => {
    setOrderedItems((prev) => {
      const idx = prev.findIndex((i) => i.item.name === item.name);
      if (idx >= 0) return prev.map((i, n) => (n === idx ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { item, qty: 1 }];
    });
  };

  const changeQty = (name: string, delta: number) => {
    setOrderedItems((prev) =>
      prev
        .map((i) => (i.item.name === name ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const getQty = (name: string) => orderedItems.find((i) => i.item.name === name)?.qty ?? 0;

  const menuByCategory = useMemo(() => {
    if (!selectedChain) return [];
    const map = new Map<string, TabehoudaiMenuItem[]>();
    for (const item of selectedChain.menu) {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category)!.push(item);
    }
    return Array.from(map.entries()).map(([cat, items]) => ({ cat, items }));
  }, [selectedChain]);

  // progress bar fill color
  const barColor =
    isBreakEven
      ? SUCCESS_COLOR
      : progressPct > 80
      ? `linear-gradient(90deg, #FBBF24 0%, ${BRAND_COLOR} 100%)`
      : `linear-gradient(90deg, ${BRAND_COLOR} 0%, #FF8E53 100%)`;

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
              fontSize: { xs: "1.6rem", md: "2.4rem" },
              letterSpacing: "-0.03em",
              color: DARK_COLOR,
              mb: 1,
            }}
          >
            食べ放題
            <Box component="span" sx={{ color: BRAND_COLOR }}>元取れ</Box>
            シミュレーター
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#666" }}>
            食べた量を入力するだけ。コース料金との損得をリアルタイムで計算！
          </Typography>
        </Box>

        {/* ── STEP 1: チェーン選択 ── */}
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
            STEP 1　チェーン店を選ぶ
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            {TABEHOUDAI_CHAINS.map((chain) => {
              const active = selectedChainId === chain.id;
              return (
                <Box
                  key={chain.id}
                  component="button"
                  onClick={() => handleChainSelect(chain.id)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    px: { xs: 2, md: 3 },
                    py: 2,
                    borderRadius: 3,
                    border: `2px solid ${active ? BRAND_COLOR : "#DDD"}`,
                    bgcolor: active ? "#FFF5ED" : "#fff",
                    color: active ? BRAND_COLOR : "#444",
                    fontWeight: 900,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: active ? `3px 3px 0px ${BRAND_COLOR}` : "none",
                    transition: "all 0.15s",
                    minWidth: 90,
                    "&:hover": { borderColor: BRAND_COLOR, color: BRAND_COLOR },
                  }}
                >
                  <Box component="span" sx={{ fontSize: "2rem", lineHeight: 1 }}>{chain.emoji}</Box>
                  <Typography sx={{ fontWeight: 900, fontSize: "0.85rem", color: "inherit", mt: 0.5 }}>
                    {chain.name}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.65rem", color: "#999" }}>
                    {chain.genre}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Paper>

        {/* ── STEP 2: コース選択 ── */}
        {selectedChain && (
          <Paper
            elevation={0}
            key={`course-${selectedChainId}`}
            sx={{
              p: { xs: 2.5, md: 3 },
              mb: 3,
              borderRadius: 4,
              border: `2px solid ${DARK_COLOR}`,
              boxShadow: `6px 6px 0px ${DARK_COLOR}`,
              bgcolor: "#fff",
              animation: `${fadeUp} 0.2s ease-out`,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: DARK_COLOR }}>
              STEP 2　コースを選ぶ
            </Typography>
            <Stack spacing={1.5}>
              {selectedChain.courses.map((course) => {
                const active = selectedCourseId === course.id;
                return (
                  <Box
                    key={course.id}
                    component="button"
                    onClick={() => handleCourseSelect(course.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                      p: 2,
                      borderRadius: 3,
                      border: `2px solid ${active ? BRAND_COLOR : "#DDD"}`,
                      bgcolor: active ? "#FFF5ED" : "#FAFAFA",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      transition: "all 0.15s",
                      "&:hover": { borderColor: BRAND_COLOR, bgcolor: "#FFF9F5" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 900, fontSize: "1rem", color: active ? BRAND_COLOR : DARK_COLOR }}>
                        {course.name}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.78rem", color: "#999", mt: 0.2 }}>
                        {course.note}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: "1.7rem", color: active ? BRAND_COLOR : DARK_COLOR, lineHeight: 1 }}>
                        ¥{course.price.toLocaleString()}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.7rem", color: "#999" }}>/ 1人</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Paper>
        )}

        {/* ── 進捗カード（コース選択後に表示、sticky） ── */}
        {selectedCourse && (
          <Paper
            elevation={0}
            key={`progress-${isBreakEven}`}
            sx={{
              p: { xs: 2.5, md: 3 },
              mb: 3,
              borderRadius: 4,
              border: `3px solid ${isBreakEven ? SUCCESS_COLOR : BRAND_COLOR}`,
              boxShadow: `6px 6px 0px ${isBreakEven ? SUCCESS_COLOR : BRAND_COLOR}`,
              bgcolor: isBreakEven ? "#F0FFF4" : "#FFF9F5",
              transition: "border-color 0.5s, box-shadow 0.5s, background-color 0.5s",
              animation: `${fadeUp} 0.25s ease-out`,
              position: "sticky",
              top: { xs: 68, md: 16 },
              zIndex: 10,
            }}
          >
            {/* ステータスメッセージ */}
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.15rem", md: "1.45rem" },
                color: isBreakEven ? SUCCESS_COLOR : DARK_COLOR,
                mb: 2,
                textAlign: "center",
                lineHeight: 1.3,
              }}
            >
              {isBreakEven
                ? `🎉 元が取れました！＋¥${Math.abs(remaining).toLocaleString()} の得！`
                : coursePrice > 0 && totalValue === 0
                ? `コース料金 ¥${coursePrice.toLocaleString()} の元を取りにいこう！`
                : `あと ¥${remaining.toLocaleString()} で元が取れます！`}
            </Typography>

            {/* プログレスバー */}
            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: "#888" }}>
                  参考単品価格の合計
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: isBreakEven ? SUCCESS_COLOR : BRAND_COLOR }}>
                  ¥{totalValue.toLocaleString()} / ¥{coursePrice.toLocaleString()}（{Math.round(progressPct)}%）
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 22,
                  borderRadius: 99,
                  bgcolor: "#E5E7EB",
                  overflow: "hidden",
                  border: "1px solid #D1D5DB",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${Math.min(progressPct, 100)}%`,
                    background: barColor,
                    borderRadius: 99,
                    transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </Box>
            </Box>

            {/* 3つの数値 */}
            <Stack direction="row" justifyContent="space-around">
              {[
                { label: "コース料金",           value: `¥${coursePrice.toLocaleString()}`,      color: "#888" },
                { label: "食べた合計（参考）",    value: `¥${totalValue.toLocaleString()}`,        color: BRAND_COLOR },
                {
                  label: isBreakEven ? "お得な金額" : "残り目標",
                  value: `¥${Math.abs(remaining).toLocaleString()}`,
                  color: isBreakEven ? SUCCESS_COLOR : "#EF4444",
                },
              ].map(({ label, value, color }) => (
                <Box key={label} sx={{ textAlign: "center" }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#999", display: "block", mb: 0.3 }}>
                    {label}
                  </Typography>
                  <Typography sx={{ fontWeight: 900, fontSize: { xs: "1rem", md: "1.2rem" }, color }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}

        {/* ── STEP 3: メニュー入力 ── */}
        {selectedCourse && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              mb: 3,
              borderRadius: 4,
              border: `2px solid ${DARK_COLOR}`,
              boxShadow: `6px 6px 0px ${DARK_COLOR}`,
              bgcolor: "#fff",
              animation: `${fadeUp} 0.3s ease-out`,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
              <Box component="span" sx={{ fontSize: "1.8rem", lineHeight: 1 }}>{selectedChain!.emoji}</Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.2 }}>
                  STEP 3　食べたメニューをカウント
                </Typography>
                <Typography variant="caption" sx={{ color: "#999", fontWeight: 700 }}>
                  ※参考単品価格をもとに損得を計算します
                </Typography>
              </Box>
            </Box>

            <Stack spacing={3}>
              {menuByCategory.map(({ cat, items }) => (
                <Box key={cat}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 900,
                      color: "#888",
                      letterSpacing: "0.08em",
                      mb: 1,
                      display: "block",
                      textTransform: "uppercase",
                    }}
                  >
                    {cat}
                  </Typography>
                  <Stack spacing={1}>
                    {items.map((item) => (
                      <MenuItemRow
                        key={item.name}
                        item={item}
                        qty={getQty(item.name)}
                        onAdd={() => addItem(item)}
                        onChange={(d) => changeQty(item.name, d)}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}

        {/* ── 食べた一覧サマリー ── */}
        {orderedItems.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              mb: 3,
              borderRadius: 4,
              border: `2px solid ${isBreakEven ? SUCCESS_COLOR : BRAND_COLOR}`,
              boxShadow: `6px 6px 0px ${isBreakEven ? SUCCESS_COLOR : BRAND_COLOR}`,
              bgcolor: "#fff",
              animation: `${fadeUp} 0.2s ease-out`,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR }}>
                今日食べた一覧
              </Typography>
              <Button
                size="small"
                onClick={() => setOrderedItems([])}
                sx={{ fontWeight: 900, color: "#999", fontSize: "0.75rem" }}
              >
                すべてクリア
              </Button>
            </Box>

            <Stack spacing={1}>
              {orderedItems.map(({ item, qty }) => (
                <Box
                  key={item.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#F8F9FA",
                    border: "1px solid #EEE",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: DARK_COLOR }} noWrap>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888", fontWeight: 700 }}>
                      ¥{item.unitPrice.toLocaleString()} × {qty} ＝ ¥{(item.unitPrice * qty).toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
                    <IconButton
                      size="small"
                      onClick={() => changeQty(item.name, -1)}
                      sx={{ border: "1px solid #EEE", width: 26, height: 26 }}
                    >
                      <RemoveIcon sx={{ fontSize: "0.85rem" }} />
                    </IconButton>
                    <Typography sx={{ fontWeight: 900, fontSize: "0.9rem", minWidth: 20, textAlign: "center" }}>
                      {qty}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => changeQty(item.name, 1)}
                      sx={{ border: "1px solid #EEE", width: 26, height: 26 }}
                    >
                      <AddIcon sx={{ fontSize: "0.85rem" }} />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 900, color: "#888" }}>合計（参考）</Typography>
              <Typography
                sx={{ fontWeight: 900, fontSize: "1.6rem", color: isBreakEven ? SUCCESS_COLOR : BRAND_COLOR }}
              >
                ¥{totalValue.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* ── 内部リンク：関連駅 ── */}
        {selectedChain && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 4,
              border: `2px solid ${DARK_COLOR}`,
              boxShadow: `6px 6px 0px ${DARK_COLOR}`,
              bgcolor: "#fff",
              animation: `${fadeUp} 0.35s ease-out`,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR, mb: 0.5 }}>
              {selectedChain.name} が近い駅のがっつりグルメを探す
            </Typography>
            <Typography variant="caption" sx={{ color: "#888", fontWeight: 700, mb: 2, display: "block" }}>
              各駅周辺のデカ盛り・高コスパ店をチェック
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {selectedChain.stations.filter(isStationReachable).map((station) => (
                <Link
                  key={station}
                  href={`/station/${station}`}
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

// ── サブコンポーネント：メニュー行 ───────────────────────────
function MenuItemRow({
  item,
  qty,
  onAdd,
  onChange,
}: {
  item: TabehoudaiMenuItem;
  qty: number;
  onAdd: () => void;
  onChange: (delta: number) => void;
}) {
  const BRAND_COLOR = "#FF6B00";
  const DARK_COLOR = "#1A1A1A";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 2,
        py: 1.5,
        borderRadius: 2,
        border: `1px solid ${qty > 0 ? BRAND_COLOR : "#EEE"}`,
        bgcolor: qty > 0 ? "#FFF9F5" : "#FAFAFA",
        transition: "all 0.15s",
        "&:hover": { borderColor: BRAND_COLOR, bgcolor: "#FFF9F5" },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.3 }} noWrap>
          {item.name}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 900, color: BRAND_COLOR }}>
          参考単品 ¥{item.unitPrice.toLocaleString()}
        </Typography>
      </Box>

      {qty === 0 ? (
        <Button
          size="small"
          variant="contained"
          onClick={onAdd}
          sx={{
            minWidth: 60,
            flexShrink: 0,
            fontWeight: 900,
            bgcolor: DARK_COLOR,
            borderRadius: 1.5,
            "&:hover": { bgcolor: BRAND_COLOR },
          }}
        >
          追加
        </Button>
      ) : (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          <IconButton
            size="small"
            onClick={() => onChange(-1)}
            sx={{ border: "1px solid #DDD", width: 28, height: 28 }}
          >
            <RemoveIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
          <Typography
            sx={{ fontWeight: 900, fontSize: "1rem", minWidth: 26, textAlign: "center", color: BRAND_COLOR }}
          >
            {qty}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onChange(1)}
            sx={{ border: `1px solid ${BRAND_COLOR}`, width: 28, height: 28, color: BRAND_COLOR }}
          >
            <AddIcon sx={{ fontSize: "0.9rem" }} />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
