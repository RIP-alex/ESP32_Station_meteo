/**
 * Service Worker - Station Météo ESP32
 * Responsabilité : Cache des ressources statiques
 */

const CACHE_NAME = 'station-meteo-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/css/variables.css',
    '/css/base.css',
    '/css/card.css',
    '/css/weather.css',
    '/css/status.css',
    '/css/animations.css',
    '/css/responsive.css',
    '/app.js',
    '/config.js',
    '/weatherService.js',
    '/weatherDisplay.js',
    '/pwaManager.js',
    '/manifest.json'
];

// Installation : mise en cache des ressources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
            ))
            .then(() => self.clients.claim())
    );
});

// Interception : Cache First pour static, Network First pour API
self.addEventListener('fetch', event => {
    const { request } = event;
    
    // API : Network First
    if (request.url.includes('/data/live')) {
        event.respondWith(
            fetch(request)
                .catch(() => caches.match(request))
        );
        return;
    }
    
    // Static : Cache First
    event.respondWith(
        caches.match(request)
            .then(cached => cached || fetch(request))
    );
});
