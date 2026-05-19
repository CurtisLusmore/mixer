const CACHE_NAME = 'mixer-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './style.css',
  './favicon.png',
  './mixer.webmanifest',
  './audio/bird.mp3',
  './audio/cricket.mp3',
  './audio/fire.mp3',
  './audio/heartbeat.mp3',
  './audio/lullaby.mp3',
  './audio/rain.mp3',
  './audio/river.mp3',
  './audio/shh.mp3',
  './audio/thunder.mp3',
  './audio/wave.mp3',
  './audio/whitenoise.mp3',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
