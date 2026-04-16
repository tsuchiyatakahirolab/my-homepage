import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "土屋貴裕 | TSUCHIYA Takahiro – 京都外国語大学 教授",
  description:
    "土屋貴裕（つちやたかひろ）– 京都外国語大学 国際貢献学部 グローバルスタディーズ学科 教授。中国研究・応用経済学・安全保障・データサイエンスを専門とし、インテリジェンスの視点からグローバル社会の課題を読み解く。Tsuchiya Takahiro – Professor at Kyoto University of Foreign Studies.",
  keywords: [
    "土屋貴裕",
    "つちやたかひろ",
    "Tsuchiya Takahiro",
    "京都外国語大学",
    "教授",
    "中国研究",
    "安全保障",
    "インテリジェンス",
    "応用経済学",
    "データサイエンス",
    "国際貢献学部",
    "グローバルスタディーズ",
  ],
  authors: [{ name: "土屋貴裕", url: "https://tsuchiyatakahiro.com" }],
  creator: "土屋貴裕",
  metadataBase: new URL("https://tsuchiyatakahiro.com"),
  alternates: {
    canonical: "https://tsuchiyatakahiro.com",
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://tsuchiyatakahiro.com",
    siteName: "土屋貴裕 | TSUCHIYA Takahiro",
    title: "土屋貴裕 | TSUCHIYA Takahiro – 京都外国語大学 教授",
    description:
      "土屋貴裕 – 京都外国語大学 教授。中国研究・応用経済学・安全保障・データサイエンスを専門とし、インテリジェンスの視点からグローバル社会の課題を読み解く。",
    images: [
      {
        url: "/images/profile.jpg",
        width: 1200,
        height: 630,
        alt: "土屋貴裕 – TSUCHIYA Takahiro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "土屋貴裕 | TSUCHIYA Takahiro – 京都外国語大学 教授",
    description:
      "土屋貴裕 – 京都外国語大学 教授。中国研究・安全保障・インテリジェンス研究。",
    images: ["/images/profile.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console の確認コードを取得したらここに設定
    // google: "your-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "土屋貴裕",
    alternateName: "TSUCHIYA Takahiro",
    url: "https://tsuchiyatakahiro.com",
    image: "https://tsuchiyatakahiro.com/images/profile.jpg",
    jobTitle: "教授",
    worksFor: {
      "@type": "Organization",
      name: "京都外国語大学",
      alternateName: "Kyoto University of Foreign Studies",
    },
    knowsAbout: [
      "中国研究",
      "応用経済学",
      "安全保障",
      "データサイエンス",
      "インテリジェンス",
    ],
  };

  return (
    <html lang="ja" className={`${geistSans.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
