const CACHE_VERSION = 'v7';
const CACHE_NAME = `quickdish-${CACHE_VERSION}`;
const CACHE_EXPIRATION_DAYS = 7;

// Helper to check if cached response is expired
function isCacheExpired(response) {
  if (!response) return true;
  const cachedDate = response.headers.get('sw-cached-date');
  if (!cachedDate) return true;
  const daysSinceCached = (Date.now() - parseInt(cachedDate)) / (1000 * 60 * 60 * 24);
  return daysSinceCached > CACHE_EXPIRATION_DAYS;
}

// Install event - activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  self.skipWaiting();
});

// Activate event - take control immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network-only strategy for API calls - never cache user data
  if (url.pathname.includes('/functions/') || 
      url.pathname.includes('/rest/') || 
      url.pathname.includes('/auth/') ||
      url.pathname.includes('/realtime/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Network-first strategy for scripts to avoid caching issues
  if (request.destination === 'script') {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first strategy for images and static assets with expiration
  if (request.destination === 'image' || 
      request.destination === 'style' ||
      request.destination === 'font') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse && !isCacheExpired(cachedResponse)) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            if (response.ok && request.method === 'GET') {
              const responseClone = response.clone();
              const headers = new Headers(response.headers);
              headers.append('sw-cached-date', Date.now().toString());
              const modifiedResponse = new Response(responseClone.body, {
                status: response.status,
                statusText: response.statusText,
                headers
              });
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, modifiedResponse);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // Network-first for navigations and everything else to avoid grey screens
  event.respondWith(
    (request.mode === 'navigate' ? fetch(request) : fetch(request))
      .then((response) => {
        // Only cache GET requests
        if (response.ok && request.method === 'GET') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
