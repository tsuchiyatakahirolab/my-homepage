"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Theme, Lang } from "@/app/page";

interface LectureSectionProps {
  lang: Lang;
  theme: Theme;
}

const KUFS_COURSES_EN = [
  { name: "Japan and China in the World A", lang: "Japanese" },
  { name: "Fundamentals of Chinese Politics", lang: "Japanese" },
  { name: "Introduction to Economics", lang: "Japanese" },
  { name: "Basic Economics", lang: "English" },
  { name: "Applied Economics", lang: "Japanese" },
  { name: "Applied Economics", lang: "English" },
  { name: "Introduction to Data Science", lang: "Japanese" },
  { name: "Data Science", lang: "Japanese" },
  { name: "International Relations C", lang: "English" },
  {
    name: "Special Studies in International Relations",
    lang: "Graduate School, Japanese",
  },
  { name: "Seminar: Business Management I\u2013IV", lang: "Japanese" },
];

const KUFS_COURSES_JP = [
  { name: "世界の中の日本と中国A", lang: "日本語" },
  { name: "中国政治概論", lang: "日本語" },
  { name: "経済学入門", lang: "日本語" },
  { name: "Basic Economics", lang: "英語" },
  { name: "経済学応用", lang: "日本語" },
  { name: "Applied Economics", lang: "英語" },
  { name: "データサイエンス入門", lang: "日本語" },
  { name: "データサイエンス", lang: "日本語" },
  { name: "International Relations C", lang: "英語" },
  {
    name: "国際関係特殊研究",
    lang: "大学院・日本語",
  },
  { name: "ビジネス・マネジメント・ゼミナールI〜IV", lang: "日本語" },
];

const DOSHISHA_COURSES_EN = [
  { name: "International Relations 6 (Foreign Policy)", lang: "Japanese" },
  { name: "Area Studies 1 (China)", lang: "Japanese" },
];

const DOSHISHA_COURSES_JP = [
  { name: "国際関係6（外交政策）", lang: "日本語" },
  { name: "地域研究1（中国）", lang: "日本語" },
];

export default function LectureSection({ lang, theme }: LectureSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const kufsCourses = lang === "en" ? KUFS_COURSES_EN : KUFS_COURSES_JP;
  const doshishaCourses = lang === "en" ? DOSHISHA_COURSES_EN : DOSHISHA_COURSES_JP;

  return (
    <section
      ref={ref}
      id="lecture"
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
            {lang === "en" ? "Lecture 2026" : "講義 2026"}
          </p>
          <div className="divider mb-12" />
        </motion.div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* KUFS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="mb-6 text-xs font-semibold tracking-[0.15em] uppercase">
              {lang === "en"
                ? "@ Kyoto University of Foreign Studies"
                : "@ 京都外国語大学"}
            </h3>
            <ul className="space-y-3">
              {kufsCourses.map((course, i) => (
                <li
                  key={i}
                  className="flex items-baseline justify-between gap-4 border-b pb-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--foreground)", opacity: 0.8 }}
                  >
                    {course.name}
                  </span>
                  <span
                    className="flex-shrink-0 text-[10px] tracking-wider"
                    style={{ color: "var(--foreground)", opacity: 0.4 }}
                  >
                    ({course.lang})
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Doshisha */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="mb-6 text-xs font-semibold tracking-[0.15em] uppercase">
              {lang === "en"
                ? "@ Graduate School of Law, Doshisha University"
                : "@ 同志社大学大学院 法学研究科"}
            </h3>
            <ul className="space-y-3">
              {doshishaCourses.map((course, i) => (
                <li
                  key={i}
                  className="flex items-baseline justify-between gap-4 border-b pb-3"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--foreground)", opacity: 0.8 }}
                  >
                    {course.name}
                  </span>
                  <span
                    className="flex-shrink-0 text-[10px] tracking-wider"
                    style={{ color: "var(--foreground)", opacity: 0.4 }}
                  >
                    ({course.lang})
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
