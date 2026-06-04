import { RestaurantDTO } from "@/utils/restaurantHelpers";

export const MOCK_RESTAURANTS: RestaurantDTO[] = [
  {
    id: "mock-001",
    name: "がっつり家 新宿本店",
    genre: "ラーメン",
    address: "東京都新宿区新宿3-1-1",
    location: { latitude: 35.6917, longitude: 139.7006 },
  },
  {
    id: "mock-002",
    name: "大盛り食堂 まんぷく",
    genre: "定食",
    address: "東京都新宿区西新宿1-2-3",
    location: { latitude: 35.6896, longitude: 139.6994 },
  },
  {
    id: "mock-003",
    name: "スパイスカレー 爆辛屋",
    genre: "カレー",
    address: "東京都新宿区歌舞伎町2-4-5",
    location: { latitude: 35.6945, longitude: 139.7033 },
  },
  {
    id: "mock-004",
    name: "牛丼チェーン すき家 新宿東口店",
    genre: "牛丼",
    address: "東京都新宿区新宿3-5-6",
    location: { latitude: 35.6912, longitude: 139.7019 },
  },
  {
    id: "mock-005",
    name: "中華飯店 龍門",
    genre: "中華料理",
    address: "東京都新宿区四谷1-7-8",
    location: { latitude: 35.6868, longitude: 139.7172 },
  },
  {
    id: "mock-006",
    name: "とんかつ 勝匠",
    genre: "カツ丼",
    address: "東京都新宿区新宿1-9-10",
    location: { latitude: 35.6882, longitude: 139.7081 },
  },
  {
    id: "mock-007",
    name: "二郎インスパイア 麺屋 轟",
    genre: "ラーメン",
    address: "東京都新宿区高田馬場2-11-12",
    location: { latitude: 35.7124, longitude: 139.7031 },
  },
  {
    id: "mock-008",
    name: "スタミナ焼肉 炎の鉄板",
    genre: "スタミナ料理",
    address: "東京都新宿区大久保1-13-14",
    location: { latitude: 35.7015, longitude: 139.7019 },
  },
];
