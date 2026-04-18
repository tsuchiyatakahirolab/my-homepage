/**
 * Service Worker — tsuchiyatakahiro.com
 *
 * Tier 1 implementation:
 *   - Pre-cache critical static assets (install)
 *   - Network-first for HTML navigations (always try fresh, fall back to cache)
 *   - Cache-first for static assets (immutable hashed Next.js assets)
 *   - Offline fallback page for navigations that fail with no cache hit
 *
 * Designed to be extended for Tier 2/3:
 *   - Push notifications: add `self.addEventListener('push', ...)` and
 *     `notificationclick` handlers below.
 *   - Background Sync: add `self.addEventListener('sync', ...)` to drain
 *     a queue stored in IndexedDB (for offline contact-form submissions).
 *   - Periodic Background Sync: `periodicsync` event for background news
 *     polling.
 *   - Badging API: read unread counts from IndexedDB and call
 *     `self.registration.showNotification` / `navigator.setAppBadge`.
 *
 * Cache versioning: bump CACHE_VERSION whenever cache schema changes.
 * Old caches are deleted on `activate`.
 */

const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const HTML_CACHE = `html-${CACHE_VERSION}`;

// Critical assets pre-cached at install. Keep this list small and stable —
// hashed Next.js chunks should NOT be here (they change every deploy).
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/favicon.ico",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/apple-icon.png",
  "/manifest.webmanifest",
];

const ALL_CACHES = [STATIC_CACHE, RUNTIME_CACHE, HTML_CACHE];

// ───────────────────────────────────────────────────────────
// Lifecycle
// ───────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      // addAll is atomic — if any URL fails, none are cached. Use Promise.allSettled
      // for resilience (a missing file won't block install).
      await Promise.allSettled(
        PRECACHE_URLS.map((url) =>
          fetch(url, { cache: "reload" })
            .then((res) => (res.ok ? cache.put(url, res) : null))
            .catch(() => null)
        )
      );
      // Take over from old SW immediately rather than waiting for all tabs to close.
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !ALL_CACHES.includes(k)).map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

// ───────────────────────────────────────────────────────────
// Fetch — request routing
// ───────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass non-GET, cross-origin, and chrome-extension requests.
  if (req.method !== "GET") return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/_next/data/")) return;

  // API routes: never cache (responses may contain personal/dynamic data).
  if (url.pathname.startsWith("/api/")) return;

  // HTML navigations: network-first.
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req));
    return;
  }

  // Hashed Next.js assets: cache-first (immutable).
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // Images, fonts, other static assets: stale-while-revalidate.
  const dest = req.destination;
  if (["image", "font", "style", "script"].includes(dest)) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
    return;
  }

  // Default: network with cache fallback.
  event.respondWith(networkFirst(req));
});

// ───────────────────────────────────────────────────────────
// Cache strategies
// ───────────────────────────────────────────────────────────

async function networkFirst(req) {
  const cache = await caches.open(HTML_CACHE);
  try {
    const fresh = await fetch(req);
    if (fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    // Last-resort offline fallback for navigations.
    if (req.mode === "navigate") {
      const offline = await caches.match("/offline");
      if (offline) return offline;
    }
    throw err;
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  const fresh = await fetch(req);
  if (fresh.ok) cache.put(req, fresh.clone());
  return fresh;
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const networkPromise = fetch(req)
    .then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || networkPromise;
}

// ───────────────────────────────────────────────────────────
// Tier 2/3 extension hooks (commented out; uncomment when implementing)
// ───────────────────────────────────────────────────────────

// self.addEventListener("push", (event) => {
//   const data = event.data?.json() ?? {};
//   event.waitUntil(
//     self.registration.showNotification(data.title ?? "土屋貴裕", {
//       body: data.body,
//       icon: "/android-chrome-192x192.png",
//       badge: "/favicon-32x32.png",
//       data: { url: data.url ?? "/" },
//     })
//   );
// });
//
// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();
//   event.waitUntil(self.clients.openWindow(event.notification.data?.url ?? "/"));
// });
//
// self.addEventListener("sync", (event) => {
//   if (event.tag === "contact-form-queue") {
//     event.waitUntil(drainContactQueue());
//   }
// });
