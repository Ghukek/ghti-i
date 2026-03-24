const CACHE_NAME = 'OfflineGHT-v1';
const FILES_TO_CACHE = [
  'ght-i.html',   // the only page that changes
  'icon-192.png',
  'grkkeyboard.png'
];

// Install event: cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    )
  );
  self.clients.claim();
});

// Fetch event: cache-then-network for ght-i.html, otherwise cache-first
self.addEventListener('fetch', event => {
  const requestURL = new URL(event.request.url);

  // 🔑 Ignore cross-origin requests (Cloudflare, etc.)
  if (requestURL.origin !== self.location.origin) {
    return;
  }

  if (requestURL.pathname.endsWith('ght-i.html')) {
    // Cache-then-network: serve cached version immediately, update in background
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            }
            return networkResponse.clone();
          })
          .catch(() => null); // network failure
        return cachedResponse || fetchPromise;
      })
    );
  } else {
    // For all other assets: cache-first
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});

