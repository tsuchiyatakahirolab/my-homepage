"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import type { Theme, Lang } from "@/app/page";

interface LatestNewsSectionProps {
  lang: Lang;
  theme: Theme;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  outlet: string;
  url: string | null;
  summary: string;
}

export default function LatestNewsSection({
  lang,
  theme,
}: LatestNewsSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/news?mode=home")
      .then(async (res) => {
        const json = (await res.json()) as {
          success: boolean;
          data: NewsItem[];
        };
        if (json.success && Array.isArray(json.data)) {
          setItems(json.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoaded(true));
  }, []);

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section
      ref={ref}
      id="news"
      className="snap-section"
      style={{ background: "var(--background)" }}
    >
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16 sm:py-24 lg:flex-row lg:items-center lg:gap-20 lg:px-12">
        {/* Left: content (reversed from Research which has left=visual) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          <p
            className="mb-2 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Updates" : "お知らせ"}
          </p>
          <h2 className="heading-serif mb-4 text-2xl lg:text-3xl">
            Latest News
          </h2>
          <p
            className="mb-8 text-sm leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            {lang === "en"
              ? "A selection of recent publications, media contributions, and public engagements."
              : "最近の掲載情報・メディア出演・登壇・論文発表をお知らせします。"}
          </p>

          {/* News items */}
          {loaded && items.length > 0 ? (
            <ul className="mb-8 space-y-0">
              {items.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={
                    isInView
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -20 }
                  }
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="border-b py-4 first:border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <time
                      dateTime={item.date}
                      className="text-[11px] tabular-nums tracking-wide"
                      style={{
                        color: "var(--foreground)",
                        opacity: 0.4,
                      }}
                    >
                      {formatDate(item.date)}
                    </time>
                    {item.category && (
                      <span
                        className="rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-[0.15em] uppercase"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--foreground)",
                          opacity: 0.5,
                        }}
                      >
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-sm font-medium leading-relaxed"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <span className="text-sm font-medium leading-relaxed">
                        {item.title}
                      </span>
                    )}
                    {item.outlet && (
                      <span
                        className="text-xs"
                        style={{
                          color: "var(--foreground)",
                          opacity: 0.4,
                        }}
                      >
                        — {item.outlet}
                      </span>
                    )}
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : loaded && error ? (
            <p
              className="mb-8 text-xs"
              style={{ color: "var(--foreground)", opacity: 0.4 }}
            >
              {lang === "en"
                ? "Unable to load news at this time."
                : "ニュースの読み込みに失敗しました。"}
            </p>
          ) : loaded ? (
            <p
              className="mb-8 text-xs"
              style={{ color: "var(--foreground)", opacity: 0.4 }}
            >
              {lang === "en"
                ? "No news items available."
                : "お知らせはありません。"}
            </p>
          ) : null}

          <Link
            href="/news"
            className="link-underline text-sm font-medium tracking-wide"
          >
            {lang === "en" ? "View all updates" : "すべてのお知らせを見る"}{" "}
            &rarr;
          </Link>
        </motion.div>

        {/* Right: decorative visual (mirrored from Research) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mt-12 flex aspect-[4/3] w-full max-w-xs items-center justify-center overflow-hidden sm:aspect-square sm:max-w-md lg:mt-0"
          style={{ background: "var(--surface)" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: "url(/images/gallery.png)",
              filter: "grayscale(100%)",
            }}
          />
          <p
            className="heading-serif relative z-10 text-center text-3xl leading-tight lg:text-4xl"
            style={{ color: "var(--foreground)", opacity: 0.2 }}
          >
            {lang === "en" ? (
              <>
                Latest
                <br />
                News
              </>
            ) : (
              <>
                最新
                <br />
                情報
              </>
            )}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
