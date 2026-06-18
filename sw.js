const CACHE_NAME = 'greenpoint-v1';
const ASSETS = [
  '/greenpoint/',
  '/greenpoint/index.html',
  '/greenpoint/manifest.json',
  '/greenpoint/css/style.css',
  '/greenpoint/js/app.js',
  '/greenpoint/icons/icon-72x72.png',
  '/greenpoint/icons/icon-96x96.png',
  '/greenpoint/icons/icon-128x128.png',
  '/greenpoint/icons/icon-144x144.png',
  '/greenpoint/icons/icon-152x152.png',
  '/greenpoint/icons/icon-192x192.png',
  '/greenpoint/icons/icon-384x384.png',
  '/greenpoint/icons/icon-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(response => {
        if (e.request.url.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match('/greenpoint/index.html'))
    )
  );
});
