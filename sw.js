const CACHE_NAME = 'greenpoint-v1';
const ASSETS = [
  '/greenpoint-web/',
  '/greenpoint-web/index.html',
  '/greenpoint-web/manifest.json',
  '/greenpoint-web/css/style.css',
  '/greenpoint-web/js/app.js',
  '/greenpoint-web/icons/icon-72x72.png',
  '/greenpoint-web/icons/icon-96x96.png',
  '/greenpoint-web/icons/icon-128x128.png',
  '/greenpoint-web/icons/icon-144x144.png',
  '/greenpoint-web/icons/icon-152x152.png',
  '/greenpoint-web/icons/icon-192x192.png',
  '/greenpoint-web/icons/icon-384x384.png',
  '/greenpoint-web/icons/icon-512x512.png'
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
      }).catch(() => caches.match('/greenpoint-web/index.html'))
    )
  );
});
