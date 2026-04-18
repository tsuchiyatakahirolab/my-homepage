import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import PwaProvider from "@/pwa/PwaProvider";

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

const SITE_URL = "https://tsuchiyatakahiro.com";
const SITE_TITLE = "土屋貴裕（つちやたかひろ）| TSUCHIYA Takahiro – 京都外国語大学 教授 公式サイト";
const SITE_DESCRIPTION =
  "土屋貴裕（つちやたかひろ、TSUCHIYA Takahiro）公式サイト。京都外国語大学 教養教育機構 教授。東京大学 先端科学技術研究センター 客員上級研究員。慶應義塾大学 SFC研究所 上席所員。専門は中国研究・応用経済学・安全保障・データサイエンス・インテリジェンス。博士（安全保障学）。";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s | 土屋貴裕",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "土屋貴裕",
    "つちやたかひろ",
    "ツチヤタカヒロ",
    "Tsuchiya Takahiro",
    "TSUCHIYA Takahiro",
    "京都外国語大学",
    "京都外大",
    "教養教育機構",
    "教授",
    "中国研究",
    "中国経済",
    "安全保障",
    "安全保障学",
    "インテリジェンス",
    "国家安全保障",
    "応用経済学",
    "データサイエンス",
    "経済安全保障",
    "東京大学先端科学技術研究センター",
    "慶應義塾大学SFC研究所",
    "防衛大学校",
    "一橋大学",
    "嘉悦大学",
    "同志社大学",
    "陸上自衛隊",
    "平和安全保障研究所",
    "RIPS",
  ],
  authors: [{ name: "土屋貴裕", url: SITE_URL }],
  creator: "土屋貴裕",
  publisher: "土屋貴裕",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      ja: SITE_URL,
      en: SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "profile",
    locale: "ja_JP",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: "土屋貴裕 | TSUCHIYA Takahiro",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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
    title: SITE_TITLE,
    description:
      "土屋貴裕 – 京都外国語大学 教授。中国研究・応用経済学・安全保障・データサイエンス・インテリジェンス研究。博士（安全保障学）。",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
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
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "土屋貴裕",
    givenName: "貴裕",
    familyName: "土屋",
    alternateName: ["つちやたかひろ", "TSUCHIYA Takahiro", "Takahiro Tsuchiya"],
    url: SITE_URL,
    mainEntityOfPage: SITE_URL,
    image: `${SITE_URL}/images/profile.jpg`,
    description: SITE_DESCRIPTION,
    jobTitle: ["教授", "Professor"],
    honorificSuffix: "Ph.D.",
    worksFor: {
      "@type": "CollegeOrUniversity",
      name: "京都外国語大学",
      alternateName: "Kyoto University of Foreign Studies",
      department: "教養教育機構 (Institute for Liberal Arts and Sciences)",
      url: "https://www.kufs.ac.jp/",
    },
    affiliation: [
      {
        "@type": "Organization",
        name: "東京大学 先端科学技術研究センター",
        alternateName: "Research Center for Advanced Science and Technology, The University of Tokyo",
        url: "https://www.rcast.u-tokyo.ac.jp/",
      },
      {
        "@type": "Organization",
        name: "慶應義塾大学 SFC研究所",
        alternateName: "Keio Research Institute at SFC",
        url: "https://www.kri.sfc.keio.ac.jp/",
      },
      {
        "@type": "Organization",
        name: "嘉悦大学 戦略・日本研究センター",
        alternateName: "Center for Strategic and Japan Studies, Kaetsu University",
      },
      {
        "@type": "Organization",
        name: "同志社大学",
        alternateName: "Doshisha University",
      },
      {
        "@type": "Organization",
        name: "陸上自衛隊中部方面隊",
        alternateName: "JGSDF Central Army",
      },
      {
        "@type": "Organization",
        name: "平和・安全保障研究所",
        alternateName: "Research Institute for Peace and Security (RIPS)",
      },
    ],
    alumniOf: [
      {
        "@type": "CollegeOrUniversity",
        name: "防衛大学校",
        alternateName: "National Defense Academy of Japan",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "一橋大学",
        alternateName: "Hitotsubashi University",
      },
      {
        "@type": "CollegeOrUniversity",
        name: "慶應義塾大学",
        alternateName: "Keio University",
      },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Doctoral Degree",
        name: "博士（安全保障学）",
        educationalLevel: "PhD in Security Studies",
        recognizedBy: {
          "@type": "Organization",
          name: "防衛大学校 / 大学改革支援・学位授与機構 (NIAD)",
        },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Master's Degree",
        name: "修士（応用経済学）",
        educationalLevel: "MA in Applied Economics",
        recognizedBy: { "@type": "Organization", name: "一橋大学" },
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Bachelor's Degree",
        name: "学士（環境情報学）",
        educationalLevel: "BA in Environmental Information",
        recognizedBy: { "@type": "Organization", name: "慶應義塾大学" },
      },
    ],
    knowsAbout: [
      "中国研究",
      "China Studies",
      "応用経済学",
      "Applied Economics",
      "安全保障",
      "Security Studies",
      "データサイエンス",
      "Data Science",
      "インテリジェンス",
      "Intelligence Studies",
      "経済安全保障",
      "Economic Security",
      "国家安全保障",
      "National Security",
    ],
    knowsLanguage: ["ja", "en", "zh"],
    nationality: { "@type": "Country", name: "Japan" },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "土屋貴裕 | TSUCHIYA Takahiro",
    alternateName: ["土屋貴裕 公式サイト", "TSUCHIYA Takahiro Official Website"],
    description: SITE_DESCRIPTION,
    inLanguage: ["ja", "en"],
    publisher: { "@id": `${SITE_URL}/#person` },
    about: { "@id": `${SITE_URL}/#person` },
  };

  const sanitize = (obj: unknown): string =>
    JSON.stringify(obj).replace(/</g, "\\u003c");

  return (
    <html lang="ja" className={`${geistSans.variable} ${playfair.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitize(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: sanitize(websiteJsonLd) }}
        />

        {/*
          Server-rendered SEO content for search crawlers.
          Visually hidden via `sr-only` (Tailwind accessibility utility) so it
          does not affect the existing visual design, but the HTML is present
          in the initial render which Googlebot indexes. This is standard
          practice accepted by Google when the hidden content accurately
          reflects page subject matter.
        */}
        <div className="sr-only" aria-hidden="false">
          <h1>
            土屋貴裕（つちやたかひろ）| TSUCHIYA Takahiro – 京都外国語大学 教授
            公式サイト
          </h1>
          <p>
            土屋貴裕（つちや・たかひろ、TSUCHIYA Takahiro,
            Ph.D.）は、京都外国語大学 教養教育機構 教授。中国研究・応用経済学・安全保障・データサイエンス・インテリジェンスを専門とする。
          </p>
          <h2>所属・兼務</h2>
          <ul>
            <li>京都外国語大学 教養教育機構 教授（本務）</li>
            <li>東京大学 先端科学技術研究センター 客員上級研究員</li>
            <li>慶應義塾大学 SFC研究所 上席所員</li>
            <li>嘉悦大学 戦略・日本研究センター 客員教授</li>
            <li>同志社大学 非常勤講師</li>
            <li>陸上自衛隊中部方面隊 オピニオンリーダー</li>
            <li>平和・安全保障研究所（RIPS）研究委員</li>
          </ul>
          <h2>学位</h2>
          <ul>
            <li>博士（安全保障学）防衛大学校 / 大学改革支援・学位授与機構（NIAD）</li>
            <li>修士（応用経済学）一橋大学</li>
            <li>学士（環境情報学）慶應義塾大学</li>
          </ul>
          <h2>専門分野</h2>
          <p>
            中国研究、中国経済、応用経済学、安全保障、安全保障学、国家安全保障、経済安全保障、インテリジェンス、データサイエンス。
          </p>
          <p>
            TSUCHIYA Takahiro is Professor at the Institute for Liberal Arts
            and Sciences, Kyoto University of Foreign Studies. His research
            focuses on China Studies, Applied Economics, Security Studies, and
            Data Science.
          </p>
        </div>

        {children}
        <PwaProvider />
      </body>
    </html>
  );
}
