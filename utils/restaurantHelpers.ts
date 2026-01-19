import { z } from "zod";
import { GENRE_RULES } from "../constants/restaurantData";

// --- 1. レストランデータの検品ルール (Schema) ---
export const RestaurantSchema = z.object({
  id: z.string(),
  name: z.string(),
  genre: z.string(),
  address: z.string(),
  rating: z.number().catch(0), // 数値以外が来たら0にする
  reviewCount: z.number().catch(0), // 数値以外が来たら0にする
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

// --- 2. Google Places API (New) から来る生データの検品ルール ---
export const GooglePlaceSchema = z.object({
  id: z.string(),
  displayName: z.object({ text: z.string() }),
  formattedAddress: z.string(),
  rating: z.number().optional(),
  userRatingCount: z.number().optional(),
  types: z.array(z.string()),
  primaryType: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});

// TypeScript用の型定義をSchemaから自動生成
export type RestaurantDTO = z.infer<typeof RestaurantSchema>;
export type GooglePlace = z.infer<typeof GooglePlaceSchema>;

/**
 * ジャンル判定ロジック
 */
export function getGenre(name: string, types: string[], primaryType: string): string {
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