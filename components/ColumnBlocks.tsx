import { Box, Typography } from "@mui/material";
import NextImage from "next/image";
import { ColumnBlock } from "@/constants/columns";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

/**
 * コラム記事の本文ブロックをレンダリングするサーバーコンポーネント。
 * 見出し・段落・リスト・手順・補足・FAQ の各ブロックに対応する。
 */
export default function ColumnBlocks({ blocks }: { blocks: ColumnBlock[] }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {blocks.map((block, i) => (
        <ColumnBlockView key={i} block={block} />
      ))}
    </Box>
  );
}

function ColumnBlockView({ block }: { block: ColumnBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "1.2rem", md: "1.5rem" },
            color: DARK_COLOR,
            mt: 2,
            pb: 1,
            borderBottom: `3px solid ${BRAND_COLOR}`,
          }}
        >
          {block.text}
        </Typography>
      );
    case "p":
      return (
        <Typography variant="body1" sx={{ color: "#333", lineHeight: 2 }}>
          {block.text}
        </Typography>
      );
    case "list":
      return (
        <Box component="ul" sx={{ pl: 0, m: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 1.5 }}>
          {block.items.map((item, i) => (
            <Box
              key={i}
              component="li"
              sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
            >
              <Box
                component="span"
                sx={{ color: BRAND_COLOR, fontWeight: 900, flexShrink: 0, mt: "1px" }}
              >
                ●
              </Box>
              <Typography variant="body1" sx={{ color: "#333", lineHeight: 1.9 }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    case "steps":
      return (
        <Box component="ol" sx={{ pl: 0, m: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 2.5 }}>
          {block.steps.map((step, i) => (
            <Box component="li" key={step.title} sx={{ display: "flex", gap: 2 }}>
              <Box
                sx={{
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  bgcolor: BRAND_COLOR,
                  color: "#fff",
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#555", mt: 0.5, lineHeight: 1.9 }}>
                  {step.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      );
    case "note":
      return (
        <Typography
          variant="body2"
          sx={{
            p: 2.5,
            borderLeft: `4px solid ${BRAND_COLOR}`,
            bgcolor: "#FFF9F5",
            borderRadius: "0 8px 8px 0",
            color: "#555",
            lineHeight: 1.9,
          }}
        >
          {block.text}
        </Typography>
      );
    case "photo":
      return (
        <Box component="figure" sx={{ m: 0 }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "4 / 3",
              borderRadius: 3,
              overflow: "hidden",
              border: `2px solid ${DARK_COLOR}`,
            }}
          >
            <NextImage
              src={block.src}
              alt={block.alt}
              fill
              sizes="(max-width: 900px) 100vw, 800px"
              style={{ objectFit: "cover" }}
            />
          </Box>
          {block.caption && (
            <Typography
              component="figcaption"
              variant="caption"
              sx={{ display: "block", mt: 1, color: "#888", fontWeight: 700 }}
            >
              {block.caption}
            </Typography>
          )}
        </Box>
      );
    case "faq":
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {block.faqs.map((faq) => (
            <Box key={faq.q}>
              <Typography
                variant="subtitle1"
                component="h3"
                sx={{ fontWeight: 900, color: DARK_COLOR, mb: 1, display: "flex", gap: 1 }}
              >
                <Box component="span" sx={{ color: BRAND_COLOR, flexShrink: 0 }}>
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
    default:
      return null;
  }
}
