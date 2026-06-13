"use client";

import {
  MESHI_TYPES,
  MESHI_TYPE_ORDER,
  MeshiType,
  MeshiTypeId,
  SHINDAN_QUESTIONS,
} from "@/constants/shindanData";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import PsychologyIcon from "@mui/icons-material/Psychology";
import ReplayIcon from "@mui/icons-material/Replay";
import ShareIcon from "@mui/icons-material/Share";
import {
  Box,
  Button,
  Chip,
  Container,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  keyframes,
} from "@mui/material";
import { sendGAEvent } from "@next/third-parties/google";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";
const ACCENT_COLOR = "#7C3AED";

const bounceIn = keyframes`
  0%   { transform: scale(0.5) rotate(-3deg); opacity: 0; }
  60%  { transform: scale(1.08) rotate(1deg); opacity: 1; }
  80%  { transform: scale(0.96); }
  100% { transform: scale(1) rotate(0deg); }
`;

const slideIn = keyframes`
  0%   { transform: translateX(24px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

type Phase = "intro" | "quiz" | "result";

export default function ShindanClient() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<MeshiTypeId, number>>(
    () => Object.fromEntries(MESHI_TYPE_ORDER.map((id) => [id, 0])) as Record<MeshiTypeId, number>
  );
  const [result, setResult] = useState<MeshiType | null>(null);

  const start = () => {
    sendGAEvent({ event: "shindan_start" });
    setPhase("quiz");
  };

  const answer = useCallback(
    (primary: MeshiTypeId, secondary: MeshiTypeId) => {
      const next = { ...scores };
      next[primary] += 2;
      next[secondary] += 1;

      if (questionIndex + 1 >= SHINDAN_QUESTIONS.length) {
        // 同点の場合は MESHI_TYPE_ORDER の先頭側を優先
        const winnerId = MESHI_TYPE_ORDER.reduce((best, id) =>
          next[id] > next[best] ? id : best
        );
        const winner = MESHI_TYPES[winnerId];
        sendGAEvent({ event: "shindan_result", result_type: winnerId });
        setScores(next);
        setResult(winner);
        setPhase("result");
      } else {
        setScores(next);
        setQuestionIndex((i) => i + 1);
      }
    },
    [scores, questionIndex]
  );

  const reset = () => {
    setPhase("intro");
    setQuestionIndex(0);
    setScores(
      Object.fromEntries(MESHI_TYPE_ORDER.map((id) => [id, 0])) as Record<MeshiTypeId, number>
    );
    setResult(null);
  };

  const shareUrl = useMemo(() => {
    if (!result) return "";
    const text = `私の飯タイプは【${result.name}】${result.emoji} でした！\n「${result.catchphrase}」\n#飯タイプ診断 #ガツガツグルメ`;
    const params = new URLSearchParams({
      text,
      url: "https://gatsugatsu-gurume.com/shindan",
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [result]);

  const currentQuestion = SHINDAN_QUESTIONS[questionIndex];
  const progress = (questionIndex / SHINDAN_QUESTIONS.length) * 100;
  const goodMatch = result ? MESHI_TYPES[result.goodMatch] : null;

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pt: { xs: 10, md: 4 }, pb: 8 }}>
      <Container maxWidth="md">
        {/* ページタイトル */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, mb: 1.5 }}>
            <PsychologyIcon sx={{ fontSize: "2.8rem", color: ACCENT_COLOR }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 900, fontSize: { xs: "2rem", md: "2.8rem" }, letterSpacing: "-0.03em", color: DARK_COLOR }}
            >
              飯タイプ
              <Box component="span" sx={{ color: ACCENT_COLOR }}>診断</Box>
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ fontWeight: 700, color: "#666" }}>
            8つの質問でわかる、あなたの「食の本性」。全8タイプ。
          </Typography>
        </Box>

        {/* イントロ */}
        {phase === "intro" && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              border: `2px solid ${DARK_COLOR}`,
              boxShadow: `6px 6px 0px ${DARK_COLOR}`,
              bgcolor: "#fff",
              textAlign: "center",
            }}
          >
            <Typography sx={{ fontSize: "3.5rem", mb: 1 }}>
              🍚💴🍜🥩🌶️🍱📱🥗
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, color: DARK_COLOR, mb: 2 }}>
              あなたはどの「飯タイプ」？
            </Typography>
            <Typography variant="body1" sx={{ color: "#555", lineHeight: 2, mb: 4, textAlign: "left" }}>
              直感で答えるだけの2分診断。「限界デカ盛りストロンガー」「コスパ番長」「無限麺ループ族」など全8タイプの中から、あなたの食の本性を判定します。結果はX（旧Twitter）でシェアして、友達と飯タイプの相性をチェック！
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={start}
              sx={{
                py: 2.5,
                borderRadius: 3,
                fontWeight: 900,
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                background: `linear-gradient(45deg, ${ACCENT_COLOR} 30%, #A78BFA 90%)`,
                border: `2px solid ${DARK_COLOR}`,
                boxShadow: `4px 4px 0px ${DARK_COLOR}`,
                transition: "all 0.15s",
                "&:hover": {
                  transform: "translate(-2px, -2px)",
                  boxShadow: `6px 6px 0px ${DARK_COLOR}`,
                },
              }}
            >
              診断スタート（無料・登録不要）
            </Button>
          </Paper>
        )}

        {/* クイズ */}
        {phase === "quiz" && currentQuestion && (
          <Box key={questionIndex} sx={{ animation: `${slideIn} 0.3s ease-out` }}>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontWeight: 900, color: ACCENT_COLOR, whiteSpace: "nowrap" }}>
                Q{questionIndex + 1}/{SHINDAN_QUESTIONS.length}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  flex: 1,
                  height: 10,
                  borderRadius: 5,
                  bgcolor: "#E5E7EB",
                  "& .MuiLinearProgress-bar": { bgcolor: ACCENT_COLOR, borderRadius: 5 },
                }}
              />
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                border: `2px solid ${DARK_COLOR}`,
                boxShadow: `6px 6px 0px ${DARK_COLOR}`,
                bgcolor: "#fff",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 900, color: DARK_COLOR, mb: 3, lineHeight: 1.6 }}>
                {currentQuestion.question}
              </Typography>
              <Stack spacing={1.5}>
                {currentQuestion.choices.map((choice) => (
                  <Box
                    key={choice.label}
                    component="button"
                    onClick={() => answer(choice.primary, choice.secondary)}
                    sx={{
                      width: "100%",
                      textAlign: "left",
                      px: 2.5,
                      py: 2,
                      borderRadius: 3,
                      border: "2px solid #DDD",
                      bgcolor: "#fff",
                      color: DARK_COLOR,
                      fontWeight: 800,
                      fontSize: "1rem",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                      "&:hover": {
                        borderColor: ACCENT_COLOR,
                        color: ACCENT_COLOR,
                        transform: "translate(-2px, -2px)",
                        boxShadow: `4px 4px 0px ${ACCENT_COLOR}`,
                      },
                    }}
                  >
                    {choice.label}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        )}

        {/* 結果 */}
        {phase === "result" && result && (
          <Box sx={{ animation: `${bounceIn} 0.55s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards` }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                mb: 3,
                borderRadius: 4,
                border: `2px solid ${ACCENT_COLOR}`,
                boxShadow: `6px 6px 0px ${ACCENT_COLOR}`,
                bgcolor: "#FAF5FF",
                textAlign: "center",
              }}
            >
              <Typography variant="caption" sx={{ color: "#888", fontWeight: 900, letterSpacing: "0.2em" }}>
                あなたの飯タイプは…
              </Typography>
              <Typography sx={{ fontSize: "4.5rem", lineHeight: 1.2, my: 1 }}>{result.emoji}</Typography>
              <Typography
                variant="h4"
                component="h2"
                sx={{ fontWeight: 900, color: ACCENT_COLOR, mb: 1, fontSize: { xs: "1.6rem", md: "2.2rem" } }}
              >
                {result.name}
              </Typography>
              <Chip
                label={result.catchphrase}
                sx={{ bgcolor: DARK_COLOR, color: "#fff", fontWeight: 900, mb: 3, maxWidth: "100%", height: "auto", py: 1, "& .MuiChip-label": { whiteSpace: "normal" } }}
              />
              <Typography variant="body1" sx={{ color: "#444", lineHeight: 2, textAlign: "left", mb: 3 }}>
                {result.description}
              </Typography>

              {goodMatch && (
                <Typography variant="body2" sx={{ fontWeight: 800, color: "#666", mb: 3 }}>
                  相性のいいタイプ：{goodMatch.emoji} {goodMatch.name}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<ShareIcon />}
                component="a"
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sendGAEvent({ event: "shindan_share", result_type: result.id })}
                sx={{
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 900,
                  fontSize: "1.05rem",
                  bgcolor: DARK_COLOR,
                  border: `2px solid ${DARK_COLOR}`,
                  boxShadow: `4px 4px 0px ${ACCENT_COLOR}`,
                  transition: "all 0.15s",
                  "&:hover": {
                    bgcolor: "#333",
                    transform: "translate(-2px, -2px)",
                    boxShadow: `6px 6px 0px ${ACCENT_COLOR}`,
                  },
                }}
              >
                結果をXでシェアする
              </Button>
            </Paper>

            {/* おすすめツール */}
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
                {result.name}のあなたにおすすめ
              </Typography>
              <Stack spacing={1.5}>
                <Link href={result.tool.href} style={{ textDecoration: "none" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2.5,
                      py: 1.8,
                      borderRadius: 3,
                      border: `2px solid ${BRAND_COLOR}`,
                      color: BRAND_COLOR,
                      fontWeight: 900,
                      boxShadow: `3px 3px 0px ${BRAND_COLOR}`,
                      transition: "all 0.15s",
                      "&:hover": { transform: "translate(-2px, -2px)", boxShadow: `5px 5px 0px ${BRAND_COLOR}` },
                    }}
                  >
                    {result.tool.label}
                    <NavigateNextIcon />
                  </Box>
                </Link>
              </Stack>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: DARK_COLOR, mt: 3, mb: 1.5 }}>
                {result.name}と相性のいい駅
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {result.stations.map((station) => (
                  <Link key={station} href={`/station/${station}`} style={{ textDecoration: "none" }}>
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
                      {station}駅のがっつり店
                      <NavigateNextIcon sx={{ fontSize: "1rem" }} />
                    </Box>
                  </Link>
                ))}
              </Stack>
            </Paper>

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
              もう一回診断する
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}
