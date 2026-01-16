import { RestaurantInfoDTO } from "@/app/station/[stationName]/StationClient";
import { calculateDistance, calculateWalkMinutes } from "@/utils/geo";
import { useEffect, useState } from "react";

const CACHE_PREFIX = "gatsu_res_";
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24時間

export const useRestaurants = (params: {
  station: string;
  lat: string;
  lng: string;
}) => {
  const [restaurants, setRestaurants] = useState<RestaurantInfoDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState<"none" | "quota" | "other">(
    "none"
  );

  useEffect(() => {
    if (params.station === "周辺" || !params.lat || !params.lng) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const cacheKey = `${CACHE_PREFIX}${params.station}`;
      const cached = localStorage.getItem(cacheKey);

      // --- 1. キャッシュチェック ---
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setRestaurants(data);
          setErrorType("none");
          setLoading(false);
          return;
        }
      }

      // --- 2. API呼び出し ---
      setLoading(true);
      setErrorType("none");
      try {
        const query = new URLSearchParams(params);
        const res = await fetch(`/api/restaurants?${query.toString()}`);

        // --- 3. 制限（403/429）の判定 ---
        if (!res.ok) {
          if (res.status === 403 || res.status === 429) {
            setErrorType("quota");
          } else {
            setErrorType("other");
          }
          return;
        }

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

        const finalData = formattedData.filter((v) => v.walkMinutes < 15);
        setRestaurants(finalData);

        // --- 4. キャッシュ保存 ---
        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: finalData,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error("Fetch error:", error);
        setErrorType("other");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.station, params.lat, params.lng]);

  return { restaurants, loading, errorType };
};
