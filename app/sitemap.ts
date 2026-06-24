import { getColumnSlugs } from "@/constants/columns";
import { getGuideStationNames } from "@/constants/stationGuides";
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://gatsugatsu-gurume.com";

  // インデックス対象は独自の編集部ガイドを持つ駅のみ。
  // ガイドのない駅・路線・エリアページは noindex のためサイトマップから除外し、
  // 「独自コンテンツを持つページだけ」をクローラーに提示する。
  const stationEntries: MetadataRoute.Sitemap = getGuideStationNames().map(
    (name) => ({
      url: `${baseUrl}/station/${encodeURIComponent(name)}`,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  // 編集部オリジナルのコラム記事（API非依存の独自コンテンツ）
  const columnEntries: MetadataRoute.Sitemap = getColumnSlugs().map((slug) => ({
    url: `${baseUrl}/column/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/column`, changeFrequency: "weekly", priority: 0.8 },
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

  return [...staticEntries, ...columnEntries, ...stationEntries];
}
