"use client";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import TrainIcon from "@mui/icons-material/Train";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

  const handleChangePrefectures = async (prefId: string) => {
    setSelectedPrefId(prefId);
    setSelectedLineName("");
    setRosenList([]);
    setStationList([]);
    setIsStationListOpen(false);

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
      if (data.response && data.response.line) {
        setRosenList(
          data.response.line.map((l: string) => ({ id: l, line: l }))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLines(false); // ロード終了
    }
  };

  const handleChangeLine = async (lineName: string) => {
    setSelectedLineName(lineName);
    setStationList([]);

    setIsStationListOpen(true);
    setLoadingStations(true);

    try {
      const res = await fetch(
        `https://express.heartrails.com/api/json?method=getStations&line=${encodeURIComponent(
          lineName
        )}`
      );
      const data = await res.json();
      if (data.response && data.response.station) {
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
      prev.map((station) =>
        station.name !== targetStationName
          ? station
          : { ...station, check: !station.check }
      )
    );
  };

  const handleSearch = () => {
    const checkedStations = stationList.filter((s) => s.check);

    if (checkedStations.length > 0) {
      const names = checkedStations.map((s) => s.name).join(",");
      const lats = checkedStations.map((s) => s.y).join(",");
      const lngs = checkedStations.map((s) => s.x).join(",");

      const query = new URLSearchParams({
        station: names,
        lat: lats,
        lng: lngs,
      }).toString();

      router.push(`/?${query}`);

      if (onClose) onClose();
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "#ffffff",
        p: 3,
        overflowY: "auto",
        scrollbarGutter: "stable",
      }}
    >
      <Box sx={{ mb: 4, px: 1 }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          ガツガツグルメ
        </Typography>
        <Typography variant="caption" color="text.secondary">
          駅周辺のおいしいお店を探す
        </Typography>
      </Box>

      <List component="nav">
        <Typography
          variant="subtitle2"
          fontWeight="bold"
          sx={{ mb: 2, px: 1, color: "text.secondary", fontSize: "0.75rem" }}
        >
          エリア選択
        </Typography>

        {/* 都道府県 */}
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth variant="filled" size="small" hiddenLabel>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, px: 1 }}>
              <MapIcon
                sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
              />
              <Typography
                variant="caption"
                fontWeight="bold"
                color="text.secondary"
              >
                都道府県
              </Typography>
            </Box>
            <Select
              value={selectedPrefId}
              onChange={(e) => handleChangePrefectures(String(e.target.value))}
              displayEmpty
              renderValue={(selected) => {
                if (!selected)
                  return (
                    <Typography color="text.disabled">
                      選択してください
                    </Typography>
                  );
                return todofuken.find((p) => String(p.id) === selected)?.name;
              }}
              sx={{
                borderRadius: 2,
                bgcolor: "grey.50",
                "&:before, &:after": { border: "none" },
                "&:hover": { bgcolor: "grey.100" },
                ".MuiSelect-select": { py: 1.5, px: 2 },
              }}
              MenuProps={{
                PaperProps: {
                  sx: { maxHeight: 300, borderRadius: 2, boxShadow: 3 },
                },
              }}
            >
              {todofuken.map((v) => (
                <MenuItem key={v.id} value={String(v.id)}>
                  {v.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 路線選択 */}
        <Box sx={{ mb: 3 }}>
          <FormControl
            fullWidth
            variant="filled"
            size="small"
            disabled={!selectedPrefId || loadingLines}
            hiddenLabel
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, px: 1 }}>
              <TrainIcon
                sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
              />
              <Typography
                variant="caption"
                fontWeight="bold"
                color="text.secondary"
              >
                路線
              </Typography>
            </Box>
            <Select
              value={selectedLineName}
              onChange={(e) => handleChangeLine(String(e.target.value))}
              displayEmpty
              renderValue={(selected) => {
                if (loadingLines) {
                  return (
                    <Typography color="text.secondary">
                      路線を読み込み中...
                    </Typography>
                  );
                }
                if (!selected) {
                  return (
                    <Typography color="text.disabled">路線を選択</Typography>
                  );
                }
                return selected;
              }}
              sx={{
                borderRadius: 2,
                bgcolor: "grey.50",
                "&:before, &:after": { border: "none" },
                "&:hover": { bgcolor: "grey.100" },
                ".MuiSelect-select": { py: 1.5, px: 2 },
              }}
              MenuProps={{
                PaperProps: {
                  sx: { maxHeight: 300, borderRadius: 2, boxShadow: 3 },
                },
              }}
              endAdornment={
                loadingLines ? (
                  <CircularProgress
                    size={16}
                    sx={{ mr: 2, position: "absolute", right: 24 }}
                  />
                ) : null
              }
            >
              {rosenList.map((v) => (
                <MenuItem key={v.id} value={v.id}>
                  {v.line}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.05)" }} />

        {/* 駅一覧（アコーディオン） */}
        {(selectedLineName || loadingStations) && (
          <Box
            sx={{
              border: "1px solid",
              borderColor: "grey.200",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <ListItemButton
              disabled={loadingStations}
              onClick={() => setIsStationListOpen(!isStationListOpen)}
              sx={{ bgcolor: isStationListOpen ? "grey.50" : "transparent" }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <TrainIcon
                  fontSize="small"
                  color={isStationListOpen ? "primary" : "action"}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  loadingStations ? "駅を読み込み中..." : selectedLineName
                }
                primaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
              />
              {loadingStations ? (
                <CircularProgress size={16} />
              ) : isStationListOpen ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              )}
            </ListItemButton>

            <Collapse in={isStationListOpen} timeout="auto" unmountOnExit>
              {loadingStations ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }} />
              ) : (
                <List
                  component="div"
                  disablePadding
                  sx={{ bgcolor: "#fff", maxHeight: "40vh", overflowY: "auto" }}
                >
                  {stationList.map((v) => (
                    <ListItemButton
                      key={v.name}
                      dense
                      onClick={() => handleChangeChecked(v.name)}
                      sx={{
                        pl: 2,
                        borderBottom: "1px solid",
                        borderColor: "grey.50",
                      }}
                    >
                      <Checkbox
                        size="small"
                        edge="start"
                        checked={v.check}
                        tabIndex={-1}
                        disableRipple
                        sx={{
                          color: "grey.300",
                          "&.Mui-checked": { color: "primary.main" },
                        }}
                      />
                      <ListItemText
                        primary={v.name}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                      {v.count > 0 && (
                        <Chip
                          label={v.count}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            bgcolor: "grey.100",
                          }}
                        />
                      )}
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Collapse>
          </Box>
        )}

        <Box sx={{ mt: 4, px: 1, pb: 6 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<SearchIcon />}
            disabled={!stationList.some((s) => s.check)}
            onClick={handleSearch}
            sx={{
              borderRadius: "50px",
              fontWeight: "bold",
              fontSize: "1rem",
              textTransform: "none",
              py: 1.5,
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                background: "#e0e0e0",
                boxShadow: "none",
                transform: "none",
              },
            }}
          >
            検索する
          </Button>
        </Box>
      </List>
    </Box>
  );
}
