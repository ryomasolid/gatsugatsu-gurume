import ColumnBlocks from "@/components/ColumnBlocks";
import EditorProfile from "@/components/EditorProfile";
import { getColumn } from "@/constants/columns";
import {
  getPublishedReportSlugs,
  getReport,
} from "@/constants/reports";
import { SITE_OPERATOR } from "@/constants/siteOperator";
import EastIcon from "@mui/icons-material/East";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TrainIcon from "@mui/icons-material/Train";
import {
  Alert,
  Box,
  Breadcrumbs,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Metadata } from "next";
import NextImage from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";
const SITE_URL = "https://gatsugatsu-gurume.com";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedReportSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) return { robots: { index: false, follow: false } };

  // 下書きは URL 直打ちのプレビュー専用。クローラには一切載せない
  if (report.draft) {
    return {
      title: `【下書き】${report.title}`,
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = `/report/${report.slug}`;
  return {
    title: `${report.title} | ガツガツグルメ`,
    description: report.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: report.title,
      description: report.description,
      url: `${SITE_URL}${canonicalPath}`,
      type: "article",
      siteName: "ガツガツグルメ",
      locale: "ja_JP",
      ...(report.heroImage && {
        images: [{ url: `${SITE_URL}${report.heroImage.src}` }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: report.cardTitle,
      description: report.description,
    },
  };
}

export default async function ReportArticlePage({ params }: Props) {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) notFound();

  const pageUrl = `${SITE_URL}/report/${report.slug}`;
  const related = report.relatedColumns
    .map((s) => getColumn(s))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: report.title,
    description: report.description,
    datePublished: report.visitedAt,
    dateModified: report.updatedAt,
    author: {
      "@type": "Person",
      name: SITE_OPERATOR.representativeName,
      affiliation: SITE_OPERATOR.editorialName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_OPERATOR.siteName,
      url: SITE_URL,
    },
    ...(report.heroImage && { image: `${SITE_URL}${report.heroImage.src}` }),
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "実食レポート", item: `${SITE_URL}/report` },
      { "@type": "ListItem", position: 3, name: report.cardTitle, item: pageUrl },
    ],
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      {!report.draft && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
          />
        </>
      )}

      {report.draft && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 3, fontWeight: "bold" }}>
          この記事は下書きプレビューです。一覧・検索には表示されません。公開するには
          constants/reports.ts で draft: false に変更してください。
        </Alert>
      )}

      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3, "& a": { color: "#666", textDecoration: "none", fontWeight: 700 } }}
      >
        <Link href="/">ホーム</Link>
        <Link href="/report">実食レポート</Link>
        <Typography sx={{ color: BRAND_COLOR, fontWeight: 800 }}>{report.cardTitle}</Typography>
      </Breadcrumbs>

      <Box component="article">
        {/* 記事ヘッダー */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
            <Typography variant="h3" component="span">
              {report.emoji}
            </Typography>
            <Chip
              label="実食レポート"
              size="small"
              sx={{ fontWeight: 800, bgcolor: BRAND_COLOR, color: "#fff" }}
            />
            <Chip
              label={report.genre}
              size="small"
              sx={{ fontWeight: 800, bgcolor: "#FFF5ED", color: BRAND_COLOR, border: `1px solid ${BRAND_COLOR}` }}
            />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 900, fontSize: { xs: "1.6rem", md: "2.2rem" }, lineHeight: 1.3, mb: 2 }}
          >
            {report.title}
          </Typography>
          <Typography variant="caption" sx={{ color: "#999", fontWeight: 700 }}>
            訪問日: {report.visitedAt} ・ 執筆: {SITE_OPERATOR.representativeName}（{SITE_OPERATOR.editorialName}） ・ 約{report.readMinutes}分で読めます
          </Typography>
        </Box>

        {/* ヒーロー写真（編集部撮影） */}
        {report.heroImage && (
          <Box component="figure" sx={{ m: 0, mb: 4 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 10",
                borderRadius: 4,
                overflow: "hidden",
                border: `2px solid ${DARK_COLOR}`,
              }}
            >
              <NextImage
                src={report.heroImage.src}
                alt={report.heroImage.alt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 800px"
                style={{ objectFit: "cover" }}
              />
            </Box>
            {report.heroImage.caption && (
              <Typography
                component="figcaption"
                variant="caption"
                sx={{ display: "block", mt: 1, color: "#888", fontWeight: 700 }}
              >
                {report.heroImage.caption}
              </Typography>
            )}
          </Box>
        )}

        {/* 訪問データ */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 4,
            borderRadius: 4,
            border: `2px solid ${DARK_COLOR}`,
            bgcolor: "#FFF9F5",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#999", mb: 1.5, letterSpacing: "0.08em" }}>
            訪問データ
          </Typography>
          <Grid container spacing={1.5}>
            <FactRow label="店名" value={report.shopName} />
            <FactRow label="最寄駅" value={`${report.station}駅`} />
            <FactRow label="注文" value={report.orderedItem} />
            <FactRow label="支払額" value={report.price} />
            <FactRow label="訪問日" value={report.visitedAt} />
          </Grid>
        </Paper>

        {/* リード文 */}
        <Typography variant="body1" sx={{ color: "#333", lineHeight: 2, fontWeight: 600, mb: 4 }}>
          {report.lead}
        </Typography>

        {/* 本文 */}
        <ColumnBlocks blocks={report.blocks} />

        {/* 駅ページへの導線 */}
        <Paper
          elevation={0}
          sx={{
            mt: 5,
            p: 3,
            borderRadius: 4,
            border: `2px solid ${BRAND_COLOR}`,
            bgcolor: "#fff",
            boxShadow: `4px 4px 0px ${BRAND_COLOR}`,
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#666", mb: 1 }}>
            この駅のがっつり飯をもっと探す
          </Typography>
          <Link
            href={`/station/${encodeURIComponent(report.station)}`}
            style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <TrainIcon sx={{ color: BRAND_COLOR }} />
            <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "1.1rem" }}>
              {report.station}駅のがっつりグルメ一覧を見る
            </Typography>
            <EastIcon sx={{ color: BRAND_COLOR }} />
          </Link>
        </Paper>

        <Divider sx={{ my: 5 }} />

        {/* 執筆者プロフィール */}
        <Box sx={{ mb: 4 }}>
          <EditorProfile heading="この記事を書いた人（実際に食べに行った人）" />
        </Box>

        {/* 免責・運営注記 */}
        <Typography variant="caption" sx={{ display: "block", color: "#999", lineHeight: 1.8, mb: 5 }}>
          ※本記事は{SITE_OPERATOR.editorialName}が実際に店舗を訪問した時点の体験・感想です。
          価格・メニュー・営業時間・混雑状況は変わることがあります。最新情報は各店舗の公式情報をご確認ください。
          ご意見・誤りのご指摘は
          <Link href="/contact" style={{ color: BRAND_COLOR, fontWeight: 700 }}>お問い合わせ</Link>
          までお寄せください。
        </Typography>
      </Box>

      {/* 関連コラム */}
      {related.length > 0 && (
        <Box component="section" sx={{ mt: 4 }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 900, mb: 3 }}>
            あわせて読みたい
          </Typography>
          <Grid container spacing={2}>
            {related.map((r) => (
              <Grid key={r.slug} size={{ xs: 12, sm: 4 }}>
                <Link
                  href={`/column/${r.slug}`}
                  style={{ textDecoration: "none", height: "100%", display: "block" }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      height: "100%",
                      borderRadius: 3,
                      border: "2px solid #EEE",
                      transition: "all 0.15s",
                      "&:hover": { borderColor: BRAND_COLOR },
                    }}
                  >
                    <Typography variant="h5" component="span" sx={{ display: "block", mb: 1 }}>
                      {r.emoji}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.4 }}>
                      {r.cardTitle}
                    </Typography>
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "baseline" }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: 900, color: BRAND_COLOR, flexShrink: 0, width: 56 }}
        >
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, color: DARK_COLOR }}>
          {value}
        </Typography>
      </Box>
    </Grid>
  );
}
