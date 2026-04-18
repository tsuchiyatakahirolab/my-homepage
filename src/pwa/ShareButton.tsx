"use client";

/**
 * ShareButton — Web Share API with progressive enhancement.
 *
 * Behavior:
 *   - On supported devices (iOS Safari, Android Chrome, Edge), opens the
 *     OS-native share sheet via `navigator.share()`.
 *   - On unsupported devices (most desktop browsers), falls back to
 *     copying the URL to clipboard with a brief inline confirmation.
 *
 * Tier 2 extension: add a dropdown with explicit Twitter/X, LINE,
 * Facebook share links for desktop browsers that lack Web Share.
 */

import { useState, useCallback } from "react";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function ShareButton({
  url,
  title,
  text,
  className,
  children,
}: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");

  const handleShare = useCallback(async () => {
    const shareData = {
      url: url ?? (typeof window !== "undefined" ? window.location.href : "/"),
      title: title ?? document.title,
      text: text ?? "",
    };

    // Prefer native share sheet.
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or share failed — fall through to clipboard.
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }

    // Fallback: copy URL to clipboard.
    try {
      await navigator.clipboard.writeText(shareData.url);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [url, title, text]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className}
      aria-label="共有"
    >
      {status === "copied" ? "URL をコピーしました" : status === "error" ? "コピーに失敗" : (children ?? "共有")}
    </button>
  );
}
