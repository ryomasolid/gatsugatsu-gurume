"use client";

import { isStationReachable } from "@/constants/reviewMode";
import { SEAT_PRESETS, WAIT_TIME_GENRES } from "@/constants/waitTimeData";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import {
  Box,
  Container,
  Paper,
  Slider,
  Stack,
  Typography,
  keyframes,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";
const TEAL = "#0891B2";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

function getAdvice(min: number): { emoji: string; text: string } {
  if (min === 0) return { emoji: "🎉", text: "今すぐ入れます！空いているうちにGO！" };
  if (min < 15)  return { emoji: "📱", text: "スマホを少し眺めていれば一瞬！もう少しの辛抱です。" };
  if (min < 45)  return { emoji: "🥤", text: "飲み物を買って準備しておくと快適。近くのお店情報もチェックしておこう！" };
  return           { emoji: "⏳", text: "長丁場！水分補給を忘れずに。近くのデカ盛り記事でも読んで待ちましょう。" };
}

function pickColor(min: number): string {
  if (min === 0)  return "#22C55E";
  if (min < 15)   return TEAL;
  if (min < 45)   return BRAND_COLOR;
  return "#EF4444";
}

function pickBg(min: number): string {
  if (min === 0)  return "#F0FFF4";
  if (min < 15)   return "#ECFEFF";
  if (min < 45)   return "#FFF9F5";
  return "#FFF5F5";
}

export default function WaitTimeClient() {
  const [genreId, setGenreId] = useState<string | null>(null);
  const [people, setPeople] = useState(10);
  const [seats, setSeats] = useState(20);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const genre = useMemo(
    () => WAIT_TIME_GENRES.find((g) => g.id === genreId) ?? null,
    [genreId]
  );

  const waitMin = useMemo(() => {
    if (!genre || people === 0) return 0;
    return Math.ceil((people / seats) * genre.avgStayMin);
  }, [genre, people, seats]);

  const arrivalStr = useMemo(() => {
    if (!mounted) return "--時--分";
    const est = new Date(Date.now() + waitMin * 60_000);
    return `${est.getHours()}時${String(est.getMinutes()).padStart(2, "0")}分`;
  }, [waitMin, mounted]);

  const advice = getAdvice(waitMin);
  const color = pickColor(waitMin);

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
            行列
            <Box component="span" sx={{ color: TEAL }}>待ち時間</Box>
            予測シミュレーター
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#666" }}>
            並び人数と席数を入れるだけ。入店予定時刻をリアルタイム計算！
          </Typography>
        </Box>

        {/* ── 1. ジャンル選択 ── */}
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
            1. お店のジャンルを選ぶ
          </Typography>
          <Stack spacing={1.5}>
            {WAIT_TIME_GENRES.map((g) => {
              const active = genreId === g.id;
              return (
                <Box
                  key={g.id}
                  component="button"
                  onClick={() => setGenreId(g.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    border: `2px solid ${active ? TEAL : "#DDD"}`,
                    bgcolor: active ? "#ECFEFF" : "#FAFAFA",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                    transition: "all 0.15s",
                    "&:hover": { borderColor: TEAL, bgcolor: "#F0FDFF" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box component="span" sx={{ fontSize: "1.8rem", lineHeight: 1 }}>{g.emoji}</Box>
                    <Box>
                      <Typography sx={{ fontWeight: 900, fontSize: "0.95rem", color: active ? TEAL : DARK_COLOR, lineHeight: 1.3 }}>
                        {g.label}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.72rem", color: "#999" }}>
                        {g.examples}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                    <Typography sx={{ fontWeight: 900, fontSize: "1.1rem", color: active ? TEAL : "#BBB" }}>
                      約{g.avgStayMin}分
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.65rem", color: "#CCC" }}>
                      平均滞在
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Paper>

        {/* ── 2. 並んでいる人数 ── */}
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 900, color: DARK_COLOR, display: "flex", alignItems: "center", gap: 1 }}
            >
              <PeopleAltIcon sx={{ color: TEAL }} />
              2. 前に並んでいる人数
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
              <Typography sx={{ fontWeight: 900, fontSize: "2.8rem", lineHeight: 1, color: TEAL }}>
                {people}
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#888" }}>人</Typography>
            </Box>
          </Box>
          <Slider
            value={people}
            onChange={(_, v) => setPeople(v as number)}
            min={0}
            max={50}
            step={1}
            marks={[
              { value: 0,  label: "0" },
              { value: 10, label: "10" },
              { value: 20, label: "20" },
              { value: 30, label: "30" },
              { value: 40, label: "40" },
              { value: 50, label: "50↑" },
            ]}
            sx={{
              color: TEAL,
              "& .MuiSlider-thumb": { width: 26, height: 26 },
              "& .MuiSlider-markLabel": { fontWeight: 700, fontSize: "0.72rem", color: "#888" },
            }}
          />
        </Paper>

        {/* ── 3. 席数 ── */}
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
            3. おおよその席数
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
            {SEAT_PRESETS.map((preset) => {
              const active = seats === preset.seats;
              return (
                <Box
                  key={preset.seats}
                  component="button"
                  onClick={() => setSeats(preset.seats)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.3,
                    py: 2.5,
                    borderRadius: 3,
                    border: `2px solid ${active ? TEAL : "#DDD"}`,
                    bgcolor: active ? "#ECFEFF" : "#FAFAFA",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: active ? `3px 3px 0px ${TEAL}` : "none",
                    transition: "all 0.15s",
                    "&:hover": { borderColor: TEAL, bgcolor: "#F0FDFF" },
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: "1.05rem", color: active ? TEAL : DARK_COLOR }}>
                    {preset.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", color: active ? TEAL : "#999" }}>
                    約{preset.seats}席
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* ── 結果カード ── */}
        {genre && (
          <Paper
            elevation={0}
            key={genreId}
            sx={{
              p: { xs: 2.5, md: 3 },
              mb: 3,
              borderRadius: 4,
              border: `3px solid ${color}`,
              boxShadow: `6px 6px 0px ${color}`,
              bgcolor: pickBg(waitMin),
              transition: "border-color 0.4s, box-shadow 0.4s, background-color 0.4s",
              animation: `${fadeUp} 0.25s ease-out`,
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 900, color: "#AAA", letterSpacing: "0.1em", display: "block", mb: 2 }}>
              予測結果
            </Typography>

            {/* 待ち時間大表示 */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mb: 0.5 }}>
                <AccessTimeIcon sx={{ color, fontSize: "1.8rem", transition: "color 0.4s" }} />
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#888" }}>
                  予測待ち時間
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 1, mb: 1.5 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "5rem", md: "6.5rem" },
                    lineHeight: 1,
                    color,
                    transition: "color 0.4s",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {waitMin === 0 ? "0" : `約${waitMin}`}
                </Typography>
                <Typography sx={{ fontWeight: 900, fontSize: "1.6rem", color: "#888" }}>分</Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, color: "#555", fontSize: { xs: "0.95rem", md: "1.05rem" } }}
              >
                今から並ぶと{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 900, color, fontSize: { xs: "1.15rem", md: "1.35rem" }, transition: "color 0.4s" }}
                >
                  {arrivalStr}
                </Box>
                {" "}頃のご案内予想
              </Typography>
            </Box>

            {/* アドバイス */}
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                bgcolor: "#fff",
                border: `2px solid ${color}`,
                transition: "border-color 0.4s",
              }}
            >
              <Typography
                sx={{ fontWeight: 900, fontSize: { xs: "0.95rem", md: "1.05rem" }, color: DARK_COLOR, lineHeight: 1.7 }}
              >
                {advice.emoji}　{advice.text}
              </Typography>
            </Box>

            {/* 計算根拠 */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.025)",
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#CCC", display: "block", mb: 0.3 }}>
                計算根拠（目安）
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: "#999" }}>
                {people}人 ÷ {seats}席 × {genre.avgStayMin}分（{genre.label}の平均滞在） ≒ {waitMin}分
              </Typography>
            </Box>
          </Paper>
        )}

        {/* ── 内部リンク：関連駅 ── */}
        {genre && (
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
              待っている間に読む：{genre.label}が人気の駅
            </Typography>
            <Typography variant="caption" sx={{ color: "#888", fontWeight: 700, mb: 2, display: "block" }}>
              各駅周辺のデカ盛り・がっつり店をチェック
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {genre.stations.filter(isStationReachable).map((station) => (
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
                        borderColor: TEAL,
                        color: TEAL,
                        transform: "translate(-1px, -1px)",
                        boxShadow: `4px 4px 0px ${TEAL}`,
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
