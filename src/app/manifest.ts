import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "土屋貴裕 | TSUCHIYA Takahiro",
    short_name: "土屋貴裕",
    description:
      "土屋貴裕 – 京都外国語大学 教授。中国研究・応用経済学・安全保障・データサイエンス。",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/maskable-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop-1280x720.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: "土屋貴裕 公式サイト – デスクトップ表示",
      },
      {
        src: "/screenshots/mobile-750x1334.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "土屋貴裕 公式サイト – モバイル表示",
      },
    ],
    categories: ["education", "news", "productivity"],
    lang: "ja",
    dir: "ltr",
  };
}
