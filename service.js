const CACHE_NAME = 'pwa-cache-v2';
const urlsToCache = [
    '/',
    '/index.html',

    '/sources/scripts/register.js',
    '/sources/scripts/clock.js',

    '/sources/styles/global.css',

    '/assets/fonts/DINEngschrift.ttf',

    '/assets/images/logo.ico',
    '/assets/images/rotate.png',

    '/assets/images/fr.png',
    '/assets/images/gb.png',
    '/assets/images/es.png',
    '/assets/images/de.png',
    '/assets/images/it.png',
    '/assets/images/github.png',

    '/assets/sounds/hack.mp3',
    '/assets/sounds/error.mp3',
];


self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache)));
});


self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames
                .filter(cache => cache !== CACHE_NAME)
                .map(cache => caches.delete(cache)));
    }));
});


self.addEventListener('fetch', event => {
    const cleanUrl = event.request.url.split(/[?#]/)[0];
    event.respondWith(caches.match(cleanUrl)
        .then(response => response || fetch(event.request)));
});
