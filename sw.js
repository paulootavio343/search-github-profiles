const cacheName = 'search-github-profiles-cache';
const urlsToCache = [
    '/',
    '/index.html',
    '/site.webmanifest',
    '/assets/js/code.js',
    '/assets/css/style.css',
    '/assets/fonts/Poppins/OFL.txt',
    '/assets/fonts/Poppins/Poppins-Regular.ttf',
    '/assets/icons/about.txt',
    '/assets/icons/balance.svg',
    '/assets/icons/code.svg',
    '/assets/icons/schedule.svg',
    '/assets/icons/search.svg',
    '/assets/icons/share.svg',
    '/assets/icons/star.svg',
    '/assets/icons/visibility.svg',
];

self.addEventListener('install', event => {
    // Perform install steps
    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    // Remove old caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    // Cache and network fallback
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    )
});