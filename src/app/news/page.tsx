"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  outlet: string;
  url: string | null;
  summary: string;
}

export default function NewsArchive() {
  const [lang, setLang] = useState<"en" | "jp">("en");
  const [theme, setTheme] = useState<"white" | "black">("white");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [yearFilter, setYearFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  /* Restore persisted preferences */
  useEffect(() => {
    const saved = localStorage.getItem("tth_theme") as
      | "white"
      | "black"
      | null;
    const savedLang = localStorage.getItem("tth_lang") as
      | "en"
      | "jp"
      | null;
    if (saved) setTheme(saved);
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    const isDark = theme === "black";
    const root = document.documentElement;
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    root.style.setProperty("--background", isDark ? "#0a0a0a" : "#ffffff");
    root.style.setProperty("--foreground", isDark ? "#f0f0f0" : "#1a1a1a");
    root.style.setProperty("--accent", isDark ? "#777777" : "#888888");
    root.style.setProperty("--border", isDark ? "#2a2a2a" : "#e0e0e0");
    root.style.setProperty("--surface", isDark ? "#111111" : "#fafafa");
  }, [theme]);

  /* Fetch all news */
  useEffect(() => {
    fetch("/api/news?mode=all")
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
      .finally(() => setLoading(false));
  }, []);

  /* Derive filter options */
  const years = Array.from(
    new Set(
      items
        .map((i) => (i.date ? new Date(i.date).getFullYear() : null))
        .filter((y): y is number => y !== null)
    )
  ).sort((a, b) => b - a);

  const categories = Array.from(
    new Set(items.map((i) => i.category).filter(Boolean))
  ).sort();

  /* Apply filters */
  const filtered = items.filter((item) => {
    if (yearFilter && item.date) {
      if (new Date(item.date).getFullYear().toString() !== yearFilter)
        return false;
    }
    if (categoryFilter && item.category !== categoryFilter) return false;
    return true;
  });

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans), Arial, Helvetica, sans-serif",
      }}
    >
      {/* Minimal header */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          borderColor: "var(--border)",
          background: "var(--background)",
        }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="link-underline text-sm font-medium tracking-wide"
          >
            &larr; {lang === "en" ? "Back" : "トップに戻る"}
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const next = lang === "en" ? "jp" : "en";
                setLang(next);
                localStorage.setItem("tth_lang", next);
              }}
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              {lang === "en" ? "JP" : "EN"}
            </button>
            <button
              onClick={() => {
                const next = theme === "white" ? "black" : "white";
                setTheme(next);
                localStorage.setItem("tth_theme", next);
              }}
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: "var(--accent)" }}
            >
              {theme === "white" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="mb-2 text-[10px] font-medium tracking-[0.3em] uppercase"
            style={{ color: "var(--foreground)", opacity: 0.4 }}
          >
            {lang === "en" ? "Archive" : "アーカイブ"}
          </p>
          <h1 className="heading-serif mb-4 text-3xl lg:text-4xl">
            {lang === "en"
              ? "Media, Writing & Publications"
              : "メディア・執筆・研究"}
          </h1>
          <p
            className="mb-12 max-w-xl text-sm leading-relaxed"
            style={{ color: "var(--foreground)", opacity: 0.6 }}
          >
            {lang === "en"
              ? "A complete archive of media appearances, publications, commentaries, and talks."
              : "掲載情報・メディア出演・寄稿・論文・登壇の全記録です。"}
          </p>
        </motion.div>

        {/* Filters */}
        {!loading && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-10 flex flex-wrap gap-3"
          >
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              aria-label="Filter by year"
              className="rounded-none border-b bg-transparent px-1 py-1.5 text-xs font-medium tracking-wide outline-none"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="">
                {lang === "en" ? "All years" : "すべての年"}
              </option>
              {years.map((y) => (
                <option key={y} value={y.toString()}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className="rounded-none border-b bg-transparent px-1 py-1.5 text-xs font-medium tracking-wide outline-none"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option value="">
                {lang === "en" ? "All categories" : "すべての区分"}
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </motion.div>
        )}

        {/* List */}
        {loading ? (
          <p
            className="py-20 text-center text-sm"
            style={{ color: "var(--accent)" }}
          >
            {lang === "en" ? "Loading…" : "読み込み中…"}
          </p>
        ) : error ? (
          <p
            className="py-20 text-center text-sm"
            style={{ color: "var(--accent)" }}
          >
            {lang === "en"
              ? "Unable to load news at this time."
              : "データの読み込みに失敗しました。"}
          </p>
        ) : filtered.length === 0 ? (
          <p
            className="py-20 text-center text-sm"
            style={{ color: "var(--accent)" }}
          >
            {lang === "en"
              ? "No items match the current filters."
              : "該当するお知らせはありません。"}
          </p>
        ) : (
          <ul>
            {filtered.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * Math.min(i, 10) }}
                className="border-b py-5 first:border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <time
                    dateTime={item.date}
                    className="text-[11px] tabular-nums tracking-wide"
                    style={{ color: "var(--foreground)", opacity: 0.4 }}
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
                      style={{ color: "var(--foreground)", opacity: 0.4 }}
                    >
                      — {item.outlet}
                    </span>
                  )}
                </div>
                {item.summary && (
                  <p
                    className="mt-1 max-w-2xl text-xs leading-relaxed"
                    style={{ color: "var(--foreground)", opacity: 0.5 }}
                  >
                    {item.summary}
                  </p>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </main>

      {/* Footer */}
      <footer
        className="border-t px-6 py-8"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span
            className="text-[11px] tracking-wide"
            style={{ color: "var(--accent)" }}
          >
            &copy; {new Date().getFullYear()} TSUCHIYA Takahiro
          </span>
          <Link
            href="/"
            className="link-underline text-xs font-medium"
            style={{ color: "var(--accent)" }}
          >
            Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
