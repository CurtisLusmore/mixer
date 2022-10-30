const cacheName = 'mixer-v1';
const contentToCache = [
  'index.html',
  'app.js',
  'style.css',
  'favicon.png',
  'audio/bird.mp3',
  'audio/cricket.mp3',
  'audio/fire.mp3',
  'audio/heartbeat.mp3',
  'audio/lullaby.mp3',
  'audio/rain.mp3',
  'audio/river.mp3',
  'audio/shh.mp3',
  'audio/thunder.mp3',
  'audio/wave.mp3',
  'audio/whitenoise.mp3'
];

self.addEventListener('install', function (event) {
  console.log('[Service Worker] Install');
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: content');
    await cache.addAll(contentToCache);
  })());
});

self.addEventListener('fetch', function (event) {
  event.respondWith((async function () {
    const r = await caches.match(event.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(event.request);
    const cache = await caches.open(cacheName);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(event.request, response.clone());
    return response;
  })());
});