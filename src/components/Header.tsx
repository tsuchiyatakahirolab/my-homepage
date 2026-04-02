"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Theme, Lang } from "@/app/page";

const NAV_ITEMS_EN = [
  { label: "Profile", href: "#profile" },
  { label: "Expertise", href: "#expertise" },
  { label: "Research", href: "#research" },
  { label: "News", href: "#news" },
  { label: "Lecture", href: "#lecture" },
  { label: "Access", href: "#access" },
  { label: "Contact", href: "#contact" },
];

const NAV_ITEMS_JP = [
  { label: "プロフィール", href: "#profile" },
  { label: "専門分野", href: "#expertise" },
  { label: "研究", href: "#research" },
  { label: "ニュース", href: "#news" },
  { label: "講義", href: "#lecture" },
  { label: "アクセス", href: "#access" },
  { label: "お問い合わせ", href: "#contact" },
];

interface HeaderProps {
  lang: Lang;
  theme: Theme;
  onToggleLang: () => void;
  onToggleTheme: () => void;
}

export default function Header({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === "black";
  const navItems = lang === "en" ? NAV_ITEMS_EN : NAV_ITEMS_JP;

  useEffect(() => {
    const container = document.querySelector(".snap-container");
    if (!container) return;

    const handleScroll = () => {
      setScrolled(container.scrollTop > 80);
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const headerBg = scrolled
    ? isDark
      ? "bg-[#0a0a0a] shadow-[0_1px_0_rgba(255,255,255,0.05)]"
      : "bg-white shadow-[0_1px_0_rgba(0,0,0,0.05)]"
    : "bg-transparent";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Logo - hidden on hero (not scrolled) */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#hero");
          }}
          className={`flex items-center gap-3 transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src="/images/logo-mark.jpg"
            alt="Tsuchiya Takahiro"
            width={28}
            height={28}
            className={isDark ? "invert" : ""}
          />
          <span className="hidden text-sm font-medium tracking-[0.15em] uppercase sm:inline">
            Tsuchiya Takahiro
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="link-underline text-xs font-medium tracking-[0.1em] uppercase transition-colors"
              style={{ color: "var(--foreground)", opacity: 0.7 }}
            >
              {item.label}
            </button>
          ))}

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="ml-2 flex h-7 w-7 items-center justify-center rounded-full border transition-colors"
            style={{ borderColor: "var(--border)" }}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Language toggle */}
          <button
            onClick={onToggleLang}
            className="rounded-full border px-3 py-1 text-[10px] font-medium tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
            style={{ borderColor: "var(--border)" }}
          >
            {lang === "en" ? "JP" : "EN"}
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="block h-[1px] w-5"
            style={{ background: "var(--foreground)" }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block h-[1px] w-5"
            style={{ background: "var(--foreground)" }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="block h-[1px] w-5"
            style={{ background: "var(--foreground)" }}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ background: "var(--background)" }}
          >
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  onClick={() => scrollTo(item.href)}
                  className="heading-serif text-2xl tracking-wider"
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="mt-4 flex items-center gap-4">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    onToggleTheme();
                  }}
                  className="rounded-full border px-4 py-2 text-xs tracking-wider uppercase"
                  style={{ borderColor: "var(--border)" }}
                >
                  {isDark ? "White" : "Black"}
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  onClick={() => {
                    onToggleLang();
                  }}
                  className="rounded-full border px-4 py-2 text-xs tracking-wider uppercase"
                  style={{ borderColor: "var(--border)" }}
                >
                  {lang === "en" ? "日本語" : "English"}
                </motion.button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
