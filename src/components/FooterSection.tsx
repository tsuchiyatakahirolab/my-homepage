"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import type { Theme, Lang } from "@/app/page";
import ObfuscatedEmail from "./ObfuscatedEmail";

interface FooterSectionProps {
  lang: Lang;
  theme: Theme;
}

export default function FooterSection({ lang, theme }: FooterSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const isDark = theme === "black";

  // Footer inverts: dark theme = light footer, light theme = dark footer
  const footerBg = isDark ? "#f0f0f0" : "#1a1a1a";
  const footerText = isDark ? "#1a1a1a" : "#ffffff";

  return (
    <footer
      ref={ref}
      className="snap-section relative flex flex-col items-center justify-center px-6 py-24"
      style={{ background: footerBg, color: footerText }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center text-center"
      >
        <h2 className="heading-serif mb-4 text-2xl tracking-wide lg:text-3xl">
          {lang === "en"
            ? "Inquiries & Collaboration"
            : "お問い合わせ・共同研究"}
        </h2>
        <div
          className="mx-auto mb-8 h-[1px] w-[60px]"
          style={{ background: footerText, opacity: 0.2 }}
        />

        <ObfuscatedEmail
          user="hello"
          domain="tsuchiyatakahiro.com"
          className="link-underline mb-8 text-sm tracking-wider transition-colors"
          style={{ color: footerText, opacity: 0.7 }}
        />

        <div className="mb-12 flex items-center gap-8">
          <a
            href="https://www.kufs.ac.jp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.2em] uppercase transition-colors"
            style={{ color: footerText, opacity: 0.4 }}
          >
            {lang === "en"
              ? "Kyoto University of Foreign Studies"
              : "京都外国語大学"}
          </a>
          <span
            className="h-3 w-[1px]"
            style={{ background: footerText, opacity: 0.2 }}
          />
          <a
            href="https://www.linkedin.com/in/takahiro-tsuchiya-524874157/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.2em] uppercase transition-colors"
            style={{ color: footerText, opacity: 0.4 }}
          >
            LinkedIn
          </a>
        </div>

        <Image
          src="/images/logo-full.png"
          alt="TSUCHIYA TAKAHIRO"
          width={200}
          height={25}
          className={`mb-8 opacity-30 ${isDark ? "" : "invert"}`}
        />

        <p
          className="text-[9px] tracking-wider"
          style={{ color: footerText, opacity: 0.3 }}
        >
          &copy; 2026 TSUCHIYA LAB. ALL RIGHTS RESERVED.
        </p>
      </motion.div>
    </footer>
  );
}
