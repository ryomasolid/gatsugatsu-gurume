import { Noto_Sans_JP } from "next/font/google";
import AppLayout from "./components/AppLayout"; // 追加
import ThemeRegistry from "./components/ThemeRegistry";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "ガツガツグルメ",
  description: "駅周辺のがっつり系グルメ検索アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>
        <ThemeRegistry>
          {/* Boxなどは AppLayout 側に移動したため、ここではシンプルに AppLayout で囲むだけ */}
          <AppLayout>{children}</AppLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}
