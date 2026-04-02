"use client";

import { useState, useEffect, useCallback } from "react";

const SECTIONS = [
  "hero",
  "profile",
  "expertise",
  "news",
  "research",
  "lecture",
  "video",
  "access",
  "contact",
];

export default function ScrollIndicator() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const container = document.querySelector(".snap-container");
    if (!container) return;

    const scrollTop = container.scrollTop;
    const viewportHeight = window.innerHeight;

    let closest = 0;
    let minDistance = Infinity;

    SECTIONS.forEach((id, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const distance = Math.abs(el.offsetTop - scrollTop);
      if (distance < minDistance) {
        minDistance = distance;
        closest = i;
      }
    });

    // Also check if we're near the bottom (footer)
    if (
      scrollTop + viewportHeight >=
      container.scrollHeight - viewportHeight * 0.3
    ) {
      closest = SECTIONS.length - 1;
    }

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const container = document.querySelector(".snap-container");
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollTo = (index: number) => {
    const el = document.getElementById(SECTIONS[index]);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex">
      {SECTIONS.map((_, i) => (
        <button
          key={i}
          onClick={() => scrollTo(i)}
          aria-label={`Go to section ${i + 1}`}
          className="group flex h-4 w-4 items-center justify-center"
        >
          <span
            className="block rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? 8 : 5,
              height: i === activeIndex ? 8 : 5,
              background:
                i === activeIndex
                  ? "var(--foreground)"
                  : "var(--foreground)",
              opacity: i === activeIndex ? 0.8 : 0.25,
            }}
          />
        </button>
      ))}
    </div>
  );
}
