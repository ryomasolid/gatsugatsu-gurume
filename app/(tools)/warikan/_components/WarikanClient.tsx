"use client";

import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  keyframes,
} from "@mui/material";
import { useMemo, useState } from "react";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── 型 ────────────────────────────────────────────
type Group = {
  id: string;
  name: string;
  count: string;
  adjustSign: "plus" | "minus";
  adjustAbs: string;
};

type ResultGroup = {
  id: string;
  name: string;
  count: number;
  amountPerPerson: number;
  subtotal: number;
};

type CalcResult = {
  groups: ResultGroup[];
  totalCollected: number;
  billAmount: number;
  remainder: number;
};

// ── 初期値 ────────────────────────────────────────
const INITIAL_GROUPS: Group[] = [
  { id: "base", name: "通常メンバー", count: "", adjustSign: "plus", adjustAbs: "0" },
  { id: "g1",   name: "上司・多め出し", count: "1", adjustSign: "plus", adjustAbs: "2000" },
];

let nextId = 2;

// ── メインコンポーネント ────────────────────────
export default function WarikanClient() {
  const [totalAmount, setTotalAmount] = useState("");
  const [totalPeople, setTotalPeople] = useState("");
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // 通常メンバー人数（自動計算）
  const baseCount = useMemo(() => {
    const N = parseInt(totalPeople) || 0;
    const others = groups
      .filter((g) => g.id !== "base")
      .reduce((s, g) => s + (parseInt(g.count) || 0), 0);
    return Math.max(N - others, 0);
  }, [totalPeople, groups]);

  // ── グループ操作 ──────────────────────────────
  const updateGroup = (id: string, patch: Partial<Group>) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
    setResult(null);
  };

  const addGroup = () => {
    const id = `g${nextId++}`;
    setGroups((prev) => [
      ...prev,
      { id, name: "新しいグループ", count: "1", adjustSign: "minus", adjustAbs: "1000" },
    ]);
    setResult(null);
  };

  const removeGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setResult(null);
  };

  // ── 計算 ──────────────────────────────────────
  const calculate = () => {
    setError("");
    const T = parseInt(totalAmount.replace(/,/g, ""));
    const N = parseInt(totalPeople);

    if (!totalAmount || isNaN(T) || T <= 0) { setError("お会計金額を正しく入力してください"); return; }
    if (!totalPeople || isNaN(N) || N <= 0) { setError("参加人数を入力してください"); return; }
    if (baseCount <= 0) { setError("通常メンバーが0人以下になっています。グループの人数を見直してください"); return; }

    const parsed = groups.map((g) => ({
      ...g,
      count: g.id === "base" ? baseCount : (parseInt(g.count) || 0),
      adjustment: (g.adjustSign === "plus" ? 1 : -1) * (parseInt(g.adjustAbs) || 0),
    }));

    // 基本金額 B = (T - Σ(ni × ai)) / N
    const adjustmentTotal = parsed
      .filter((g) => g.id !== "base")
      .reduce((s, g) => s + g.count * g.adjustment, 0);
    const baseRaw = (T - adjustmentTotal) / N;

    // 各グループの1人あたり金額（100円単位で切り上げ）
    const resultGroups: ResultGroup[] = parsed.map((g) => {
      const rawAmt = baseRaw + g.adjustment;
      if (rawAmt <= 0) {
        setError(`「${g.name}」の支払額がマイナスになります。傾斜金額を小さくしてください`);
        return { id: g.id, name: g.name, count: g.count, amountPerPerson: 0, subtotal: 0 };
      }
      const rounded = Math.ceil(rawAmt / 100) * 100;
      return { id: g.id, name: g.name, count: g.count, amountPerPerson: rounded, subtotal: rounded * g.count };
    });

    if (resultGroups.some((g) => g.amountPerPerson === 0)) return;

    const totalCollected = resultGroups.reduce((s, g) => s + g.subtotal, 0);
    setResult({ groups: resultGroups, totalCollected, billAmount: T, remainder: totalCollected - T });
  };

  // ── コピー ────────────────────────────────────
  const copyText = () => {
    if (!result) return;
    const lines = [
      "【がつがつグルメ流・割り勘結果】🍽️",
      "",
      `💰 お会計：${result.billAmount.toLocaleString()}円`,
      `👥 参加人数：${totalPeople}人`,
      "",
      "━━ お一人あたりの金額 ━━",
      ...result.groups.map((g) => `${g.name}（${g.count}人）：${g.amountPerPerson.toLocaleString()}円/人`),
      "",
      `📊 集計合計：${result.totalCollected.toLocaleString()}円`,
      result.remainder > 0
        ? `💸 幹事預かり金：${result.remainder.toLocaleString()}円`
        : "",
      "",
      "📱 がつがつグルメ 割り勘ツールで計算",
      "https://gatsugatsu-gurume.com/warikan",
    ]
      .filter((l) => l !== undefined)
      .join("\n");

    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh", pt: { xs: 10, md: 4 }, pb: 8 }}>
      <Container maxWidth="sm">

        {/* ── タイトル ── */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1.5, mb: 1 }}>
            <GroupsIcon sx={{ fontSize: "2.4rem", color: BRAND_COLOR }} />
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.4rem" }, letterSpacing: "-0.03em", color: DARK_COLOR }}
            >
              割り勘
              <Box component="span" sx={{ color: BRAND_COLOR }}>＆傾斜</Box>
              計算
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "#666" }}>
            幹事さん向け。グループごとに金額を変えて一発計算。
          </Typography>
        </Box>

        {/* ── STEP 1: 基本情報 ── */}
        <StepCard step={1} title="基本情報を入力">
          <Stack spacing={2}>
            <TextField
              label="お会計金額（円）"
              placeholder="例：32000"
              value={totalAmount}
              onChange={(e) => { setTotalAmount(e.target.value.replace(/[^\d]/g, "")); setResult(null); }}
              InputProps={{ endAdornment: <InputAdornment position="end">円</InputAdornment> }}
              fullWidth
              inputProps={{ inputMode: "numeric" }}
            />
            <TextField
              label="参加総人数（人）"
              placeholder="例：10"
              value={totalPeople}
              onChange={(e) => { setTotalPeople(e.target.value.replace(/[^\d]/g, "")); setResult(null); }}
              InputProps={{ endAdornment: <InputAdornment position="end">人</InputAdornment> }}
              fullWidth
              inputProps={{ inputMode: "numeric" }}
            />
          </Stack>
        </StepCard>

        {/* ── STEP 2: グループ設定 ── */}
        <StepCard step={2} title="グループ・傾斜を設定">
          <Stack spacing={2}>
            {/* 通常メンバー（基本グループ） */}
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 3, borderColor: BRAND_COLOR, bgcolor: "#FFF9F5" }}
            >
              <Typography variant="caption" sx={{ fontWeight: 900, color: BRAND_COLOR, letterSpacing: "0.1em", mb: 1, display: "block" }}>
                基本グループ（自動計算）
              </Typography>
              <Stack spacing={1.5}>
                <TextField
                  label="グループ名"
                  size="small"
                  value={groups.find((g) => g.id === "base")?.name ?? ""}
                  onChange={(e) => updateGroup("base", { name: e.target.value })}
                  fullWidth
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      px: 2.5, py: 1, borderRadius: 2, border: `2px solid ${BRAND_COLOR}`,
                      bgcolor: "#FFF5ED", fontWeight: 900, fontSize: "1.1rem", color: BRAND_COLOR,
                      minWidth: 60, textAlign: "center",
                    }}
                  >
                    {baseCount}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#888" }}>
                    人（総人数 − 他グループの合計）
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* 追加グループ */}
            {groups.filter((g) => g.id !== "base").map((group) => (
              <GroupRow
                key={group.id}
                group={group}
                onChange={(patch) => updateGroup(group.id, patch)}
                onRemove={() => removeGroup(group.id)}
              />
            ))}

            {/* グループ追加ボタン */}
            <Button
              variant="outlined"
              onClick={addGroup}
              sx={{
                borderRadius: 2,
                border: `2px dashed #CCC`,
                color: "#999",
                fontWeight: 900,
                py: 1.5,
                "&:hover": { border: `2px dashed ${BRAND_COLOR}`, color: BRAND_COLOR, bgcolor: "#FFF5ED" },
              }}
            >
              ＋ グループを追加する
            </Button>
          </Stack>
        </StepCard>

        {/* ── エラー ── */}
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontWeight: 700 }}>
            {error}
          </Alert>
        )}

        {/* ── 計算ボタン ── */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={calculate}
          sx={{
            py: 2.5,
            mb: 4,
            borderRadius: 3,
            fontWeight: 900,
            fontSize: "1.1rem",
            background: `linear-gradient(45deg, ${BRAND_COLOR} 30%, #FF8E53 90%)`,
            border: `2px solid ${DARK_COLOR}`,
            boxShadow: `4px 4px 0px ${DARK_COLOR}`,
            "&:hover": { transform: "translate(-2px, -2px)", boxShadow: `6px 6px 0px ${DARK_COLOR}` },
            "&:active": { transform: "translate(2px, 2px)", boxShadow: "none" },
            transition: "all 0.15s",
          }}
        >
          計算する
        </Button>

        {/* ── 計算結果 ── */}
        {result && (
          <Box sx={{ animation: `${slideUp} 0.3s ease-out` }}>
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
              <Typography variant="h6" sx={{ fontWeight: 900, color: DARK_COLOR, mb: 3 }}>
                💰 計算結果
              </Typography>

              {/* 各グループの金額 */}
              <Stack spacing={2} sx={{ mb: 3 }}>
                {result.groups.map((g) => (
                  <Box
                    key={g.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "#F8F9FA",
                      border: "1px solid #EEE",
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: DARK_COLOR }}>
                        {g.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#888", fontWeight: 700 }}>
                        {g.count}人 × {g.amountPerPerson.toLocaleString()}円
                      </Typography>
                    </Box>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 900, color: BRAND_COLOR, letterSpacing: "-0.02em" }}
                    >
                      {g.amountPerPerson.toLocaleString()}
                      <Box component="span" sx={{ fontSize: "0.9rem", ml: 0.3 }}>円</Box>
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* 集計 */}
              <Stack spacing={1}>
                <SummaryRow label="お会計"     value={result.billAmount}     />
                <SummaryRow label="集計合計"   value={result.totalCollected} highlight />
                {result.remainder > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#F0FFF4",
                      border: "1px solid #86EFAC",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 900, color: "#16A34A" }}>
                      💸 幹事預かり金
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 900, color: "#16A34A" }}>
                      {result.remainder.toLocaleString()}円
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* コピーボタン */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
              onClick={copyText}
              sx={{
                py: 2,
                borderRadius: 3,
                fontWeight: 900,
                fontSize: "1rem",
                bgcolor: copied ? "#22C55E" : DARK_COLOR,
                border: `2px solid ${copied ? "#16A34A" : DARK_COLOR}`,
                boxShadow: `4px 4px 0px ${copied ? "#16A34A" : DARK_COLOR}`,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: copied ? "#16A34A" : "#333",
                  transform: "translate(-2px, -2px)",
                  boxShadow: `6px 6px 0px ${copied ? "#16A34A" : DARK_COLOR}`,
                },
              }}
            >
              {copied ? "コピーしました！" : "LINE・SNS用テキストをコピー"}
            </Button>

            {copied && (
              <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 1, color: "#666", fontWeight: 700 }}>
                そのままLINEに貼り付けてください
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

