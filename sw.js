// sw.js (Updated with URL lists)

// Define a name for our cache and a version.
const APP_SHELL_CACHE_NAME = 'skiby-app-shell-v1';
const DYNAMIC_DATA_CACHE_NAME = 'skiby-dynamic-data-v1';

// List all the files that make up the "app shell".
const APP_SHELL_URLS = [
    '/songplayer/MusicPlayerfull.html',
    '/songplayer/skibidistyle.css',
    '/static/windowalertreplacement.js',
    '/songplayer/image/logo.png',
    '/songplayer/image/genericalbumcover.jpg',
    '/songplayer/image/allsongsart.jpg',
    '/songplayer/image/img7.jpg',
    '/songplayer/image/img8.jpg',
    '/songplayer/image/img9.jpg',
    '/songplayer/image/img10.jpg',
    '/songplayer/image/img11.jpg',
    '/songplayer/image/img12.jpg',
    '/songplayer/image/img6.jpg',
    '/songplayer/icons/prev.svg',
    '/songplayer/icons/play.svg',
    '/songplayer/icons/pause.svg',
    '/songplayer/icons/next.svg',
    '/songplayer/icons/shuffle.svg',
    '/songplayer/icons/repeat.svg',
    '/songplayer/icons/volume.svg',
    '/songplayer/icons/fullscreen.svg',
    '/songplayer/icons/local.svg',
    '/songplayer/icons/online.svg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// --- NEW: Lists for routing ---

// List of paths for dynamic content that should use a "Network First" strategy.
const DYNAMIC_URLS = [
    '/songplayer/songs.json',
    '/songplayer/playlists.json',
    '/account/user/pfp/my',
    '/auth/test',
    '/songplayer/playlistarts/' // Using a partial match for this directory
];

// List of paths that the service worker should completely ignore.
const IGNORED_URLS = [
    '/songplayer/upload', // Critical for file upload progress to work
    '/songplayer/modify',
    '/songplayer/delete',
    '/songplayer/create',
];


// The 'install' event
self.addEventListener('install', event => {
    console.log('[Service Worker] Install');
    event.waitUntil(
        caches.open(APP_SHELL_CACHE_NAME).then(cache => {
            console.log('[Service Worker] Caching App Shell');
            return cache.addAll(APP_SHELL_URLS);
        })
    );
});

// The 'activate' event
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activate');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== APP_SHELL_CACHE_NAME && cacheName !== DYNAMIC_DATA_CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// The 'fetch' event - Now using the URL lists
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // --- UPDATED LOGIC ---

    // Strategy 0: Ignore specific URLs.
    // Check if the request path matches any in the IGNORED_URLS list.
    if (IGNORED_URLS.some(path => url.pathname.startsWith(path))) {
        return; // Do nothing, let the browser handle it.
    }

    // Strategy 1: Network-First for dynamic content.
    // Check if the request path matches any in the DYNAMIC_URLS list.
    if (DYNAMIC_URLS.some(path => url.pathname.startsWith(path))) {
        event.respondWith(fetchAndCache(request));
        return;
    }

    // Strategy 2: Cache-First for App Shell.
    // Check if the request URL is one of our core app shell assets.
    if (APP_SHELL_URLS.includes(url.pathname) || APP_SHELL_URLS.includes(url.href)) {
        event.respondWith(fromCache(request));
        return;
    }

    // Strategy 3 (Default): For anything else (like song files), just fetch from the network.
    event.respondWith(fetch(request).catch(() => {
        // This just prevents a hard browser error for un-cached resources when offline.
    }));
});


/**
 * Serves a request from the cache first. If not found, it falls back to the network.
 * @param {Request} request The request to be handled.
 * @returns {Promise<Response>}
 */
function fromCache(request) {
    return caches.match(request).then(cachedResponse => {
        // If a cached response is found, return it.
        if (cachedResponse) {
            return cachedResponse;
        }
        // Otherwise, fetch the request from the network.
        return fetch(request);
    });
}

/**
 * Fetches from the network and updates the cache. If the network fails,
 * it falls back to the cache.
 * @param {Request} request The request to be handled.
 * @returns {Promise<Response>}
 */
function fetchAndCache(request) {
    return fetch(request).then(networkResponse => {
        // Clone the response to cache it and return the original.
        const responseToCache = networkResponse.clone();
        caches.open(DYNAMIC_DATA_CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
        });
        return networkResponse;
    }).catch(() => {
        // If the network fails, try to serve from the cache as a fallback.
        return caches.match(request);
    });
}