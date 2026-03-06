// Service Worker for offline support and caching
/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const DATA_CACHE = `data-${CACHE_VERSION}`;

// Files to cache on install
const staticFilesToCache = [
  '/',
  '/index.html',
  '/robots.txt',
];

// Install event - cache static assets
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static files');
      return cache.addAll(staticFilesToCache).catch((err) => {
        console.warn('[SW] Some static files failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== DATA_CACHE) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // Don't cache non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Cache strategy for JSON data (dictionnaire.json)
  if (url.pathname.includes('dictionnaire.json')) {
    event.respondWith(cacheFirst(request, DATA_CACHE));
    return;
  }

  // Cache strategy for static assets (CSS, JS, images)
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Network first for HTML (always try fresh)
  if (url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Default: Network first, fallback to cache
  event.respondWith(networkFirst(request, DYNAMIC_CACHE));
});

// Cache first strategy: use cache, fallback to network
async function cacheFirst(request: Request, cacheName: string): Promise<Response> {
  try {
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Cache hit:', request.url);
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      console.log('[SW] Cached new response:', request.url);
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', request.url, error);
    // Return offline page or cached response
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
}

// Network first strategy: try network, fallback to cache
async function networkFirst(request: Request, cacheName: string): Promise<Response> {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      console.log('[SW] Updated cache:', request.url);
    }
    return response;
  } catch (error) {
    console.error('[SW] Network failed:', request.url, error);
    const cached = await caches.match(request);
    if (cached) {
      console.log('[SW] Returning cached fallback:', request.url);
      return cached;
    }
    throw error;
  }
}

export {};
