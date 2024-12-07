const CACHE_NAME = 'pwa-cache-v1';
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
    event.waitUntil(caches.open(CACHE_NAME).then(cache => {
        console.log('Caching app shell...');
        return cache.addAll(urlsToCache).catch(err => {
            console.error('Error caching files:', err);
        });
    }));
});


self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames.map(cache => {
            if (cache !== CACHE_NAME) {
                console.log('Deleting old cache:', cache);
                return caches.delete(cache);
            }
        }));
    }));
});


self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);
    requestUrl.search = '';
    event.respondWith(caches.match(requestUrl).then(response => {
        return response || fetch(event.request);
    }));
});
