// sw.js

const APP_SHELL_CACHE_NAME = 'skiby-app-shell-v1';
const DYNAMIC_DATA_CACHE_NAME = 'skiby-dynamic-data-v1';

const APP_SHELL_URLS = [
    'https://torok.ing/static/windowalertreplacement.js',
    'https://torok.ing/songplayer/image/logo.png',
    'https://torok.ing/songplayer/image/logo-192.png',
    'https://torok.ing/songplayer/image/genericalbumcover.jpg',
    'https://torok.ing/songplayer/image/allsongsart.jpg',
    'https://torok.ing/songplayer/image/img7.jpg',
    'https://torok.ing/songplayer/image/img8.jpg',
    'https://torok.ing/songplayer/image/img9.jpg',
    'https://torok.ing/songplayer/image/img10.jpg',
    'https://torok.ing/songplayer/image/img11.jpg',
    'https://torok.ing/songplayer/image/img12.jpg',
    'https://torok.ing/songplayer/image/img6.jpg',
    'https://torok.ing/songplayer/icons/prev.svg',
    'https://torok.ing/songplayer/icons/play.svg',
    'https://torok.ing/songplayer/icons/pause.svg',
    'https://torok.ing/songplayer/icons/next.svg',
    'https://torok.ing/songplayer/icons/shuffle.svg',
    'https://torok.ing/songplayer/icons/repeat.svg',
    'https://torok.ing/songplayer/icons/volume.svg',
    'https://torok.ing/songplayer/icons/fullscreen.svg',
    'https://torok.ing/songplayer/icons/local.svg',
    'https://torok.ing/songplayer/icons/online.svg',
    'https://torok.ing/songplayer/icons/chevron_left.svg',
    'https://torok.ing/songplayer/icons/chevron_right.svg',
    'https://torok.ing/songplayer/icons/device.svg',
    'https://torok.ing/songplayer/icons/headphone.svg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
    'https://torok.ing/songplayer/MusicPlayernew.html',
    'https://torok.ing/songplayer/musicscript.js',
    'https://torok.ing/songplayer/miniplayer.html',
    'https://torok.ing/songplayer/skibidistylenew.css',
];

const DYNAMIC_URLS = [
    'https://torok.ing/songplayer/songs.json',
    'https://torok.ing/songplayer/playlists.json',
    'https://torok.ing/account/user/pfp/my',
    'https://torok.ing/static/NEWaccountinjection.js',
    'https://torok.ing/static/justsomeutils.js',
    'https://torok.ing/songplayer/manifest2.json',
    'https://torok.ing/auth/test',
];

// Files controlled by /songplayer/version
const VERSIONED_PLAYER_FILES = [
    'https://torok.ing/songplayer/MusicPlayernew.html',
    'https://torok.ing/songplayer/musicscript.js',
    'https://torok.ing/songplayer/miniplayer.html',
    'https://torok.ing/songplayer/skibidistylenew.css',
];

const VERSION_ENDPOINT = 'https://torok.ing/songplayer/version';

self.addEventListener('install', event => {
    console.log('[Service Worker] Install');

    event.waitUntil(
        Promise.all([
            caches.open(APP_SHELL_CACHE_NAME).then(async cache => {
                for (const url of APP_SHELL_URLS) {
                    const match = await cache.match(url);
                    if (!match) {
                        try {
                            const res = await fetch(url);
                            if (res.ok) {
                                await cache.put(url, res.clone());
                            }
                        } catch (e) {
                            console.warn('Failed to cache:', url);
                        }
                    }
                }
            }),

            caches.open(DYNAMIC_DATA_CACHE_NAME).then(async cache => {
                console.log('[Service Worker] Pre-caching Dynamic URLs');

                const urlsToPrecache = DYNAMIC_URLS.filter(url => !url.endsWith('/'));

                await Promise.all(
                    urlsToPrecache.map(async url => {
                        try {
                            const response = await fetch(url, { credentials: 'same-origin' });
                            if (response.ok) {
                                await cache.put(url, response.clone());
                            }
                        } catch (err) {
                            console.warn('[Service Worker] Failed to pre-cache:', url, err);
                        }
                    })
                );
            })
        ]).then(() => self.skipWaiting())
    );
});

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

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Special case: music player shell
    // Serve cached version immediately, but update cache in background.
    if (url.pathname === '/songplayer/MusicPlayernew.html') {
        console.log('[Service Worker] Checking for updates');
        event.respondWith(fromCache(request));
        event.waitUntil(checkAndRefreshPlayerAssets());
        return;
    }

    // Network-first for dynamic content
    if (DYNAMIC_URLS.some(path => url.pathname.startsWith(path)) || url.pathname === '/' || url.pathname === '/app') {
        event.respondWith(fetchAndCache(request));
        return;
    }

    // Cache-first for app shell
    if (APP_SHELL_URLS.includes(url.pathname) || APP_SHELL_URLS.includes(url.href)) {
        event.respondWith(fromCache(request));
        return;
    }

    // Default: network only
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});

