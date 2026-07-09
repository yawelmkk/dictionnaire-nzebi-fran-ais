const CACHE_VERSION = "v2.0.0-nzebi";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const DATA_CACHE = `data-${CACHE_VERSION}`;

const getBaseUrl = () => {
  const scope = self.registration?.scope || "/";
  return scope.endsWith("/") ? scope : `${scope}/`;
};

const BASE_URL = getBaseUrl();

const staticFilesToCache = [
  BASE_URL,
  `${BASE_URL}index.html`,
  `${BASE_URL}robots.txt`,
  `${BASE_URL}dictionnaire.json`,
  `${BASE_URL}splash-nzebi.png`,
];

self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Caching static files");
      return cache.addAll(staticFilesToCache).catch((err) => {
        console.warn("[SW] Some static files failed to cache:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE &&
            cacheName !== DATA_CACHE
          ) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      await self.clients.claim();
      // Force all open tabs to reload so the new theme is picked up immediately
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Cache strategy for JSON data (dictionnaire.json)
  if (url.pathname.includes("dictionnaire.json")) {
    event.respondWith(cacheFirst(request, DATA_CACHE));
    return;
  }

  // Cache strategy for static assets (CSS, JS, images)
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Network first for HTML (always try fresh)
  if (url.pathname.endsWith(".html") || url.pathname.endsWith("/")) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Default: Network first, fallback to cache
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Cache first strategy: use cache, fallback to network
async function cacheFirst(request, cacheName) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      console.log("[SW] Cache hit:", request.url);
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      console.log("[SW] Cached new response:", request.url);
    }
    return response;
  } catch (error) {
    console.error("[SW] Fetch failed:", request.url, error);
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

// Network first strategy: try network, fallback to cache
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      console.log("[SW] Updated cache:", request.url);
    }
    return response;
  } catch (error) {
    console.error("[SW] Network failed:", request.url, error);
    const cached = await caches.match(request);
    if (cached) {
      console.log("[SW] Returning cached fallback:", request.url);
      return cached;
    }
    throw error;
  }
}

