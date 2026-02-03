"use client";

import { Breadcrumbs as MUIBreadcrumbs, Typography, Link as MUILink, Box } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import Link from "next/link";

export const Breadcrumbs = ({ stationName }: { stationName: string }) => {
  return (
    <Box sx={{ py: 2, px: { xs: 2, md: 0 } }}>
      <MUIBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" sx={{ color: "#FF6B00" }} />}
        aria-label="breadcrumb"
        sx={{
          "& .MuiBreadcrumbs-li": {
            fontWeight: 800,
            fontSize: "0.85rem",
          }
        }}
      >
        <MUILink
          component={Link} 
          href="/"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "#666",
            textDecoration: "none",
            "&:hover": { color: "#FF6B00" },
          }}
        >
          <HomeIcon sx={{ mr: 0.5, fontSize: "1.2rem" }} />
          ホーム
        </MUILink>

        <Typography sx={{ color: "#1A1A1A", fontWeight: 900 }}>
          {stationName}駅周辺のがっつり飯
        </Typography>
      </MUIBreadcrumbs>
    </Box>
  );
};