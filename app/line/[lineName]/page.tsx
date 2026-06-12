import { getAllLineNames, getLine } from "@/utils/stationData";
import { Box, Chip, Container, Paper, Typography } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const SITE_URL = "https://gatsugatsu-gurume.com";

type Props = {
  params: Promise<{ lineName: string }>;
};

export function generateStaticParams() {
  return getAllLineNames().map((name) => ({ lineName: name }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lineName } = await params;
  const name = decodeURIComponent(lineName);
  const line = getLine(name);
  const canonicalPath = `/line/${encodeURIComponent(name)}`;
  const count = line?.stations.length ?? 0;
  const title = `${name}の駅一覧（全${count}駅）からがっつりグルメを探す`;
  const description = `${name}の全${count}駅から駅を選んで、駅周辺のデカ盛り・がっつりランチを検索。ラーメン・丼もの・定食を駅からの徒歩分数つきで掲載しています。`;
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalPath}`,
      type: "website",
      siteName: "ガツガツグルメ",
      locale: "ja_JP",
    },
  };
}

export default async function LinePage({ params }: Props) {
  const { lineName } = await params;
  const name = decodeURIComponent(lineName);
  const line = getLine(name);
  if (!line) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${line.prefs[0]}の路線一覧`,
        item: `${SITE_URL}/area/${encodeURIComponent(line.prefs[0])}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${name}の駅一覧`,
        item: `${SITE_URL}/line/${encodeURIComponent(name)}`,
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 900, mb: 1, fontSize: { xs: "1.5rem", md: "2rem" } }}
      >
        {name}の駅から探す
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", fontWeight: 700, mb: 4, lineHeight: 1.8 }}>
        {name}（{line.prefs.join("・")}）の全{line.stations.length}駅を路線順に掲載しています。
        駅を選ぶと、駅周辺のデカ盛り・がっつり飯を徒歩分数つきで確認できます。
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 4,
          border: "2px solid #1A1A1A",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 900, mb: 2 }}>
          駅一覧（{line.stations.length}駅）
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {line.stations.map((station, i) => (
            <Link
              key={`${station.name}-${i}`}
              href={`/station/${encodeURIComponent(station.name)}`}
              style={{ textDecoration: "none" }}
            >
              <Chip
                label={station.name}
                clickable
                size="small"
                sx={{
                  fontWeight: 800,
                  bgcolor: "#FFF9F5",
                  border: "1px solid #EEE",
                  "&:hover": {
                    bgcolor: "#FFF5ED",
                    borderColor: "#FF6B00",
                    color: "#FF6B00",
                  },
                }}
              />
            </Link>
          ))}
        </Box>
      </Paper>

      <Box sx={{ mt: 4, display: "flex", gap: 3, flexWrap: "wrap" }}>
        {line.prefs.map((pref) => (
          <Link
            key={pref}
            href={`/area/${encodeURIComponent(pref)}`}
            style={{ color: "#FF6B00", fontWeight: 800 }}
          >
            ← {pref}の路線一覧へ
          </Link>
        ))}
      </Box>
    </Container>
  );
}
