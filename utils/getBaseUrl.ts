export const getBaseUrl = () => {
  // ブラウザ環境（クライアントサイド）の場合
  if (typeof window !== "undefined") return "";

  // Vercel本番環境（独自ドメインがあればそれを使う）
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;

  // ローカル環境
  return "http://localhost:3000";
};