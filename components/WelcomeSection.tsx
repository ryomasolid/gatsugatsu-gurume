"use client";

import BoltIcon from "@mui/icons-material/Bolt";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import PlaceIcon from "@mui/icons-material/Place";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Typography,
  keyframes,
  Paper,
  Grid,
  ButtonBase,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { isStationReachable } from "@/constants/reviewMode";

const pulse = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(255,107,0,0)); }
  50% { transform: scale(1.08); filter: drop-shadow(0 0 12px rgba(255,107,0,0.5)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(255,107,0,0)); }
`;

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

// 審査モード中に 404 になる駅（非主要駅）はヒーローのリンクからも除外する。
// クローラが辿れる <a> リンクなので、壊れたリンクを残さないことが重要。
const POPULAR_STATIONS = [
  { name: "新宿", lat: "35.690921", lng: "139.700258" },
  { name: "渋谷", lat: "35.658034", lng: "139.701636" },
  { name: "池袋", lat: "35.728926", lng: "139.71038" },
  { name: "秋葉原", lat: "35.698383", lng: "139.773071" },
  { name: "横浜", lat: "35.465786", lng: "139.622313" },
  { name: "品川", lat: "35.62876", lng: "139.73876" },
  { name: "東京", lat: "35.681236", lng: "139.767125" },
  { name: "上野", lat: "35.713768", lng: "139.777254" },
].filter((s) => isStationReachable(s.name));

export const WelcomeSection = () => {
  return (
    <Box component="section" sx={{ mt: { xs: 1, md: 3 }, mb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 8 },
          borderRadius: { xs: 6, md: 10 },
          bgcolor: "#fff",
          border: `3px solid ${DARK_COLOR}`,
          boxShadow: {
            xs: `6px 6px 0px ${DARK_COLOR}`,
            md: `12px 12px 0px ${DARK_COLOR}`,
          },
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2 }}>
          
          {/* ヒーローセクション：専門性をアピール */}
          <Box sx={{ mb: { xs: 5, md: 8 }, textAlign: { xs: "center", md: "left" } }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" }, mb: 2 }}>
              <WhatshotIcon
                sx={{
                  color: BRAND_COLOR,
                  fontSize: { xs: "2.5rem", md: "4rem" },
                  animation: `${pulse} 2s infinite ease-in-out`,
                  mr: 1.5
                }}
              />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.2rem", md: "4.5rem" },
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  color: DARK_COLOR,
                }}
              >
                GATSU<Box component="span" sx={{ color: BRAND_COLOR }}>GATSU</Box>
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 900, color: DARK_COLOR, mb: 2, fontSize: { xs: "1.2rem", md: "1.8rem" } }}
            >
              駅近「がっつり飯」専用検索ガイド
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 700, color: "#666", lineHeight: 1.8, maxWidth: "700px" }}
            >
              ガツガツグルメは、全国の主要駅周辺【概ね1km圏内】のデカ盛り・高コスパ店を独自のジャンル判定ロジックで抽出。
              駅からの徒歩分数を座標から自動計算し、今すぐ腹を満たしたいあなたに最適な「戦場」を提案します。
            </Typography>
          </Box>

          {/* 人気エリアセクション：sizeプロパティを使用 */}
          <Box sx={{ mb: { xs: 6, md: 10 } }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "0.85rem", letterSpacing: "0.2em", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <SearchIcon fontSize="small" /> POPULAR STATIONS
            </Typography>
            <Grid container spacing={2}>
              {POPULAR_STATIONS.map((station) => (
                <Grid key={station.name} size={{ xs: 6, sm: 4, md: 2 }}>
                  <Link
                    href={`/station/${station.name}?lat=${station.lat}&lng=${station.lng}`}
                    style={{ textDecoration: "none" }}
                  >
                    <ButtonBase
                      sx={{
                        width: "100%",
                        py: 2,
                        borderRadius: 3,
                        border: `2px solid ${DARK_COLOR}`,
                        bgcolor: "#fff",
                        fontWeight: 900,
                        transition: "0.2s",
                        boxShadow: `4px 4px 0px ${DARK_COLOR}`,
                        "&:hover": {
                          borderColor: BRAND_COLOR,
                          color: BRAND_COLOR,
                          transform: "translate(-2px, -2px)",
                          boxShadow: `6px 6px 0px ${BRAND_COLOR}`,
                        }
                      }}
                    >
                      <PlaceIcon sx={{ fontSize: "1rem", mr: 0.5 }} />
                      {station.name}
                    </ButtonBase>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ mb: 6, borderBottomWidth: 2 }} />

          {/* 独自基準の説明：sizeプロパティを使用 */}
          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <RestaurantIcon sx={{ color: BRAND_COLOR }} /> 独自の「がっつり」選別基準
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <GenreRow emoji="🍜" title="濃厚・爆盛りラーメン" desc="二郎系、家系、濃厚豚骨を網羅。麺量と背脂のインパクトを重視。" />
                <GenreRow emoji="🍚" title="限界突破の肉丼・カレー" desc="米が見えないほどの肉盛り。1kg超えのチャレンジメニューも補足。" />
                <GenreRow emoji="🍱" title="おかわり無限の定食" desc="ご飯・味噌汁おかわり自由は当たり前。満腹保証の名店を厳選。" />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box 
                sx={{ 
                  bgcolor: "#F9FAFB",
                  p: 4, 
                  borderRadius: 5, 
                  border: `3px solid ${DARK_COLOR}`,
                  boxShadow: `8px 8px 0px ${DARK_COLOR}`,
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 900, 
                    mb: 4, 
                    textAlign: "center", 
                    color: BRAND_COLOR,
                    fontSize: "1.2rem"
                  }}
                >
                  ガツガツの流儀
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <PolicyItem
                    icon={<BoltIcon />}
                    title="圧倒的「満腹」"
                    desc="独自のジャンル判定により、ボリューム系の店に絞って掲載。"
                  />
                  <PolicyItem
                    icon={<PlaceIcon />}
                    title="駅から「爆速」"
                    desc="駅からの徒歩分数を全店舗で自動計算。近い順にすぐわかる。"
                  />
                  <PolicyItem
                    icon={<RecordVoiceOverIcon />}
                    title="定期「更新」"
                    desc="掲載データは約1週間ごとに自動更新。鮮度を維持。"
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

const GenreRow = ({ emoji, title, desc }: any) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      p: 2.5,
      bgcolor: "#FFF9F5",
      borderRadius: 4,
      border: `2px solid #EEE`,
      transition: "0.2s",
      "&:hover": {
        borderColor: BRAND_COLOR,
        bgcolor: "#fff"
      }
    }}
  >
    <Typography variant="h3" sx={{ mr: 2.5 }}>{emoji}</Typography>
    <Box sx={{ textAlign: "left" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.2, mb: 0.5 }}>{title}</Typography>
      <Typography variant="body2" sx={{ color: "#666", fontWeight: 700 }}>{desc}</Typography>
    </Box>
  </Box>
);

const PolicyItem = ({ icon, title, desc }: any) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
    <Box sx={{ bgcolor: BRAND_COLOR, p: 1, borderRadius: 2, color: "#fff", display: "flex" }}>{icon}</Box>
    <Box>
      <Typography variant="body1" sx={{ fontWeight: 900, color: DARK_COLOR, mb: 0.5 }}>{title}</Typography>
      <Typography variant="caption" sx={{ color: "#666", display: "block", fontWeight: 700, lineHeight: 1.4 }}>{desc}</Typography>
    </Box>
  </Box>
);