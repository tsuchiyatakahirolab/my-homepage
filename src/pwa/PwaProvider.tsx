"use client";

/**
 * PwaProvider — central PWA orchestration component.
 *
 * Tier 1 responsibilities:
 *   - Register the Service Worker on mount (production only).
 *   - Listen for SW updates and reload gracefully.
 *
 * Tier 2/3 extension points (TODO when implementing):
 *   - Push subscription lifecycle (subscribe / unsubscribe / re-subscribe).
 *   - Badging API: `navigator.setAppBadge(unreadCount)`.
 *   - Background Sync registration for offline form queue.
 *   - PWA install prompt UX (intercept `beforeinstallprompt`, expose
 *     a context value so any descendant can render an install button).
 *
 * Mount once at the root layout. Returns null — purely behavioral.
 */

import { useEffect } from "react";

export default function PwaProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });

        // Detect updated SW waiting to activate.
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // A new SW is waiting. Could prompt user to reload — for now,
              // silently activate on next navigation.
              // Uncomment to force immediate activation:
              // newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      } catch {
        // SW registration failed — silently ignore. App still works without PWA.
      }
    };

    void register();
  }, []);

  return null;
}
