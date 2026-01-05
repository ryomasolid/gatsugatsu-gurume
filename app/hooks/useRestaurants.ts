import { useEffect, useState } from "react";
import { RestaurantInfoDTO } from "../components/RestaurantCard";
import { calculateDistance, calculateWalkMinutes } from "../utils/geo";

export const useRestaurants = (params: {
  station: string;
  lat: string;
  lng: string;
}) => {
  const [restaurants, setRestaurants] = useState<RestaurantInfoDTO[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.station === "周辺") {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams(params);
        const res = await fetch(`/api/restaurants?${query.toString()}`);
        const data = await res.json();

        if (!data.results) {
          setRestaurants([]);
          return;
        }

        const stationNames = params.station.split(",");
        const stationLats = params.lat.split(",").map(Number);
        const stationLngs = params.lng.split(",").map(Number);

        const formattedData: RestaurantInfoDTO[] = data.results.map(
          (place: any) => {
            let minWalkMinutes = 999;
            let nearestStationName = "駅";

            if (place.location && stationLats.length > 0) {
              stationLats.forEach((lat, index) => {
                const lng = stationLngs[index];
                if (!lat || !lng) return;

                const distance = calculateDistance(
                  lat,
                  lng,
                  place.location.latitude,
                  place.location.longitude
                );
                const minutes = calculateWalkMinutes(distance);

                if (minutes < minWalkMinutes) {
                  minWalkMinutes = minutes;
                  nearestStationName = stationNames[index];
                }
              });
            }

            return {
              id: place.id,
              name: place.name,
              genre: place.genre,
              address: place.address,
              station:
                stationNames.length > 1
                  ? `${nearestStationName}駅(近)`
                  : `${nearestStationName}駅`,
              walkMinutes: minWalkMinutes === 999 ? 0 : minWalkMinutes,
              description: `評価: ★${place.rating} (${place.reviewCount}件の口コミ)`,
            };
          }
        );

        // 徒歩15分圏内のみ抽出
        setRestaurants(formattedData.filter((v) => v.walkMinutes < 15));
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.station, params.lat, params.lng]);

  return { restaurants, loading };
};
