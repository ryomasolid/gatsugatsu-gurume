"use client";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MapIcon from "@mui/icons-material/Map";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import TrainIcon from "@mui/icons-material/Train";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  FormControl,
  InputBase,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { todofuken } from "../constants";

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

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const [selectedPrefId, setSelectedPrefId] = useState<string>("");
  const [selectedLineName, setSelectedLineName] = useState<string>("");
  const [isStationListOpen, setIsStationListOpen] = useState<boolean>(false);
  const [rosenList, setRosenList] = useState<RosenDto[]>([]);
  const [stationList, setStationList] = useState<StationDto[]>([]);
  const [loadingLines, setLoadingLines] = useState(false);
  const [loadingStations, setLoadingStations] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [stationSearchText, setStationSearchText] = useState("");

  const dropdownMenuProps = {
    disableScrollLock: true,
    anchorOrigin: { vertical: "bottom" as const, horizontal: "left" as const },
    transformOrigin: { vertical: "top" as const, horizontal: "left" as const },
    PaperProps: {
      sx: {
        maxHeight: 250,
        mt: 0.5,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        borderRadius: "8px",
      },
    },
  };

  const filteredStations = useMemo(() => {
    return stationList.filter((s) => s.name.includes(stationSearchText));
  }, [stationList, stationSearchText]);

  const handleCurrentLocationSearch = () => {
    if (!navigator.geolocation) {
      alert("お使いのブラウザは位置情報に対応していません。");
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
          if (data.response?.station?.length > 0) {
            const s = data.response.station[0];
            sendGAEvent({
              event: "search_current_location",
              search_term: s.name,
            });
            const query = new URLSearchParams({
              station: s.name,
              lat: String(s.y),
              lng: String(s.x),
            }).toString();
            router.push(`/?${query}`);
            if (onClose) onClose();
          } else {
            alert("近くに駅が見つかりませんでした。");
          }
        } catch (e) {
          alert("駅情報の取得に失敗しました。");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setLoadingLocation(false);
        alert("位置情報の取得を許可してください。");
      }
    );
  };

  const handleChangePrefectures = async (prefId: string) => {
    setSelectedPrefId(prefId);
    setSelectedLineName("");
    setRosenList([]);
    setStationList([]);
    setIsStationListOpen(false);
    setStationSearchText("");
    const targetPref = todofuken.find((v) => String(v.id) === String(prefId));
    if (!targetPref) return;
    setLoadingLines(true);
    try {
      const res = await fetch(
        `https://express.heartrails.com/api/json?method=getLines&prefecture=${encodeURIComponent(
          targetPref.name
        )}`
      );
      const data = await res.json();
      if (data.response?.line) {
        setRosenList(
          data.response.line.map((l: string) => ({ id: l, line: l }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLines(false);
    }
  };

  const handleChangeLine = async (lineName: string) => {
    setSelectedLineName(lineName);
    setStationList([]);
    setIsStationListOpen(true);
    setLoadingStations(true);
    setStationSearchText("");
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
    } finally {
      setLoadingStations(false);
    }
  };

  const handleChangeChecked = (targetStationName: string) => {
    setStationList((prev) =>
      prev.map((s) =>
        s.name !== targetStationName ? s : { ...s, check: !s.check }
      )
    );
  };

  const handleSearch = () => {
    const checked = stationList.filter((s) => s.check);
    if (checked.length > 0) {
      const names = checked.map((s) => s.name).join(",");
      sendGAEvent({ event: "search", search_term: names });

      // 1つの駅だけ選んでいる場合は、SEOに強いURLへ飛ばす
      if (checked.length === 1) {
        const s = checked[0];
        router.push(
          `/station/${encodeURIComponent(s.name)}?lat=${s.y}&lng=${s.x}`
        );
      } else {
        // 複数駅の場合は、既存のクエリパラメータ形式を維持
        const query = new URLSearchParams({
          station: names,
          lat: checked.map((s) => s.y).join(","),
          lng: checked.map((s) => s.x).join(","),
        }).toString();
        router.push(`/?${query}`);
      }

      if (onClose) onClose();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      {/* 1. ヘッダー（上部のパディングを増やして余裕を持たせる） */}
      <Box sx={{ pt: 4, px: 2, pb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            fontSize: "1.1rem",
            color: "#1A1A1A",
            textShadow: "1px 1px 0px #FF6B00",
            mb: 2,
            px: 1,
          }}
        >
          ガツガツグルメ
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          startIcon={
            loadingLocation ? (
              <CircularProgress size={14} />
            ) : (
              <MyLocationIcon sx={{ fontSize: 18 }} />
            )
          }
          onClick={handleCurrentLocationSearch}
          disabled={loadingLocation}
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.85rem",
            borderColor: "grey.200",
            color: "text.primary",
            py: 1.2,
            mt: 1, // タイトルとの間隔
            mb: 2.5,
            bgcolor: "grey.50",
            "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" },
          }}
        >
          {loadingLocation ? "取得中..." : "現在地から探す"}
        </Button>

        <Box
          sx={{
            bgcolor: "#f8f9fa",
            p: 1.5,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <FormControl fullWidth sx={{ mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <MapIcon sx={{ fontSize: 14, mr: 0.5, color: "primary.main" }} />
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
              >
                都道府県
              </Typography>
            </Box>
            <Select
              value={selectedPrefId}
              onChange={(e) => handleChangePrefectures(String(e.target.value))}
              displayEmpty
              MenuProps={dropdownMenuProps}
              size="small"
              renderValue={(selected) => {
                if (!selected)
                  return (
                    <Typography variant="body2" color="text.disabled">
                      未選択
                    </Typography>
                  );
                return (
                  <Typography variant="body2" fontWeight={600}>
                    {todofuken.find((p) => String(p.id) === selected)?.name}
                  </Typography>
                );
              }}
              sx={{
                bgcolor: "#fff",
                borderRadius: "8px",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "grey.200" },
              }}
            >
              {todofuken.map((v) => (
                <MenuItem
                  key={v.id}
                  value={String(v.id)}
                  sx={{ fontSize: "0.9rem" }}
                >
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!selectedPrefId || loadingLines}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <TrainIcon
                sx={{ fontSize: 14, mr: 0.5, color: "primary.main" }}
              />
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
              >
                路線名
              </Typography>
            </Box>
            <Select
              value={selectedLineName}
              onChange={(e) => handleChangeLine(String(e.target.value))}
              displayEmpty
              MenuProps={dropdownMenuProps}
              size="small"
              renderValue={(selected) => {
                if (loadingLines)
                  return (
                    <Typography variant="body2" color="text.secondary">
                      読込中...
                    </Typography>
                  );
                if (!selected)
                  return (
                    <Typography variant="body2" color="text.disabled">
                      路線を選択
                    </Typography>
                  );
                return (
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {selected}
                  </Typography>
                );
              }}
              sx={{
                bgcolor: "#fff",
                borderRadius: "8px",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "grey.200" },
              }}
            >
              {rosenList.map((v) => (
                <MenuItem key={v.id} value={v.id} sx={{ fontSize: "0.9rem" }}>
                  {v.line}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 2. 駅一覧 */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1 }}>
        {(selectedLineName || loadingStations) && (
          <Box
            sx={{
              border: "1px solid",
              borderColor: "grey.100",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <ListItemButton
              disabled={loadingStations}
              onClick={() => setIsStationListOpen(!isStationListOpen)}
              sx={{ py: 1, bgcolor: "grey.50" }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <TrainIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={loadingStations ? "読み込み中..." : selectedLineName}
                primaryTypographyProps={{
                  variant: "body2",
                  fontWeight: 700,
                  noWrap: true,
                }}
              />
              {isStationListOpen ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </ListItemButton>

            <Collapse in={isStationListOpen} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  p: 1,
                  bgcolor: "#fff",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Paper
                  component="form"
                  sx={{
                    p: "2px 8px",
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "grey.50",
                    boxShadow: "none",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                >
                  <SearchIcon
                    sx={{ p: "4px", color: "text.secondary", fontSize: 20 }}
                  />
                  <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: "0.85rem" }}
                    placeholder="駅名を絞り込む"
                    value={stationSearchText}
                    onChange={(e) => setStationSearchText(e.target.value)}
                  />
                </Paper>
              </Box>
              <List
                disablePadding
                sx={{ bgcolor: "#fff", maxHeight: 300, overflowY: "auto" }}
              >
                {filteredStations.map((v) => (
                  <ListItemButton
                    key={v.name}
                    dense
                    onClick={() => handleChangeChecked(v.name)}
                    sx={{ borderBottom: "1px solid #f8f8f8" }}
                  >
                    <Checkbox size="small" checked={v.check} sx={{ p: 0.5 }} />
                    <ListItemText
                      primary={v.name}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                    {v.count > 0 && (
                      <Chip
                        label={v.count}
                        size="small"
                        sx={{ height: 18, fontSize: "0.65rem" }}
                      />
                    )}
                  </ListItemButton>
                ))}
                {filteredStations.length === 0 && !loadingStations && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      p: 2,
                      textAlign: "center",
                      color: "text.disabled",
                    }}
                  >
                    見つかりませんでした
                  </Typography>
                )}
              </List>
            </Collapse>
          </Box>
        )}
      </Box>

      {/* 3. フッター */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#fff",
          borderTop: "1px solid",
          borderColor: "grey.100",
        }}
      >
        <Button
          variant="contained"
          fullWidth
          startIcon={<SearchIcon />}
          disabled={!stationList.some((s) => s.check)}
          onClick={handleSearch}
          sx={{
            borderRadius: "12px",
            fontWeight: 800,
            fontSize: "0.95rem",
            textTransform: "none",
            py: 1.5,
            boxShadow: "none",
            background: "linear-gradient(45deg, #FF6B00 30%, #FF8E53 90%)",
            "&:hover": {
              background: "linear-gradient(45deg, #E65100 30%, #F57C00 90%)",
            },
          }}
        >
          {stationList.filter((s) => s.check).length > 0
            ? `${stationList.filter((s) => s.check).length}件の駅で検索`
            : "駅を選択して検索"}
        </Button>
      </Box>
    </Box>
  );
}
