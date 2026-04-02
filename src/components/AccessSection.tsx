"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { Theme, Lang } from "@/app/page";

interface AccessSectionProps {
  lang: Lang;
  theme: Theme;
}

export default function AccessSection({ lang, theme }: AccessSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const isDark = theme === "black";

  return (
    <section
      ref={ref}
      id="access"
      className="snap-section"
      style={{ background: "var(--background)" }}
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-12 px-6 py-24 lg:flex-row lg:gap-20 lg:px-12">
        {/* Map - centered on Kyoto University of Foreign Studies */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-xl overflow-hidden"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1634.0!2d135.71950!3d35.00350!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6001079c32af0987%3A0x2d68e94415b02860!2z5Lqs6YO95aSW5Zu96Kqe5aSn5a2m!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp"
            width="100%"
            height="400"
            style={{
              border: 0,
              filter: isDark
                ? "grayscale(100%) invert(90%) contrast(0.9)"
                : "grayscale(100%)",
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={
              lang === "en"
                ? "Kyoto University of Foreign Studies"
                : "京都外国語大学"
            }
          />
        </motion.div>

        {/* Address */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-sm"
        >
          <p
            className="mb-2 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Access" : "アクセス"}
          </p>
          <h2 className="heading-serif mb-8 text-2xl lg:text-3xl lg:whitespace-nowrap">
            {lang === "en"
              ? "Kyoto University of Foreign Studies"
              : "京都外国語大学"}
          </h2>
          <div className="divider mb-8" />
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.7 }}
          >
            {lang === "en" ? (
              <>
                6 Kasame-cho, Saiin, Ukyo-ku,
                <br />
                Kyoto, Japan
              </>
            ) : (
              <>
                〒615-8558
                <br />
                京都府京都市右京区西院笠目町6
              </>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
