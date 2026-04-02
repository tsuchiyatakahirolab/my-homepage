"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Theme, Lang, TimeOfDay } from "@/app/page";

interface HeroSectionProps {
  lang: Lang;
  theme: Theme;
  timeOfDay: TimeOfDay;
}

const BG_IMAGES = [
  { src: "/images/bridge-circle.png", alt: "Japanese bridge" },
  { src: "/images/architecture.jpg", alt: "Architecture" },
  { src: "/images/zen-garden.png", alt: "Zen garden" },
  { src: "/images/kyoto-street.png", alt: "Kyoto street" },
];

export default function HeroSection({ lang, theme, timeOfDay }: HeroSectionProps) {
  const isDark = theme === "black";
  const [currentIndex, setCurrentIndex] = useState(0);

  const cycleImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BG_IMAGES.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(cycleImage, 8000);
    return () => clearInterval(interval);
  }, [cycleImage]);

  const currentImage = BG_IMAGES[currentIndex];

  return (
    <section
      id="hero"
      className="snap-section relative overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      {/* Background image crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: isDark ? 0.1 : 0.15, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="video-bg"
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            fill
            className="object-cover"
            style={{ filter: "grayscale(100%) contrast(1.1)" }}
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex h-screen flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          {/* Logo */}
          <Image
            src="/images/logo-full.png"
            alt="TSUCHIYA TAKAHIRO"
            width={400}
            height={50}
            className={`mb-6 w-64 sm:w-80 lg:w-[400px] ${isDark ? "invert" : ""}`}
            priority
          />

          {/* Affiliation */}
          <p
            className="mb-8 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.5 }}
          >
            {lang === "en" ? (
              <>
                Kyoto University of Foreign Studies
                <br />
                Institute for Liberal Arts &amp; Sciences
              </>
            ) : (
              <>
                京都外国語大学
                <br />
                教養教育機構
              </>
            )}
          </p>

          {/* Divider */}
          <div className="divider mx-auto mb-8" />

          {/* Tagline */}
          <p
            className="heading-serif max-w-lg text-base leading-relaxed sm:text-lg lg:text-xl"
            style={{ color: "var(--foreground)", opacity: 0.8 }}
          >
            &ldquo;Decoding the complexities of global society
            <br className="hidden lg:inline" />
            through the lens of Intelligence.&rdquo;
          </p>
        </motion.div>

        {/* Time indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-6 text-[9px] tracking-[0.2em] uppercase"
          style={{ color: "var(--foreground)", opacity: 0.3 }}
        >
          {timeOfDay}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 right-6 flex flex-col items-center gap-2"
        >
          <span
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.3 }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="h-6 w-[1px]"
            style={{ background: "var(--foreground)", opacity: 0.2 }}
          />
        </motion.div>

        {/* Copyright */}
        <div
          className="absolute bottom-8 text-[9px] tracking-wider"
          style={{ color: "var(--foreground)", opacity: 0.3 }}
        >
          &copy; 2026 TSUCHIYA LAB. ALL RIGHTS RESERVED.
        </div>
      </div>
    </section>
  );
}
