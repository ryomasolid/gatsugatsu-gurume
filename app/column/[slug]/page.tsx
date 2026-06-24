import ColumnBlocks from "@/components/ColumnBlocks";
import EditorProfile from "@/components/EditorProfile";
import {
  getColumn,
  getColumnSlugs,
  getRelatedColumns,
} from "@/constants/columns";
import EastIcon from "@mui/icons-material/East";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
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
import Link from "next/link";
import { notFound } from "next/navigation";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";
const SITE_URL = "https://gatsugatsu-gurume.com";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getColumnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const column = getColumn(slug);
  if (!column) return { robots: { index: false, follow: false } };

  const canonicalPath = `/column/${column.slug}`;
  return {
    title: column.title,
    description: column.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: column.title,
      description: column.description,
      url: `${SITE_URL}${canonicalPath}`,
      type: "article",
      siteName: "ガツガツグルメ",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: column.cardTitle,
      description: column.description,
    },
  };
}

/** 記事内の FAQ ブロックを集約して FAQPage 構造化データに変換する */
function buildFaqJsonLd(column: ReturnType<typeof getColumn>) {
  if (!column) return null;
  const faqs = column.blocks
    .filter((b): b is Extract<typeof b, { type: "faq" }> => b.type === "faq")
    .flatMap((b) => b.faqs);
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default async function ColumnArticlePage({ params }: Props) {
  const { slug } = await params;
  const column = getColumn(slug);
  if (!column) notFound();

  const pageUrl = `${SITE_URL}/column/${column.slug}`;
  const related = getRelatedColumns(column.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: column.title,
    description: column.description,
    datePublished: column.updatedAt,
    dateModified: column.updatedAt,
    author: { "@type": "Organization", name: "ガツガツグルメ編集部" },
    publisher: {
      "@type": "Organization",
      name: "ガツガツグルメ",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "コラム", item: `${SITE_URL}/column` },
      { "@type": "ListItem", position: 3, name: column.cardTitle, item: pageUrl },
    ],
  };

  const faqJsonLd = buildFaqJsonLd(column);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3, "& a": { color: "#666", textDecoration: "none", fontWeight: 700 } }}
      >
        <Link href="/">ホーム</Link>
        <Link href="/column">コラム</Link>
        <Typography sx={{ color: BRAND_COLOR, fontWeight: 800 }}>{column.cardTitle}</Typography>
      </Breadcrumbs>

      <Box component="article">
        {/* 記事ヘッダー */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Typography variant="h3" component="span">
              {column.emoji}
            </Typography>
            <Chip
              label={column.category}
              size="small"
              sx={{ fontWeight: 800, bgcolor: "#FFF5ED", color: BRAND_COLOR, border: `1px solid ${BRAND_COLOR}` }}
            />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 900, fontSize: { xs: "1.6rem", md: "2.2rem" }, lineHeight: 1.3, mb: 2 }}
          >
            {column.title}
          </Typography>
          <Typography variant="caption" sx={{ color: "#999", fontWeight: 700 }}>
            最終更新: {column.updatedAt} ・ ガツガツグルメ編集部 ・ 約{column.readMinutes}分で読めます
          </Typography>
        </Box>

        {/* リード文 */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 4,
            borderRadius: 4,
            bgcolor: "#FFF9F5",
            border: `2px solid ${DARK_COLOR}`,
          }}
        >
          <Typography variant="body1" sx={{ color: "#333", lineHeight: 2, fontWeight: 600 }}>
            {column.lead}
          </Typography>
        </Paper>

        {/* 本文 */}
        <ColumnBlocks blocks={column.blocks} />

        {/* ツール導線 */}
        {column.toolLink && (
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
              この記事に関連する無料ツール
            </Typography>
            <Link
              href={column.toolLink.href}
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <Typography sx={{ fontWeight: 900, color: BRAND_COLOR, fontSize: "1.1rem" }}>
                {column.toolLink.label}
              </Typography>
              <EastIcon sx={{ color: BRAND_COLOR }} />
            </Link>
          </Paper>
        )}

        <Divider sx={{ my: 5 }} />

        {/* 執筆者プロフィール */}
        <Box sx={{ mb: 4 }}>
          <EditorProfile />
        </Box>

        {/* 免責・運営注記 */}
        <Typography variant="caption" sx={{ display: "block", color: "#999", lineHeight: 1.8, mb: 5 }}>
          ※本記事はガツガツグルメ編集部が独自に作成した一般的な情報提供を目的とした読み物です。
          体調や体質には個人差があります。健康・栄養に関する記述は一般的な目安であり、無理のない範囲でお楽しみください。
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
