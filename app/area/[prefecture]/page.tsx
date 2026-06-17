import {
  getAllPrefectures,
  getLinesForPrefecture,
  getStationCountForPrefecture,
} from "@/utils/stationData";
import { Box, Chip, Container, Paper, Typography } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const SITE_URL = "https://gatsugatsu-gurume.com";

type Props = {
  params: Promise<{ prefecture: string }>;
};

export function generateStaticParams() {
  return getAllPrefectures().map((pref) => ({ prefecture: pref }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prefecture } = await params;
  const pref = decodeURIComponent(prefecture);
  const canonicalPath = `/area/${encodeURIComponent(pref)}`;
  const title = `${pref}の路線・駅からがっつりグルメを探す`;
  const description = `${pref}の路線一覧から駅を選んで、駅周辺のデカ盛り・がっつりランチを検索。各駅のラーメン・丼もの・定食を徒歩分数つきで掲載しています。`;
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    // 路線へのリンク集が主体で独自コンテンツが薄いため、ナビゲーション用に follow のみ残して noindex とする
    robots: { index: false, follow: true },
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

export default async function AreaPage({ params }: Props) {
  const { prefecture } = await params;
  const pref = decodeURIComponent(prefecture);
  const lines = getLinesForPrefecture(pref);
  if (lines.length === 0) notFound();

  const stationCount = getStationCountForPrefecture(pref);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${pref}の路線一覧`,
        item: `${SITE_URL}/area/${encodeURIComponent(pref)}`,
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
        {pref}の路線・駅から探す
      </Typography>
      <Typography variant="body1" sx={{ color: "#666", fontWeight: 700, mb: 4, lineHeight: 1.8 }}>
        {pref}には{lines.length}路線・{stationCount}駅が登録されています。
        路線を選ぶと駅一覧が表示され、各駅のページで周辺のデカ盛り・がっつり飯を徒歩分数つきで確認できます。
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
          路線一覧
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {lines.map((line) => (
            <Link
              key={line.name}
              href={`/line/${encodeURIComponent(line.name)}`}
              style={{ textDecoration: "none" }}
            >
              <Chip
                label={`${line.name}（${line.stationCount}駅）`}
                clickable
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

      <Box sx={{ mt: 4 }}>
        <Link href="/" style={{ color: "#FF6B00", fontWeight: 800 }}>
          ← トップページ（全国エリア一覧）へ戻る
        </Link>
      </Box>
    </Container>
  );
}
