"use client";

import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import MyLocationIcon from "@mui/icons-material/MyLocation";
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
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { todofuken } from "../../constants"; // パスに注意

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
  const [rosenList, setRosenList] = useState<RosenDto[]>([]);
  const [stationList, setStationList] = useState<StationDto[]>([]);
  const [loadingLines, setLoadingLines] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [stationSearchText, setStationSearchText] = useState("");

  const checkedStations = useMemo(
    () => stationList.filter((s) => s.check),
    [stationList]
  );
  const filteredStations = useMemo(() => {
    return stationList.filter((s) => s.name.includes(stationSearchText));
  }, [stationList, stationSearchText]);

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

  // 都道府県検索
  const handleChangePrefectures = async (prefId: string) => {
    setSelectedPrefId(prefId);
    setSelectedLineName("");
    setRosenList([]);
    setStationList([]);
    const targetPref = todofuken.find((v) => String(v.id) === String(prefId));
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
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* ★スマホ版のみ表示されるスペーサー：これでヘッダーとの被りを防ぐ */}
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Toolbar />
      </Box>

      <Box sx={{ pt: { xs: 2, md: 4 }, px: 3, pb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            color: "#1A1A1A",
            textShadow: "1px 1px 0px #FF6B00",
            mb: 3,
          }}
        >
          ガツガツグルメ
        </Typography>

        <Button
          fullWidth
          variant="contained"
          startIcon={
            loadingLocation ? (
              <CircularProgress size={16} sx={{ color: "white" }} />
            ) : (
              <MyLocationIcon />
            )
          }
          onClick={handleCurrentLocationSearch}
          disabled={loadingLocation}
          sx={{
            borderRadius: "12px",
            bgcolor: "#1A1A1A",
            color: "#fff",
            py: 1.2,
            fontWeight: 800,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          {loadingLocation ? "取得中..." : "現在地から探す"}
        </Button>
      </Box>

      <Box sx={{ px: 3, pb: 2 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 800,
            color: "text.secondary",
            ml: 1,
            mb: 0.5,
            display: "block",
          }}
        >
          エリア・路線から探す
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: "16px",
            bgcolor: "#F8F9FA",
            border: "1px solid #EEE",
          }}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={selectedPrefId}
              onChange={(e) => handleChangePrefectures(e.target.value)}
              displayEmpty
              size="small"
              sx={{ bgcolor: "white", borderRadius: "8px" }}
            >
              <MenuItem value="" disabled>
                都道府県を選択
              </MenuItem>
              {todofuken.map((v) => (
                <MenuItem key={v.id} value={String(v.id)}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!selectedPrefId || loadingLines}>
            <Select
              value={selectedLineName}
              onChange={(e) => handleChangeLine(e.target.value)}
              displayEmpty
              size="small"
              sx={{ bgcolor: "white", borderRadius: "8px" }}
            >
              <MenuItem value="" disabled>
                {loadingLines ? "読み込み中..." : "路線を選択"}
              </MenuItem>
              {rosenList.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.line}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 3 }}>
        {stationList.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 800, color: "text.secondary" }}
              >
                駅を選択 ({checkedStations.length})
              </Typography>
              {checkedStations.length > 0 && (
                <IconButton
                  size="small"
                  onClick={() =>
                    setStationList((prev) =>
                      prev.map((s) => ({ ...s, check: false }))
                    )
                  }
                >
                  <DeleteSweepIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Paper
              variant="outlined"
              sx={{ borderRadius: "12px", overflow: "hidden" }}
            >
              <Box sx={{ p: 1, bgcolor: "#EEE" }}>
                <InputBase
                  fullWidth
                  placeholder="駅名で絞り込み..."
                  value={stationSearchText}
                  onChange={(e) => setStationSearchText(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    px: 1,
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                  }}
                />
              </Box>
              <List
                dense
                sx={{ maxHeight: 300, overflowY: "auto", bgcolor: "white" }}
              >
                {filteredStations.map((s) => (
                  <ListItemButton
                    key={s.name}
                    onClick={() =>
                      setStationList((prev) =>
                        prev.map((item) =>
                          item.name === s.name
                            ? { ...item, check: !item.check }
                            : item
                        )
                      )
                    }
                  >
                    <Checkbox
                      checked={s.check}
                      size="small"
                      sx={{ p: 0, mr: 1 }}
                    />
                    <ListItemText
                      primary={s.name}
                      primaryTypographyProps={{
                        fontSize: "0.85rem",
                        fontWeight: s.check ? 700 : 400,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 3, borderTop: "1px solid #EEE" }}>
        <Button
          fullWidth
          variant="contained"
          disabled={checkedStations.length === 0}
          onClick={handleSearch}
          sx={{
            py: 1.5,
            borderRadius: "12px",
            fontWeight: 900,
            background: "linear-gradient(45deg, #FF6B00 30%, #FF8E53 90%)",
            boxShadow: "0 4px 12px rgba(255, 107, 0, 0.3)",
          }}
        >
          {checkedStations.length > 0
            ? `${checkedStations.length}件の駅で検索`
            : "駅を選択して検索"}
        </Button>
      </Box>
    </Box>
  );
}
