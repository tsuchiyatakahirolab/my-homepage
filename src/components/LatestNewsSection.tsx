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
  outlet_en: string;
  outlet_ja: string;
  url_en: string | null;
  url_ja: string | null;
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

  const getOutlet = (item: NewsItem): string =>
    lang === "jp" ? item.outlet_ja || item.outlet_en : item.outlet_en || item.outlet_ja;

  const getUrl = (item: NewsItem): string | null =>
    lang === "jp" ? item.url_ja || item.url_en : item.url_en || item.url_ja;

  return (
    <section
      ref={ref}
      id="news"
      className="snap-section"
      style={{ background: "var(--background)" }}
    >
      <div className="mx-auto flex w-full min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-10 sm:py-24 lg:flex-row lg:items-center lg:gap-20 lg:px-12">
        {/* Left: content (reversed from Research which has left=visual) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:flex-[3]"
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
            className="mb-8 text-sm leading-relaxed lg:whitespace-nowrap"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            {lang === "en"
              ? "A selection of recent publications, media contributions, and public engagements."
              : "最近の掲載情報・メディア出演・登壇・論文発表をお知らせします。"}
          </p>

          {/* News items */}
          {loaded && items.length > 0 ? (
            <ul className="mb-8 space-y-0">
              {items.map((item, i) => {
                const outlet = getOutlet(item);
                const url = getUrl(item);
                return (
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
                    </div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      {url ? (
                        <a
                          href={url}
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
                      {outlet && (
                        <span
                          className="text-xs"
                          style={{
                            color: "var(--foreground)",
                            opacity: 0.4,
                          }}
                        >
                          — {outlet}
                        </span>
                      )}
                    </div>
                  </motion.li>
                );
              })}
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
          className="group relative mt-6 flex aspect-square w-1/2 mx-auto items-center justify-center overflow-hidden sm:w-1/2 lg:mx-0 lg:w-auto lg:mt-0 lg:aspect-auto lg:min-h-[400px] lg:flex-[2]"
          style={{ background: "var(--surface)" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 grayscale contrast-[1.1] group-hover:grayscale-0 group-hover:contrast-100"
            style={{ backgroundImage: "url(/images/bamboo.jpg)" }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
            style={{ background: "var(--overlay)" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
