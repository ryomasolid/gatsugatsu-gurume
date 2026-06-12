import {
  getAllLineNames,
  getAllPrefectures,
  getAllStationNames,
} from "@/utils/stationData";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gatsugatsu-gurume.com";

  const stationEntries: MetadataRoute.Sitemap = getAllStationNames().map(
    (name) => ({
      url: `${baseUrl}/station/${encodeURIComponent(name)}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  const lineEntries: MetadataRoute.Sitemap = getAllLineNames().map((name) => ({
    url: `${baseUrl}/line/${encodeURIComponent(name)}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const areaEntries: MetadataRoute.Sitemap = getAllPrefectures().map(
    (pref) => ({
      url: `${baseUrl}/area/${encodeURIComponent(pref)}`,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  );

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/shindan`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/trend2026`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/waittime`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/tabehoudai`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/gacha`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/calorie`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/warikan`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  return [...staticEntries, ...areaEntries, ...lineEntries, ...stationEntries];
}
