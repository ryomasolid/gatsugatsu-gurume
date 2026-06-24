import { COLUMNS } from "@/constants/columns";
import { Box, Chip, Container, Grid, Paper, Typography } from "@mui/material";
import { Metadata } from "next";
import Link from "next/link";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";
const SITE_URL = "https://gatsugatsu-gurume.com";

export const metadata: Metadata = {
  title: "がっつり飯コラム｜食べ方・外食術・グルメの知識",
  description:
    "二郎系ラーメンの食べ方、デカ盛り完食のコツ、外食カロリーとの付き合い方、高コスパランチ術など、がっつり飯をもっと楽しむための編集部オリジナル記事をまとめています。",
  alternates: { canonical: "/column" },
  openGraph: {
    title: "がっつり飯コラム｜ガツガツグルメ",
    description:
      "食べ方・外食術・グルメの知識まで。がっつり飯をもっと楽しむための編集部オリジナル記事。",
    url: `${SITE_URL}/column`,
    type: "website",
  },
};

export default function ColumnIndexPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "がっつり飯コラム",
    itemListElement: COLUMNS.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/column/${c.slug}`,
      name: c.title,
    })),
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <Box sx={{ mb: 5 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 900, fontSize: { xs: "1.8rem", md: "2.5rem" }, mb: 1.5 }}
        >
          がっつり飯コラム
        </Typography>
        <Typography variant="body1" sx={{ color: "#555", fontWeight: 700, lineHeight: 1.9, maxWidth: 720 }}>
          店探しだけでは終わらない。二郎系の食べ方からデカ盛り完食のコツ、外食とカロリーの付き合い方、
          値上げ時代の高コスパランチ術まで——がっつり飯をもっと楽しむための知識とコツを、編集部が書き下ろしでお届けします。
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {COLUMNS.map((c) => (
          <Grid key={c.slug} size={{ xs: 12, sm: 6, md: 4 }}>
            <Link
              href={`/column/${c.slug}`}
              style={{ textDecoration: "none", height: "100%", display: "block" }}
            >
              <Paper
                component="article"
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  border: `2px solid ${DARK_COLOR}`,
                  boxShadow: `5px 5px 0px ${DARK_COLOR}`,
                  transition: "all 0.15s",
                  "&:hover": {
                    transform: "translate(-3px, -3px)",
                    boxShadow: `8px 8px 0px ${BRAND_COLOR}`,
                    borderColor: BRAND_COLOR,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Typography variant="h4" component="span">
                    {c.emoji}
                  </Typography>
                  <Chip
                    label={c.category}
                    size="small"
                    sx={{ fontWeight: 800, bgcolor: "#FFF5ED", color: BRAND_COLOR, border: `1px solid ${BRAND_COLOR}` }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: 900, color: DARK_COLOR, lineHeight: 1.3, mb: 1.5 }}
                >
                  {c.cardTitle}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#666", lineHeight: 1.8, flexGrow: 1 }}
                >
                  {c.lead}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ mt: 2, color: "#999", fontWeight: 700 }}
                >
                  約{c.readMinutes}分で読めます
                </Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
