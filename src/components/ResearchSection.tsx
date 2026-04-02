"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Theme, Lang } from "@/app/page";

interface ResearchSectionProps {
  lang: Lang;
  theme: Theme;
}

const RESEARCH_AREAS_EN = [
  "China\u2019s national strategy and its impact on regional economies",
  "Geopolitical risk assessment and \u201Ceconomic security\u201D strategies",
  "Policy analysis through AI and data science methodologies",
  "Re-examining East Asian order through the lens of international relations theory",
];

const RESEARCH_AREAS_JP = [
  "中国の国家戦略と地域経済への影響",
  "地政学的リスク評価と「経済安全保障」戦略",
  "AIおよびデータサイエンス手法による政策分析",
  "国際関係理論を通じた東アジア秩序の再検討",
];

export default function ResearchSection({ lang, theme }: ResearchSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const isDark = theme === "black";
  const areas = lang === "en" ? RESEARCH_AREAS_EN : RESEARCH_AREAS_JP;

  return (
    <section
      ref={ref}
      id="research"
      className="snap-section"
      style={{ background: "var(--background)" }}
    >
      <div className="mx-auto flex w-full min-h-screen max-w-7xl flex-col justify-center px-6 py-16 sm:py-24 lg:flex-row lg:items-center lg:gap-20 lg:px-12">
        {/* Left: decorative area */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8 }}
          className="relative mb-8 flex aspect-[4/3] w-full flex-1 items-center justify-center overflow-hidden sm:aspect-square lg:mb-0 lg:aspect-auto lg:min-h-[400px]"
          style={{ background: "var(--surface)" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{
              backgroundImage: "url(/images/gallery.png)",
            }}
          />
        </motion.div>

        {/* Right: content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 lg:max-w-lg"
        >
          <p
            className="mb-2 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Research" : "研究"}
          </p>
          <h2 className="heading-serif mb-8 text-2xl lg:text-3xl">
            {lang === "en" ? "Key Research Areas" : "主要研究領域"}
          </h2>

          <ul className="mb-12 space-y-4">
            {areas.map((area, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                }
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3 text-sm leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.7 }}
              >
                <span
                  className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full"
                  style={{ background: "var(--foreground)", opacity: 0.3 }}
                />
                {area}
              </motion.li>
            ))}
          </ul>

          <div className="divider mb-8" />

          <h3
            className="mb-4 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Links & Publications" : "リンク・業績"}
          </h3>
          <p
            className="mb-4 text-xs leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            {lang === "en"
              ? "For detailed publication lists and research outputs, please visit:"
              : "詳細な業績一覧は以下をご覧ください："}
          </p>
          <a
            href="https://researchmap.jp/tsuchiyatakahiro"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline text-sm font-medium tracking-wide"
          >
            researchmap (Takahiro Tsuchiya) &rarr;
          </a>
        </motion.div>
      </div>
    </section>
  );
}
