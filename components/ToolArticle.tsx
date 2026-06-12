import { Box, Container, Paper, Typography } from "@mui/material";
import { ReactNode } from "react";

/**
 * ツールページ下部に表示する解説記事のレイアウト部品。
 * 使い方・計算の仕組み・FAQなどのテキストコンテンツをサーバーレンダリングで提供する。
 */

export function ToolArticle({ children }: { children: ReactNode }) {
  return (
    <Container maxWidth="md" sx={{ pb: 10 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>{children}</Box>
    </Container>
  );
}

export function ArticleSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Paper
      component="section"
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        border: "2px solid #1A1A1A",
        bgcolor: "#fff",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: 900, mb: 2.5, fontSize: { xs: "1.2rem", md: "1.4rem" } }}
      >
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

export function ArticleText({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body1" sx={{ color: "#444", lineHeight: 2, mb: 2 }}>
      {children}
    </Typography>
  );
}

export function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <Box component="ol" sx={{ pl: 0, m: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 2 }}>
      {steps.map((step, i) => (
        <Box component="li" key={step.title} sx={{ display: "flex", gap: 2 }}>
          <Typography sx={{ fontWeight: 900, color: "#FF6B00", fontSize: "1.2rem", flexShrink: 0 }}>
            {String(i + 1).padStart(2, "0")}
          </Typography>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1A1A1A" }}>
              {step.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mt: 0.5, lineHeight: 1.8 }}>
              {step.body}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {faqs.map((faq) => (
        <Box key={faq.q}>
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{ fontWeight: 900, color: "#1A1A1A", mb: 1, display: "flex", gap: 1 }}
          >
            <Box component="span" sx={{ color: "#FF6B00", flexShrink: 0 }}>
              Q.
            </Box>
            {faq.q}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.9, pl: 3.5 }}>
            {faq.a}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export function NoteBox({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="body2"
      sx={{
        p: 2,
        borderLeft: "4px solid #FF6B00",
        bgcolor: "#FFF9F5",
        color: "#666",
        lineHeight: 1.8,
      }}
    >
      {children}
    </Typography>
  );
}
