import { GENRE_RULES } from "../constants/restaurantData";

export interface GooglePlace {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  rating?: number;
  userRatingCount?: number;
  types: string[];
  primaryType?: string;
  location: { latitude: number; longitude: number };
}

export interface RestaurantDTO {
  id: string;
  name: string;
  genre: string;
  address: string;
  rating: number;
  reviewCount: number;
  location: { latitude: number; longitude: number };
}

export function getGenre(
  name: string,
  types: string[],
  primaryType: string
): string {
  const n = name || "";
  const allTypes = [...(types || []), primaryType].filter(Boolean);
  for (const rule of GENRE_RULES) {
    if (
      rule.keywords.some((k) => n.includes(k)) ||
      rule.types?.some((t) => allTypes.includes(t))
    ) {
      return rule.genre;
    }
  }
  return "その他";
}
