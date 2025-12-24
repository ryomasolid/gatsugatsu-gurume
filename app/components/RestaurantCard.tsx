"use client";

import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
} from "@mui/material";

export type RestaurantInfoDTO = {
  id: string;
  name: string;
  genre: string;
  address: string;
  station: string;
  walkMinutes: number;
  description: string;
  imageUrl: string;
};

type Props = RestaurantInfoDTO & {
  onClick: () => void;
};

export default function RestaurantCard(props: Props) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4, // 角を少し丸くしてモダンに
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 12px 30px rgba(255, 107, 0, 0.4)" // ダーク時はオレンジの光を強く
              : "0 12px 30px rgba(0, 0, 0, 0.15)", // ライト時は通常の影
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="220"
          image={props.imageUrl}
          alt={props.name}
          sx={{ objectFit: "cover" }}
        />
        {/* ジャンルバッジを画像の上に浮かせる */}
        <Chip
          label={props.genre}
          color="primary"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: "bold",
            bgcolor: "#FF6B00", // 強めのオレンジ
            boxShadow: 2,
          }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h5"
          component="h2"
          fontWeight="900"
          gutterBottom
          sx={{ lineHeight: 1.2 }}
        >
          {props.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <Rating
            value={parseFloat(
              props.description.match(/★(\d+(\.\d+)?)/)?.[1] || "0"
            )}
            precision={0.1}
            readOnly
            size="small"
          />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 1, fontWeight: "bold" }}
          >
            {props.description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip
            icon={<DirectionsWalkIcon />}
            label={`${props.station} 徒歩${props.walkMinutes}分`}
            variant="outlined"
            size="small"
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: "3em" }}
        >
          {props.address}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          onClick={props.onClick}
          sx={{
            bgcolor: "#1A1A1A",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 2,
            py: 1.5,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          Googleマップで見る
        </Button>
      </CardContent>
    </Card>
  );
}
