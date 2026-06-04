"use client";

import {
  BUDGET_LABELS,
  BudgetType,
  GACHA_ITEMS,
  GENRE_STATIONS,
  GachaItem,
  MOOD_LABELS,
  MoodType,
} from "@/constants/gachaData";
import CasinoIcon from "@mui/icons-material/Casino";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ReplayIcon from "@mui/icons-material/Replay";
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
  keyframes,
} from "@mui/material";
import Link from "next/link";
import { useCallback, useState } from "react";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

const bounceIn = keyframes`
  0%   { transform: scale(0.5) rotate(-3deg); opacity: 0; }
  60%  { transform: scale(1.08) rotate(1deg); opacity: 1; }
  80%  { transform: scale(0.96); }
  100% { transform: scale(1) rotate(0deg); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  20%  { transform: translateX(-6px) rotate(-1deg); }
  40%  { transform: translateX(6px) rotate(1deg); }
  60%  { transform: translateX(-4px); }
  80%  { transform: translateX(4px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(255,107,0,0.3); }
  50%       { box-shadow: 0 0 28px rgba(255,107,0,0.9); }
`;

// スロットのスピード段階：速い→遅いの4段階
const SPIN_STAGES = [
  { interval: 55,  count: 14 },
  { interval: 110, count: 10 },
  { interval: 210, count:  6 },
  { interval: 380, count:  4 },
];

type Phase = "idle" | "spinning" | "result";

