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
      .then(() => self.skipWaiting()) // 🔥 activate immediately
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // 🧹 Clean old caches
      caches.keys().then(keys =>
        Promise.all(
          keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
        )
      ),
      // 🔥 Take control immediately
      self.clients.claim()
    ])
  );
});

// Fetch event: cache-then-network for ght-i.html, otherwise cache-first
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore cross-origin
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then(async cachedResponse => {

      const fetchPromise = fetch(request)
        .then(async networkResponse => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const cache = await caches.open(CACHE_NAME);

          // 🔥 Only check YOUR main HTML file
          if (url.pathname.endsWith('ght-i.html') && cachedResponse) {

            const oldETag = cachedResponse.headers.get('ETag');
            const newETag = networkResponse.headers.get('ETag');

            const oldLastMod = cachedResponse.headers.get('Last-Modified');
            const newLastMod = networkResponse.headers.get('Last-Modified');

            const changed =
              (oldETag && newETag && oldETag !== newETag) ||
              (oldLastMod && newLastMod && oldLastMod !== newLastMod);

            if (changed) {
              const clients = await self.clients.matchAll();
              clients.forEach(client =>
                client.postMessage({ type: 'UPDATE_AVAILABLE' })
              );
            }
          }

          // Always update cache
          await cache.put(request, networkResponse.clone());

          return networkResponse;
        })
        .catch(() => null);

      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('message', async event => {
  if (event.data.type === 'CHECK_FOR_UPDATE') {
    const clients = await self.clients.matchAll();

    // Force a re-fetch of the HTML
    const response = await fetch('/ght-i.html', { cache: 'no-store' });

    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match('/ght-i.html');

    if (cached) {
      const oldLastMod = cached.headers.get('Last-Modified');
      const newLastMod = response.headers.get('Last-Modified');

      if (oldLastMod !== newLastMod) {
        await cache.put('/ght-i.html', response.clone());

        clients.forEach(client =>
          client.postMessage({ type: 'UPDATE_AVAILABLE' })
        );
      }
    }
  }
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
