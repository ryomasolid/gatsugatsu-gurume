import ColumnShowcase from "@/components/ColumnShowcase";
import ReportShowcase from "@/components/ReportShowcase";
import StationDirectory from "@/components/StationDirectory";
import ToolsShowcase from "@/components/ToolsShowcase";
import TrendBanner from "@/components/TrendBanner";
import { WelcomeSection } from "@/components/WelcomeSection";
import { Container } from "@mui/material";

export default function Home() {
  // 「編集部の読み物（一次体験・オリジナル記事）が主、店舗検索は従」の順で構成する。
  // レポート・コラムを上部に置くことで、データ転載ではなく編集メディアであることを示す。
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <WelcomeSection />
      <ReportShowcase />
      <ColumnShowcase />
      <TrendBanner />
      <ToolsShowcase />
      <StationDirectory />
    </Container>
  );
}