function fromCache(request) {
    return caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
            return cachedResponse;
        }
        return fetch(request);
    });
}

function fetchAndCache(request) {
    return fetch(request).then(networkResponse => {
        const responseToCache = networkResponse.clone();
        caches.open(DYNAMIC_DATA_CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
        });
        return networkResponse;
    }).catch(() => {
        return caches.match(request);
    });
}

/**
 * Fetch /songplayer/version, compare expected sha256 values against the
 * currently cached player assets, and refresh changed files in background.
 */
async function checkAndRefreshPlayerAssets() {
    try {
        const versionResponse = await fetch(VERSION_ENDPOINT, {
            cache: 'no-store',
            credentials: 'same-origin'
        });

        if (!versionResponse.ok) {
            console.warn('[Service Worker] Version check failed:', versionResponse.status);
            return;
        }

        const versionMap = await versionResponse.json();
        const cache = await caches.open(APP_SHELL_CACHE_NAME);

        let updatedSomething = false;

        await Promise.all(
            VERSIONED_PLAYER_FILES.map(async filePath => {
                try {
                    const fileName = filePath.split('/').pop();
                    const expectedEntry = versionMap[fileName];
                    const expectedSha = expectedEntry && expectedEntry.sha256;

                    if (!expectedSha) {
                        return;
                    }

                    const cachedResponse = await cache.match(filePath);

                    // No cached file yet: fetch and store it.
                    if (!cachedResponse) {
                        const freshResponse = await fetch(filePath, {
                            cache: 'no-store',
                            credentials: 'same-origin'
                        });

                        if (!freshResponse.ok) {
                            return;
                        }

                        const freshSha = await sha256OfResponse(freshResponse.clone());
                        if (freshSha === expectedSha) {
                            await cache.put(filePath, freshResponse.clone());
                            console.log('[Service Worker] Cached missing player asset:', filePath);
                        } else {
                            console.warn('[Service Worker] Fresh asset hash mismatch for:', filePath);
                        }
                        return;
                    }

                    const cachedSha = await sha256OfResponse(cachedResponse.clone());

                    if (cachedSha !== expectedSha) {
                        const freshResponse = await fetch(filePath, {
                            cache: 'no-store',
                            credentials: 'same-origin'
                        });

                        if (!freshResponse.ok) {
                            console.warn('[Service Worker] Failed refreshing asset:', filePath);
                            return;
                        }

                        const freshSha = await sha256OfResponse(freshResponse.clone());

                        if (freshSha === expectedSha) {
                            await cache.put(filePath, freshResponse.clone());
                            updatedSomething = true;
                            console.log('[Service Worker] Updated cached asset:', filePath);
                        } else {
                            console.warn('[Service Worker] Refreshed asset hash mismatch for:', filePath);
                        }
                    }
                } catch (err) {
                    console.warn('[Service Worker] Asset refresh error for:', filePath, err);
                }
            })
        );

        if (updatedSomething) {
            await notifyClientsUpdateInstalled();
        }
    } catch (err) {
        console.warn('[Service Worker] Background player asset check failed:', err);
    }
}

/**
 * Computes SHA-256 hex for a response body.
 */
async function sha256OfResponse(response) {
    const buffer = await response.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function notifyClientsUpdateInstalled() {
    const clientsList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true
    });

    for (const client of clientsList) {
        client.postMessage({
            type: "PLAYER_ASSETS_UPDATED"
        });
    }
}