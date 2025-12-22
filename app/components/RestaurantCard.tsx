import PlaceIcon from "@mui/icons-material/Place";
import StarIcon from "@mui/icons-material/Star";
import TrainIcon from "@mui/icons-material/Train";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export interface RestaurantInfoDTO {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  genre: string;
  station: string;
  walkMinutes: number;
}

type RestaurantCardProps = {
  name: string;
  description: string;
  imageUrl: string;
  address: string;
  genre: string;
  station: string;
  walkMinutes: number;
  onClick?: () => void;
};

export default function RestaurantCard({
  name,
  description,
  imageUrl,
  address,
  genre,
  station,
  walkMinutes,
  onClick,
}: RestaurantCardProps) {
  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 400,
        mx: "auto",

        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Box sx={{ position: "relative", width: "100%" }}>
          <CardMedia
            component="img"
            height="200"
            image={imageUrl}
            alt={name}
            sx={{ objectFit: "cover" }}
          />
          <Chip
            label={genre}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: "#333",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              backdropFilter: "blur(4px)",
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, width: "100%", pt: 2, pb: 2 }}>
          <Typography
            variant="h6"
            component="div"
            fontWeight={700}
            sx={{
              lineHeight: 1.4,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              height: "2.8em",
            }}
          >
            {name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <StarIcon sx={{ fontSize: 18, color: "#faaf00", mr: 0.5 }} />
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description.replace("評価: ", "")}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5, borderColor: "rgba(0,0,0,0.05)" }} />

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <TrainIcon
              sx={{ fontSize: 16, color: "primary.main", mr: 1, opacity: 0.7 }}
            />
            <Typography
              variant="body2"
              sx={{ color: "text.primary", fontWeight: 500 }}
            >
              {station}
              {walkMinutes > 0 ? ` 徒歩${walkMinutes}分` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <PlaceIcon
              sx={{
                fontSize: 16,
                color: "text.secondary",
                mr: 1,
                mt: 0.3,
                opacity: 0.7,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {address}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
