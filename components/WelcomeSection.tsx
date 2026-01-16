"use client";

import BoltIcon from "@mui/icons-material/Bolt";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WhatshotIcon from "@mui/icons-material/Whatshot"; // 炎アイコン
import {
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
  keyframes,
} from "@mui/material";

const flicker = keyframes`
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0.8; transform: scale(1); }
`;

export const WelcomeSection = () => {
  return (
    <Box sx={{ mt: 0 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 5, md: 6, lg: 8 },
          borderRadius: { xs: 4, md: 6 },
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "grey.100",
          boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
        }}
      >
        <Box sx={{ mb: { xs: 3, md: 6 } }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <WhatshotIcon
              sx={{
                color: "#FF6B00",
                fontSize: { xs: "1.5rem", md: "2.2rem" },
                mr: 1,
                animation: `${flicker} 1.5s infinite ease-in-out`,
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 900,
                color: "#FF6B00",
                fontSize: {
                  xs: "1.2rem",
                  sm: "1.6rem",
                  md: "1.8rem",
                  lg: "2.0rem",
                  xl: "2.4rem",
                },
                lineHeight: 1.3,
                textAlign: "left",
              }}
            >
              ガツガツグルメ
              <Box
                component="span"
                sx={{
                  display: "block",
                  color: "text.primary",
                  fontSize: "0.7em",
                  mt: 1,
                  fontWeight: 700,
                }}
              >
                駅近「がっつり飯」の最強検索ガイド
              </Box>
            </Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{
              lineHeight: 1.8,
              color: "text.secondary",
              fontSize: { xs: "0.85rem", md: "1.05rem" },
              textAlign: "left",
              maxWidth: "900px",
            }}
          >
            「ガツガツグルメ」へようこそ。当サイトは、日々を全力で生きる人々のために、
            <Box
              component="span"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
                borderBottom: "2px solid #FF6B00",
              }}
            >
              駅から徒歩圏内で満足感抜群の「がっつり飯」を最速で見つけること
            </Box>
            を目標に開発。
            黄金の3大ジャンル「ラーメン・牛丼・定食」に特化しています。
          </Typography>
        </Box>

        <Divider sx={{ my: { xs: 3, md: 6 } }} />

        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 900,
            mb: { xs: 2, md: 4 },
            fontSize: { xs: "1rem", md: "1.2rem" },
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <RestaurantIcon
            sx={{ color: "#FF6B00", fontSize: { xs: 20, md: 24 } }}
          />
          追求する3大ジャンルの美学
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3, md: 6 }}>
          <GenreItem
            emoji="🍜"
            title="ラーメン"
            description="二郎系から濃厚豚骨まで、食べた後に「戦える」元気が湧く一杯を厳選。"
          />
          <GenreItem
            emoji="🍚"
            title="牛丼・丼物"
            description="チェーンから、肉盛自慢の個人店まで、本能に忠実な結果を。"
          />
          <GenreItem
            emoji="🍱"
            title="定食・おかわり"
            description="唐揚げ、生姜焼き。腹ペコ層に支持される名店を抽出。"
          />
        </Grid>

        <Divider sx={{ my: { xs: 4, md: 8 } }} />

        <Typography
          variant="subtitle1"
          component="h2"
          sx={{
            fontWeight: 900,
            mb: 3,
            textAlign: "center",
            fontSize: { xs: "1rem", md: "1.4rem" },
          }}
        >
          お店選びの3か条
        </Typography>

        <Grid container spacing={2}>
          <PolicyCard
            icon={<BoltIcon sx={{ fontSize: 24 }} />}
            number="01"
            title="圧倒的な「満腹度」"
            description="大盛り、おかわり。明日への活力が湧くボリューム。"
          />
          <PolicyCard
            icon={<RestaurantIcon sx={{ fontSize: 24 }} />}
            number="02"
            title="駅から「迷わず」"
            description="数分以内に辿り着ける立地。短い休憩でも最高の体験。"
          />
          <PolicyCard
            icon={<RecordVoiceOverIcon sx={{ fontSize: 24 }} />}
            number="03"
            title="「生の声」を重視"
            description="実際の口コミをベースにした真実をお届け。"
          />
        </Grid>
      </Paper>
    </Box>
  );
};

const GenreItem = ({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) => (
  <Grid size={{ xs: 12, sm: 4 }}>
    <Box sx={{ mb: { xs: 1, sm: 0 } }}>
      <Typography
        variant="subtitle1"
        component="h3"
        sx={{
          fontWeight: 900,
          mb: 0.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: { xs: "0.9rem", md: "1.05rem" },
        }}
      >
        <Box component="span">{emoji}</Box> {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          lineHeight: 1.5,
          color: "text.secondary",
          fontSize: { xs: "0.75rem", md: "0.8rem" },
        }}
      >
        {description}
      </Typography>
    </Box>
  </Grid>
);

const PolicyCard = ({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
}) => (
  <Grid size={{ xs: 12, sm: 4 }}>
    <Paper
      variant="outlined"
      sx={{ p: 2, height: "100%", borderRadius: 3, bgcolor: "#fcfcfc" }}
    >
      <Box
        sx={{
          color: "#FF6B00",
          mb: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {icon}
        <Typography
          variant="caption"
          sx={{ fontWeight: 900, color: "grey.500" }}
        >
          {number}
        </Typography>
      </Box>
      <Typography
        variant="body2"
        component="h3"
        sx={{ fontWeight: 800, mb: 0.5 }}
      >
        {title}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ lineHeight: 1.4, display: "block" }}
      >
        {description}
      </Typography>
    </Paper>
  </Grid>
);
