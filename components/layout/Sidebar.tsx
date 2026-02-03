"use client";

import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import InfoIcon from "@mui/icons-material/Info"; // 追加
import PolicyIcon from "@mui/icons-material/Policy"; // 追加
import MailIcon from "@mui/icons-material/Mail"; // 追加
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu"; // 追加
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { TODOFUKEN } from "../../constants/todofukenData";

export type StationDto = {
  name: string;
  count: number;
  check: boolean;
  x: number;
  y: number;
};

export type RosenDto = {
  id: string;
  line: string;
};

type SidebarProps = {
  onClose?: () => void;
};

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const [selectedPrefId, setSelectedPrefId] = useState<string>("");
  const [selectedLineName, setSelectedLineName] = useState<string>("");
  const [rosenList, setRosenList] = useState<RosenDto[]>([]);
  const [stationList, setStationList] = useState<StationDto[]>([]);
  const [loadingLines, setLoadingLines] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [stationSearchText, setStationSearchText] = useState("");

  const checkedStations = useMemo(
    () => stationList.filter((s) => s.check),
    [stationList]
  );

  const handleCurrentLocationSearch = () => {
    if (!navigator.geolocation) {
      alert("位置情報に対応していません。");
      return;
    }
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://express.heartrails.com/api/json?method=getStations&x=${longitude}&y=${latitude}`
          );
          const data = await res.json();
          if (data.response?.station?.[0]) {
            const s = data.response.station[0];
            sendGAEvent({
              event: "search_current_location",
              search_term: s.name,
            });
            router.push(
              `/station/${encodeURIComponent(s.name)}?lat=${s.y}&lng=${s.x}`
            );
            if (onClose) onClose();
          }
        } catch (e) {
          alert("駅情報の取得に失敗しました。");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLoadingLocation(false);
        alert("位置情報を許可してください。");
      }
    );
  };

  const handleChangePrefectures = async (prefId: string) => {
    setSelectedPrefId(prefId);
    setSelectedLineName("");
    setRosenList([]);
    setStationList([]);
    const targetPref = TODOFUKEN.find((v) => String(v.id) === String(prefId));
    if (!targetPref) return;
    setLoadingLines(true);
    try {
      const params = new URLSearchParams({
        method: 'getLines',
        prefecture: targetPref.name
      })
      const res = await fetch(`/api/prefectures?${params}`);
      const data = await res.json();
      if (data.response?.line) {
        setRosenList(
          data.response.line.map((l: string) => ({ id: l, line: l }))
        );
      }
    } finally {
      setLoadingLines(false);
    }
  };

  const handleChangeLine = async (lineName: string) => {
    setSelectedLineName(lineName);
    try {
      const res = await fetch(
        `https://express.heartrails.com/api/json?method=getStations&line=${encodeURIComponent(
          lineName
        )}`
      );
      const data = await res.json();
      if (data.response?.station) {
        setStationList(
          data.response.station.map((s: any) => ({
            name: s.name,
            count: 0,
            check: false,
            x: s.x,
            y: s.y,
          }))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = () => {
    if (checkedStations.length === 0) return;
    const names = checkedStations.map((s) => s.name).join(",");
    sendGAEvent({ event: "search", search_term: names });
    if (checkedStations.length === 1) {
      const s = checkedStations[0];
      router.push(
        `/station/${encodeURIComponent(s.name)}?lat=${s.y}&lng=${s.x}`
      );
    } else {
      const query = new URLSearchParams({
        station: names,
        lat: checkedStations.map((s) => s.y).join(","),
        lng: checkedStations.map((s) => s.x).join(","),
      }).toString();
      router.push(`/?${query}`);
    }
    if (onClose) onClose();
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#fff" }}>
      {/* --- ヘッダー・ロゴ --- */}
      <Box sx={{ px: 3, py: 3, borderBottom: "1px solid #EEE" }}>
        <Link href="/" style={{ textDecoration: "none" }} onClick={onClose}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              color: DARK_COLOR,
              letterSpacing: "-0.02em",
              mb: 1,
            }}
          >
            ガツガツ<Box component="span" sx={{ color: BRAND_COLOR }}>グルメ</Box>
          </Typography>
        </Link>
        <Typography variant="caption" sx={{ color: "#999", fontWeight: 700 }}>
          駅近・デカ盛り・高コスパ店検索
        </Typography>
      </Box>

      {/* --- メインコンテンツ（スクロールエリア） --- */}
      <Box sx={{ flex: 1, overflowY: "auto", py: 2 }}>
        
        {/* 現在地検索 */}
        <Box sx={{ px: 3, mb: 4 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={loadingLocation ? <CircularProgress size={16} sx={{ color: "white" }} /> : <MyLocationIcon />}
            onClick={handleCurrentLocationSearch}
            disabled={loadingLocation}
            sx={{
              borderRadius: "12px",
              bgcolor: DARK_COLOR,
              color: "#fff",
              py: 1.5,
              fontWeight: 900,
              "&:hover": { bgcolor: "#333" },
            }}
          >
            {loadingLocation ? "現在地を取得中..." : "現在地から探す"}
          </Button>
        </Box>

        {/* 検索セクション */}
        <Box sx={{ px: 3, mb: 4 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: DARK_COLOR, mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <SearchIcon fontSize="small" sx={{ color: BRAND_COLOR }} /> エリア・路線から探す
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: "16px", bgcolor: "#F8F9FA", border: "1px solid #EEE" }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <Select
                value={selectedPrefId}
                onChange={(e) => handleChangePrefectures(e.target.value)}
                displayEmpty
                size="small"
                sx={{ bgcolor: "white", borderRadius: "8px", fontWeight: 700 }}
              >
                <MenuItem value="" disabled>都道府県を選択</MenuItem>
                {TODOFUKEN.map((v) => (
                  <MenuItem key={v.id} value={String(v.id)}>{v.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={!selectedPrefId || loadingLines}>
              <Select
                value={selectedLineName}
                onChange={(e) => handleChangeLine(e.target.value)}
                displayEmpty
                size="small"
                sx={{ bgcolor: "white", borderRadius: "8px", fontWeight: 700 }}
              >
                <MenuItem value="" disabled>{loadingLines ? "読み込み中..." : "路線を選択"}</MenuItem>
                {rosenList.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.line}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Box>

        {/* 駅リスト（選択時のみ表示） */}
        {stationList.length > 0 && (
          <Box sx={{ px: 3, mb: 4 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "text.secondary", mb: 1, display: "block" }}>
              駅を選択 ({checkedStations.length})
            </Typography>
            <Paper variant="outlined" sx={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #EEE" }}>
              <List dense sx={{ maxHeight: 200, overflowY: "auto", bgcolor: "white" }}>
                {stationList.map((s) => (
                  <ListItemButton
                    key={s.name}
                    onClick={() => setStationList(prev => prev.map(item => item.name === s.name ? { ...item, check: !item.check } : item))}
                  >
                    <Checkbox checked={s.check} size="small" sx={{ p: 0, mr: 1, color: BRAND_COLOR, "&.Mui-checked": { color: BRAND_COLOR } }} />
                    <ListItemText primary={s.name} primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: s.check ? 900 : 700 }} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Box>
        )}

        <Divider sx={{ mx: 3, mb: 4 }} />

        {/* --- サイトメニュー（審査突破に必須） --- */}
        <Box sx={{ px: 2, mb: 4 }}>
          <Typography variant="caption" sx={{ fontWeight: 900, color: "#999", ml: 2, mb: 1, display: "block", letterSpacing: "0.1em" }}>
            SITE MENU
          </Typography>
          <List dense>
            <MenuLink href="/about" icon={<InfoIcon />} label="ガツガツグルメとは" onClick={onClose} />
            <MenuLink href="/privacy" icon={<PolicyIcon />} label="プライバシーポリシー" onClick={onClose} />
            <MenuLink href="/contact" icon={<MailIcon />} label="お問い合わせ" onClick={onClose} />
          </List>
        </Box>
      </Box>

      {/* --- 下部固定検索ボタン --- */}
      <Box sx={{ p: 3, borderTop: "1px solid #EEE", bgcolor: "#fff" }}>
        <Button
          fullWidth
          variant="contained"
          disabled={checkedStations.length === 0}
          onClick={handleSearch}
          sx={{
            py: 1.5,
            borderRadius: "12px",
            fontWeight: 900,
            background: checkedStations.length > 0 ? `linear-gradient(45deg, ${BRAND_COLOR} 30%, #FF8E53 90%)` : "#CCC",
            boxShadow: checkedStations.length > 0 ? "0 4px 12px rgba(255, 107, 0, 0.3)" : "none",
            "&:hover": { background: `linear-gradient(45deg, #E65A00 30%, #FF8E53 90%)` }
          }}
        >
          {checkedStations.length > 0 ? `${checkedStations.length}件の駅で検索` : "駅を選択してください"}
        </Button>
      </Box>
    </Box>
  );
}

// サブコンポーネント：メニューリンク
function MenuLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }} onClick={onClick}>
      <ListItemButton sx={{ borderRadius: "10px", mb: 0.5 }}>
        <ListItemIcon sx={{ minWidth: 40, color: BRAND_COLOR }}>{icon}</ListItemIcon>
        <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 800, fontSize: "0.9rem", color: "#444" }} />
      </ListItemButton>
    </Link>
  );
}

// アイコンインポート忘れ防止用
function SearchIcon(props: any) {
  return (
    <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}