import RestaurantIcon from "@mui/icons-material/Restaurant";
import { Alert, Box, CircularProgress, Grid, Typography } from "@mui/material";
import { RestaurantInfoDTO } from "../types";
import RestaurantCard from "./RestaurantCard";

type Props = {
  restaurants: RestaurantInfoDTO[];
  loading: boolean;
  stationName: string;
};

export default function RestaurantList({ restaurants, loading, stationName }: Props) {
  return (
    <Box component="section">
      <Typography
        variant="h5"
        component="h2"
        fontWeight="900"
        sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
      >
        <RestaurantIcon sx={{ color: "#FF6B00" }} /> 厳選ショップリスト
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress thickness={5} size={60} sx={{ color: "#FF6B00" }} />
        </Box>
      ) : restaurants.length === 0 ? (
        <Alert severity="info" sx={{ mt: 4, borderRadius: 3, fontWeight: "bold" }}>
          {stationName}駅周辺で「がっつり基準」を満たすお店が現在見つかりませんでした。
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {restaurants.map((r) => (
            <Grid key={r.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <RestaurantCard {...r} stationName={stationName} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
