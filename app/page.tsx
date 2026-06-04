import { WelcomeSection } from "@/components/WelcomeSection";
import { Container } from "@mui/material";

export default function Home() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <WelcomeSection />
    </Container>
  );
}
