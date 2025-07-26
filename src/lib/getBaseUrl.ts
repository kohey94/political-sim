export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // クライアント側では location.origin を使用
    return window.location.origin;
  }

  // サーバーサイド（Vercel含む）
  if (process.env.BASE_URL) return process.env.BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
