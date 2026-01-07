import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // セキュリティヘッダーの追加
  async headers() {
    return [
      {
        // すべてのパス（画像やAPIを含む全ファイル）に対して適用
        source: "/(.*)",
        headers: [
          // 1. クリックジャッキング対策
          // 他の悪意あるサイトが、あなたのサイトをiframeで埋め込んで操作を盗むのを防ぎます。
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // 2. XSS対策（MIMEスニッフィング防止）
          // ブラウザがファイルの内容から勝手に実行形式を判断するのを防ぎます。
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // 3. リファラー情報の制御
          // 外部サイトへ移動する際、どこから来たかの情報を最小限に制限します。
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // 4. XSS保護（古いブラウザ用）
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
