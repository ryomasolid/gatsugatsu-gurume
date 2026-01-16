"use client";

import { WelcomeSection } from "@/components/WelcomeSection";
import { Container } from "@mui/material";
import { Suspense } from "react";

export default function Home() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Suspense fallback={null}>
        <WelcomeSection />
      </Suspense>
    </Container>
  );
}