export default function GachaClient() {
  const [budget, setBudget] = useState<BudgetType | null>(null);
  const [mood, setMood] = useState<MoodType | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [slotText, setSlotText] = useState<string>("???");
  const [result, setResult] = useState<GachaItem | null>(null);

  const filteredItems = useCallback(() => {
    return GACHA_ITEMS.filter((item) => {
      const budgetOk = budget === null || item.budget.includes(budget);
      const moodOk = mood === null || item.mood.includes(mood);
      return budgetOk && moodOk;
    });
  }, [budget, mood]);

  const spin = useCallback(() => {
    const candidates = filteredItems();
    if (candidates.length === 0) return;

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    const allNames = GACHA_ITEMS.map((i) => i.name);

    setPhase("spinning");
    setResult(null);

    let stageIndex = 0;
    let count = 0;

    const tick = () => {
      setSlotText(allNames[Math.floor(Math.random() * allNames.length)]);
      count++;

      if (count >= SPIN_STAGES[stageIndex].count) {
        stageIndex++;
        count = 0;
      }

      if (stageIndex >= SPIN_STAGES.length) {
        setSlotText(chosen.name);
        setResult(chosen);
        setPhase("result");
        return;
      }

      setTimeout(tick, SPIN_STAGES[stageIndex].interval);
    };

    setTimeout(tick, SPIN_STAGES[0].interval);
  }, [filteredItems]);

  const reset = () => {
    setPhase("idle");
    setSlotText("???");
    setResult(null);
  };

  const relatedStations = result ? (GENRE_STATIONS[result.genre] ?? []) : [];

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pt: { xs: 10, md: 4 }, pb: 8 }}>
      <Container maxWidth="md">

        {/* ページタイトル */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <CasinoIcon sx={{ fontSize: "2.8rem", color: BRAND_COLOR }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 900, fontSize: { xs: "2rem", md: "2.8rem" }, letterSpacing: "-0.03em", color: DARK_COLOR }}
            >
              今日のご飯
              <Box component="span" sx={{ color: BRAND_COLOR }}>決定ガチャ</Box>
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#666" }}>
            迷ったらガチャに任せろ。運命の一食を引き当てろ！
          </Typography>
        </Box>

        {/* フィルターカード */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            borderRadius: 4,
            border: `2px solid ${DARK_COLOR}`,
            boxShadow: `6px 6px 0px ${DARK_COLOR}`,
            bgcolor: "#fff",
          }}
        >
          {/* 予算フィルター */}
          <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: DARK_COLOR }}>
            STEP 1｜予算を選ぶ
            <Typography component="span" variant="caption" sx={{ ml: 1, fontWeight: 700, color: "#999" }}>
              （選ばなくても OK）
            </Typography>
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
            {(Object.keys(BUDGET_LABELS) as BudgetType[]).map((key) => (
              <FilterChip
                key={key}
                label={BUDGET_LABELS[key]}
                selected={budget === key}
                onClick={() => setBudget((prev) => (prev === key ? null : key))}
              />
            ))}
          </Stack>

          {/* 気分フィルター */}
          <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: DARK_COLOR }}>
            STEP 2｜今の気分を選ぶ
            <Typography component="span" variant="caption" sx={{ ml: 1, fontWeight: 700, color: "#999" }}>
              （選ばなくても OK）
            </Typography>
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {(Object.keys(MOOD_LABELS) as MoodType[]).map((key) => (
              <FilterChip
                key={key}
                label={MOOD_LABELS[key]}
                selected={mood === key}
                onClick={() => setMood((prev) => (prev === key ? null : key))}
              />
            ))}
          </Stack>
        </Paper>

        {/* スロット表示 */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: 4,
            border: `2px solid ${DARK_COLOR}`,
            boxShadow: `6px 6px 0px ${DARK_COLOR}`,
            bgcolor: DARK_COLOR,
            textAlign: "center",
            animation: phase === "spinning" ? `${glow} 0.4s ease-in-out infinite` : "none",
          }}
        >
          <Typography variant="caption" sx={{ color: "#888", fontWeight: 900, letterSpacing: "0.2em" }}>
            RESULT
          </Typography>
          <Box
            sx={{
              my: 2,
              minHeight: 80,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.8rem", md: "2.8rem" },
                color: phase === "spinning" ? "#FFA040" : phase === "result" ? BRAND_COLOR : "#444",
                letterSpacing: "-0.02em",
                transition: phase === "spinning" ? "color 0.05s" : "none",
                animation: phase === "result" ? `${bounceIn} 0.55s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards` : "none",
              }}
            >
              {phase === "idle" ? "???" : slotText}
            </Typography>
          </Box>
          {phase === "spinning" && (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: BRAND_COLOR,
                    opacity: 0.6 + i * 0.2,
                    animation: `${shake} 0.3s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </Box>
          )}
        </Paper>

        {/* ガチャボタン */}
        {phase !== "result" && (
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<CasinoIcon />}
            onClick={spin}
            disabled={phase === "spinning"}
            sx={{
              py: 2.5,
              mb: 4,
              borderRadius: 3,
              fontWeight: 900,
              fontSize: { xs: "1.1rem", md: "1.3rem" },
              background:
                phase === "spinning"
                  ? "#555"
                  : `linear-gradient(45deg, ${BRAND_COLOR} 30%, #FF8E53 90%)`,
              border: `2px solid ${DARK_COLOR}`,
              boxShadow: phase === "spinning" ? "none" : `4px 4px 0px ${DARK_COLOR}`,
              transition: "all 0.15s",
              "&:hover:not(:disabled)": {
                transform: "translate(-2px, -2px)",
                boxShadow: `6px 6px 0px ${DARK_COLOR}`,
              },
              "&:active:not(:disabled)": {
                transform: "translate(2px, 2px)",
                boxShadow: "none",
              },
            }}
          >
            {phase === "spinning" ? "ガチャ中..." : "ガチャを回す！"}
          </Button>
        )}

        {/* 結果表示 */}
        {phase === "result" && result && (
          <Box sx={{ animation: `${bounceIn} 0.5s ease-out forwards` }}>
            {/* コメントカード */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 3,
                borderRadius: 4,
                border: `2px solid ${BRAND_COLOR}`,
                boxShadow: `6px 6px 0px ${BRAND_COLOR}`,
                bgcolor: "#FFF9F5",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography variant="h2" sx={{ fontSize: "3rem", lineHeight: 1 }}>
                  {result.emoji}
                </Typography>
                <Box>
                  <Chip
                    label={result.genre}
                    size="small"
                    sx={{ bgcolor: BRAND_COLOR, color: "#fff", fontWeight: 900, mb: 0.5 }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.2 }}>
                    {result.name}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  color: "#444",
                  lineHeight: 1.8,
                  borderLeft: `4px solid ${BRAND_COLOR}`,
                  pl: 2,
                  py: 0.5,
                }}
              >
                {result.comment}
              </Typography>
            </Paper>

            {/* 内部リンク：関連駅 */}
            {relatedStations.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  mb: 3,
                  borderRadius: 4,
                  border: `2px solid ${DARK_COLOR}`,
                  boxShadow: `6px 6px 0px ${DARK_COLOR}`,
                  bgcolor: "#fff",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR, mb: 2 }}>
                  「{result.name}」が食べられる駅を探す
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1.5}>
                  {relatedStations.map((station) => (
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

            {/* もう一回ボタン */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<ReplayIcon />}
              onClick={reset}
              sx={{
                py: 2,
                borderRadius: 3,
                fontWeight: 900,
                fontSize: "1rem",
                border: `2px solid ${DARK_COLOR}`,
                color: DARK_COLOR,
                boxShadow: `4px 4px 0px ${DARK_COLOR}`,
                "&:hover": {
                  bgcolor: DARK_COLOR,
                  color: "#fff",
                  transform: "translate(-2px, -2px)",
                  boxShadow: `6px 6px 0px ${DARK_COLOR}`,
                  border: `2px solid ${DARK_COLOR}`,
                },
              }}
            >
              もう一回まわす
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        px: 2.5,
        py: 1,
        borderRadius: 2,
        border: `2px solid ${selected ? BRAND_COLOR : "#DDD"}`,
        bgcolor: selected ? BRAND_COLOR : "#fff",
        color: selected ? "#fff" : "#444",
        fontWeight: 900,
        fontSize: "0.9rem",
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: selected ? `3px 3px 0px ${DARK_COLOR}` : "none",
        transition: "all 0.15s",
        "&:hover": {
          borderColor: BRAND_COLOR,
          color: selected ? "#fff" : BRAND_COLOR,
          transform: "translate(-1px, -1px)",
          boxShadow: `3px 3px 0px ${selected ? DARK_COLOR : BRAND_COLOR}`,
        },
      }}
    >
      {label}
    </Box>
  );
}
