"use client";

import BoltIcon from "@mui/icons-material/Bolt";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import PlaceIcon from "@mui/icons-material/Place";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Typography,
  keyframes,
  Paper,
  Grid,
  ButtonBase,
} from "@mui/material";
import Link from "next/link";

const pulse = keyframes`
  0% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(255,107,0,0)); }
  50% { transform: scale(1.08); filter: drop-shadow(0 0 12px rgba(255,107,0,0.5)); }
  100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(255,107,0,0)); }
`;

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

const noiseEffect = {
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    zIndex: 1,
  }
};

const POPULAR_STATIONS = [
  { name: "新宿", lat: "35.690921", lng: "139.700258" },
  { name: "渋谷", lat: "35.658034", lng: "139.701636" },
  { name: "池袋", lat: "35.728926", lng: "139.71038" },
  { name: "秋葉原", lat: "35.698383", lng: "139.773071" },
  { name: "横浜", lat: "35.465786", lng: "139.622313" },
  { name: "大阪", lat: "34.702485", lng: "135.495951" },
];

export const WelcomeSection = () => {
  return (
    <Box component="section" sx={{ mt: { xs: 1, md: 3 }, mb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          ...noiseEffect,
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
              variant="h6"
              sx={{ fontWeight: 800, color: "#444", fontSize: { xs: "0.95rem", md: "1.4rem" }, maxWidth: "600px" }}
            >
              駅近「がっつり飯」専用。
              <Box component="span" sx={{ display: { xs: "block", sm: "inline" }, color: DARK_COLOR }}>最速で、腹を満たせ。</Box>
            </Typography>
          </Box>

          <Box sx={{ mb: { xs: 6, md: 10 } }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "0.8rem", letterSpacing: "0.2em", mb: 2, display: "block" }}>
              POPULAR AREAS
            </Typography>
            <Grid container spacing={1.5}>
              {POPULAR_STATIONS.map((station) => (
                <Grid size={{ xs: 6, sm: 4, md: 2 }} key={station.name}>
                  <Link
                    href={`/station/${encodeURIComponent(station.name)}?lat=${station.lat}&lng=${station.lng}`}
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
                        transition: "0.1s",
                        boxShadow: `3px 3px 0px ${DARK_COLOR}`,
                        "&:active": {
                          transform: "translate(2px, 2px)",
                          boxShadow: "0px 0px 0px #000",
                        }
                      }}
                    >
                      <PlaceIcon sx={{ fontSize: "1rem", mr: 0.5, color: BRAND_COLOR }} />
                      {station.name}
                    </ButtonBase>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Grid container spacing={{ xs: 4, md: 6 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                <RestaurantIcon sx={{ color: BRAND_COLOR }} /> 3大ジャンルの美学
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <GenreRow emoji="🍜" title="濃厚ラーメン" desc="二郎系・家系・ドロ豚骨。戦う前のガソリン。" />
                <GenreRow emoji="🍚" title="漢の肉丼" desc="米が見えない肉の山。本能で喰らう一杯。" />
                <GenreRow emoji="🍱" title="爆盛り定食" desc="おかわり自由は正義。白飯泥棒な名店。" />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box 
                sx={{ 
                  bgcolor: "#fff",
                  p: 3, 
                  borderRadius: 5, 
                  color: DARK_COLOR, 
                  border: `3px solid ${BRAND_COLOR}`,
                  boxShadow: `6px 6px 0px ${BRAND_COLOR}`,
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 900, 
                    mb: 3, 
                    textAlign: "center", 
                    borderBottom: `2px dashed ${BRAND_COLOR}`,
                    pb: 1,
                    color: BRAND_COLOR 
                  }}
                >
                  ガツガツの流儀
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <PolicyItem icon={<BoltIcon />} title="圧倒的「満腹」" />
                  <PolicyItem icon={<PlaceIcon />} title="駅から「爆速」" />
                  <PolicyItem icon={<RecordVoiceOverIcon />} title="ガチの「生声」" />
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
  <ButtonBase
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "center",
      p: 2,
      bgcolor: "#FFF9F5",
      borderRadius: 4,
      border: `2px solid transparent`,
      transition: "0.2s",
      "&:hover, &:active": {
        borderColor: BRAND_COLOR,
        bgcolor: "#fff"
      }
    }}
  >
    <Typography variant="h4" sx={{ mr: 2 }}>{emoji}</Typography>
    <Box sx={{ textAlign: "left" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.2 }}>{title}</Typography>
      <Typography variant="caption" sx={{ color: "#666" }}>{desc}</Typography>
    </Box>
    <ArrowForwardIcon sx={{ ml: "auto", fontSize: "1rem", color: BRAND_COLOR, opacity: 0.5 }} />
  </ButtonBase>
);

const PolicyItem = ({ icon, title }: any) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Box sx={{ bgcolor: BRAND_COLOR, p: 1, borderRadius: 2, color: "#fff", display: "flex" }}>{icon}</Box>
    <Typography variant="body1" sx={{ fontWeight: 800, color: DARK_COLOR }}>{title}</Typography>
  </Box>
);