"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import type { Theme, Lang } from "@/app/page";

interface ExpertiseSectionProps {
  lang: Lang;
  theme: Theme;
}

const AREAS_EN = [
  {
    title: "CHINA STUDIES",
    description:
      "In-depth analysis of socio-political shifts and economic policies within modern China.",
    image: "/images/china-map.png",
  },
  {
    title: "APPLIED ECONOMICS",
    description:
      "Utilizing economic theories to solve practical problems in global markets.",
    image: "/images/data-table.jpg",
  },
  {
    title: "SECURITY STUDIES",
    description:
      "Strategic analysis of national security, defense policy, and international stability.",
    image: "/images/architecture.jpg",
  },
  {
    title: "DATA SCIENCE",
    description:
      "Advanced statistical modeling and big data analytics applied to social sciences.",
    image: "/images/network.png",
  },
];

const AREAS_JP = [
  {
    title: "中国研究",
    description:
      "現代中国における社会政治的変動と経済政策の深層分析。",
    image: "/images/china-map.png",
  },
  {
    title: "応用経済学",
    description:
      "経済理論を活用し、グローバル市場における実践的な課題を解決する。",
    image: "/images/data-table.jpg",
  },
  {
    title: "安全保障学",
    description:
      "国家安全保障、防衛政策、国際的安定性の戦略的分析。",
    image: "/images/architecture.jpg",
  },
  {
    title: "データサイエンス",
    description:
      "社会科学に応用する高度な統計モデリングとビッグデータ分析。",
    image: "/images/network.png",
  },
];

export default function ExpertiseSection({ lang, theme }: ExpertiseSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const isDark = theme === "black";
  const areas = lang === "en" ? AREAS_EN : AREAS_JP;

  return (
    <section
      ref={ref}
      id="expertise"
      className="snap-section"
      style={{ background: "var(--surface)" }}
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-24 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <p
            className="mb-2 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Areas of Expertise" : "専門分野"}
          </p>
          <div className="divider mb-12" />
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-8 lg:grid-cols-4">
          {areas.map((area, i) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 40 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }
              }
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group"
            >
              <div className="relative mb-6 aspect-[4/3] overflow-hidden sm:aspect-square" style={{ background: "var(--background)" }}>
                <Image
                  src={area.image}
                  alt={area.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: "grayscale(100%) contrast(1.1)" }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "var(--overlay)" }}
                />
              </div>
              <h3 className="mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
                {area.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--foreground)", opacity: 0.6 }}
              >
                {area.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
