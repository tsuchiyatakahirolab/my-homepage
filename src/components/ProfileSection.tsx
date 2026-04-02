"use client";

import Image from "next/image";
import SectionWrapper from "./SectionWrapper";
import type { Theme, Lang } from "@/app/page";

interface ProfileSectionProps {
  lang: Lang;
  theme: Theme;
}

const AFFILIATIONS_EN = [
  "Visiting Senior Researcher, Research Center for Advanced Science and Technology,\nThe University of Tokyo",
  "Senior Researcher, Keio Research Institute at SFC, Keio University",
  "Visiting Professor, Center for Strategic and Japan Studies, Kaetsu University",
  "Part-time Lecturer, Doshisha University",
  "Opinion Leader, JGSDF Central Army",
  "Research Committee, Research Institute for Peace and Security (RIPS)",
];

const AFFILIATIONS_JP = [
  "東京大学 先端科学技術研究センター 客員上級研究員",
  "慶應義塾大学 SFC研究所 上席所員",
  "嘉悦大学 戦略・日本研究センター 客員教授",
  "同志社大学 非常勤講師",
  "陸上自衛隊中部方面隊 オピニオンリーダー",
  "平和・安全保障研究所（RIPS）研究委員",
];

const DEGREES_EN = [
  "Ph.D. in Security Studies (National Defense Academy / NIAD)",
  "M.A. in Applied Economics (Hitotsubashi University)",
  "B.A. in Environmental Information (Keio University)",
];

const DEGREES_JP = [
  "博士（安全保障学）（防衛大学校 / NIAD）",
  "修士（応用経済学）（一橋大学）",
  "学士（環境情報学）（慶應義塾大学）",
];

export default function ProfileSection({ lang, theme }: ProfileSectionProps) {
  const isDark = theme === "black";
  const affiliations = lang === "en" ? AFFILIATIONS_EN : AFFILIATIONS_JP;
  const degrees = lang === "en" ? DEGREES_EN : DEGREES_JP;

  return (
    <SectionWrapper
      id="profile"
      className={isDark ? "bg-[#0a0a0a]" : "bg-white"}
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-8 px-6 py-16 sm:gap-12 sm:py-24 lg:flex-row lg:gap-16 lg:px-12 lg:py-12">
        {/* Photo */}
        <div className="relative flex-shrink-0">
          <div className="relative h-[280px] w-[210px] overflow-hidden sm:h-[400px] sm:w-[300px] lg:h-[440px] lg:w-[330px]">
            <Image
              src="/images/profile.jpg"
              alt="TSUCHIYA Takahiro"
              fill
              className="object-cover"
              style={{ filter: "grayscale(80%) contrast(1.05)" }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="max-w-lg">
          <p
            className="mb-2 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Profile" : "プロフィール"}
          </p>
          <h2 className="heading-serif mb-2 text-3xl font-normal tracking-wide lg:text-4xl">
            {lang === "en" ? "TSUCHIYA Takahiro" : "土屋 貴裕"}
          </h2>
          <p
            className="heading-serif mb-8 text-base"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            Ph.D.
          </p>

          <div className="divider mb-8" />

          <p
            className="mb-6 text-sm leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.8 }}
          >
            {lang === "en" ? (
              <>
                Professor, Institute for Liberal Arts and Sciences,
                <br />
                Kyoto University of Foreign Studies (KUFS)
              </>
            ) : (
              <>
                京都外国語大学 教養教育機構 教授
              </>
            )}
          </p>

          <h3
            className="mb-4 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Affiliations" : "兼務"}
          </h3>
          <ul className="space-y-2 text-xs leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.7 }}>
            {affiliations.map((item, i) => (
              <li key={i} className="whitespace-pre-line">{item}</li>
            ))}
          </ul>

          <div className="divider mb-8 mt-8" />

          <h3
            className="mb-4 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Degrees" : "学位"}
          </h3>
          <ul className="space-y-2 text-xs leading-relaxed" style={{ color: "var(--foreground)", opacity: 0.7 }}>
            {degrees.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}
