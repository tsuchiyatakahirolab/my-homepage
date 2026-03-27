"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = document.documentElement.getAttribute("data-theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  const bg = isDark ? "#0a0a0a" : "#ffffff";
  const fg = isDark ? "#f0f0f0" : "#1a1a1a";
  const muted = isDark ? "rgba(240,240,240,0.4)" : "rgba(26,26,26,0.4)";

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: bg, color: fg }}
    >
      <Image
        src="/images/logo-full.png"
        alt="TSUCHIYA TAKAHIRO"
        width={300}
        height={38}
        className={`mb-12 w-48 sm:w-64 lg:w-[300px] ${isDark ? "invert" : ""}`}
        priority
      />

      <p
        className="mb-4 text-[10px] font-medium tracking-[0.3em] uppercase"
        style={{ color: muted }}
      >
        Page Not Found
      </p>

      <h1
        className="mb-6 text-center text-6xl font-light tracking-wider sm:text-8xl"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        404
      </h1>

      <div
        className="mx-auto mb-8 h-[1px] w-[60px]"
        style={{ background: fg, opacity: 0.2 }}
      />

      <p
        className="mb-12 max-w-sm text-center text-sm leading-relaxed"
        style={{ color: fg, opacity: 0.6 }}
      >
        The page you are looking for does not exist or has been moved.
        <br />
        お探しのページは見つかりませんでした。
      </p>

      <Link
        href="/"
        className="border px-8 py-3 text-xs font-medium tracking-[0.2em] uppercase transition-colors"
        style={{
          borderColor: fg,
          color: fg,
          background: "transparent",
        }}
      >
        Back to Home
      </Link>

      <p
        className="mt-16 text-[9px] tracking-wider"
        style={{ color: fg, opacity: 0.2 }}
      >
        &copy; 2026 TSUCHIYA LAB. ALL RIGHTS RESERVED.
      </p>
    </div>
  );
}