// ── サブコンポーネント：ステップカード ────────────
function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
        <Box
          sx={{
            width: 28, height: 28, borderRadius: "50%",
            bgcolor: BRAND_COLOR, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "0.85rem", flexShrink: 0,
          }}
        >
          {step}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR }}>
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  );
}

// ── サブコンポーネント：グループ行 ────────────────
function GroupRow({
  group,
  onChange,
  onRemove,
}: {
  group: Group;
  onChange: (patch: Partial<Group>) => void;
  onRemove: () => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, position: "relative" }}>
      <IconButton
        size="small"
        onClick={onRemove}
        sx={{ position: "absolute", top: 8, right: 8, color: "#CCC", "&:hover": { color: "#EF4444" } }}
      >
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>

      <Stack spacing={1.5} sx={{ pr: 4 }}>
        <TextField
          label="グループ名"
          size="small"
          value={group.name}
          onChange={(e) => onChange({ name: e.target.value })}
          fullWidth
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="人数"
            size="small"
            value={group.count}
            onChange={(e) => onChange({ count: e.target.value.replace(/[^\d]/g, "") })}
            inputProps={{ inputMode: "numeric" }}
            InputProps={{ endAdornment: <InputAdornment position="end">人</InputAdornment> }}
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 64 }}>
            <Select
              value={group.adjustSign}
              onChange={(e) => onChange({ adjustSign: e.target.value as "plus" | "minus" })}
              sx={{ fontWeight: 900 }}
            >
              <MenuItem value="plus" sx={{ fontWeight: 900, color: "#22C55E" }}>＋</MenuItem>
              <MenuItem value="minus" sx={{ fontWeight: 900, color: "#EF4444" }}>－</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="傾斜金額"
            size="small"
            value={group.adjustAbs}
            onChange={(e) => onChange({ adjustAbs: e.target.value.replace(/[^\d]/g, "") })}
            inputProps={{ inputMode: "numeric" }}
            InputProps={{ endAdornment: <InputAdornment position="end">円</InputAdornment> }}
            sx={{ flex: 1.5 }}
          />
        </Stack>
        <Typography variant="caption" sx={{ color: "#888", fontWeight: 700 }}>
          通常メンバーより{group.adjustSign === "plus" ? "+" : "－"}{(parseInt(group.adjustAbs) || 0).toLocaleString()}円
        </Typography>
      </Stack>
    </Paper>
  );
}

// ── サブコンポーネント：集計行 ────────────────────
function SummaryRow({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5 }}>
      <Typography variant="body2" sx={{ fontWeight: 800, color: "#666" }}>{label}</Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 900, color: highlight ? BRAND_COLOR : DARK_COLOR, fontSize: highlight ? "1.1rem" : "1rem" }}
      >
        {value.toLocaleString()}円
      </Typography>
    </Box>
  );
}
