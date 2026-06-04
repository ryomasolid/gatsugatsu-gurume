import { getGenre, GooglePlace } from "@/utils/restaurantHelpers";

const GATSURI_KEYWORDS = ["ラーメン", "定食", "中華", "カレー", "牛丼", "丼"];

export const buildGatsuriQuery = (): string => {
  const shuffled = [...GATSURI_KEYWORDS].sort(() => 0.5 - Math.random());
  return `${shuffled[0]} がっつり`;
};

export const calculateAvgLocation = (lats: number[], lngs: number[]) => {
  const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const avgLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
  return { lat: avgLat, lng: avgLng };
};

export const formatPlaceResult = (place: GooglePlace) => {
  const name = place.displayName.text;
  return {
    id: place.id,
    name,
    genre: getGenre(name, place.types, place.primaryType || ""),
    address: place.formattedAddress,
    location: place.location,
  };
};
