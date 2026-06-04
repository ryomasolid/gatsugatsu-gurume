export type RestaurantInfoDTO = {
  id: string;
  name: string;
  genre: string;
  address: string;
  station: string;
  walkMinutes: number;
  description: string;
  location: { latitude: number; longitude: number };
};

export const GENRE_IMAGES: Record<string, string> = {
  ラーメン: "/images/ramen.png",
  油そば: "/images/aburasoba.png",
  牛丼: "/images/gyudon.png",
  定食: "/images/teishoku.png",
  カツ丼: "/images/katsudon.png",
  中華料理: "/images/chinese.png",
  スタミナ料理: "/images/stamina.png",
  カレー: "/images/curry.png",
  スープカレー: "/images/soupcurry.png",
  その他: "/images/default.png",
};

export const IMG_CACHE_PREFIX = "gatsu_img_";
