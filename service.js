/**
 * @type {String} L'identifiant du fichier de cache.
 */
const CACHE_NAME = 'pwa-cache-v9';

/**
 * @type {Array} Liste des fichiers à mettre en cache.
 */
const urlsToCache = [
    '/',
    '/index.html',

    '/sources/scripts/clock.js',
    '/sources/scripts/global.js',
    '/sources/scripts/language.js',
    '/sources/scripts/library.js',
    '/sources/scripts/register.js',
    '/sources/scripts/security.js',

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
    '/assets/sounds/error.mp3'
];

/**
 * @event install Créer le fichier de cache et ajouter les fichiers.
 */
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache)));
});

/**
 * @event activate Supprime les anciens fichiers de cache.
 */
self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(cacheNames
                .filter(cache => cache !== CACHE_NAME)
                .map(cache => caches.delete(cache)));
    }));
});

/**
 * @event fetch Retourne les fichiers mis en cache ou les télécharge en ligne.
 */
self.addEventListener('fetch', event => {
    const cleanUrl = event.request.url.split(/[?#]/)[0];
    event.respondWith(caches.match(cleanUrl)
        .then(response => response || fetch(event.request)));
});