import { SITE_OPERATOR } from "@/constants/siteOperator";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { Box, Paper, Typography } from "@mui/material";
import Link from "next/link";

const BRAND_COLOR = "#FF6B00";
const DARK_COLOR = "#1A1A1A";

/**
 * 編集部（執筆者）のプロフィールカード。
 * コラム記事の末尾などに表示し、コンテンツの作り手を明示する（E-E-A-T）。
 */
export default function EditorProfile({
  heading = "この記事を書いた人",
}: {
  heading?: string;
}) {
  return (
    <Paper
      component="aside"
      elevation={0}
      sx={{
        p: { xs: 3, md: 3.5 },
        borderRadius: 4,
        border: `2px solid ${DARK_COLOR}`,
        bgcolor: "#FFF9F5",
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 900, color: "#999", letterSpacing: "0.08em" }}>
        {heading}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", mt: 1.5 }}>
        <Box
          sx={{
            flexShrink: 0,
            width: 56,
            height: 56,
            borderRadius: "50%",
            bgcolor: BRAND_COLOR,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WhatshotIcon sx={{ color: "#fff", fontSize: "2rem" }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: DARK_COLOR }}>
            {SITE_OPERATOR.editorialName}
          </Typography>
          <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.9, mt: 0.5 }}>
            {SITE_OPERATOR.bio}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: "#666" }}>
            運営: {SITE_OPERATOR.representativeName} ・{" "}
            <Link href={SITE_OPERATOR.contactPath} style={{ color: BRAND_COLOR, fontWeight: 800, textDecoration: "none" }}>
              お問い合わせ
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
