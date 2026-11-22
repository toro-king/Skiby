// The same worker is served at /sw.js, /app/sw.js and /songplayer/sw.js.
// Fetch current source files online; retain the last good shell for offline use.
const APP_SHELL_CACHE_NAME = 'skiby-app-shell-v6';
const DYNAMIC_DATA_CACHE_NAME = 'skiby-dynamic-data-v6';
const IS_SKIBY = /(^|\.)skiby\.app$/.test(self.location.hostname);

const APP_SHELL_URLS = [
    '/static/windowalertreplacement.js',
    '/songplayer/image/logo.png',
    '/songplayer/image/logo-192.png',
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
    '/songplayer/icons/chevron_left.svg',
    '/songplayer/icons/chevron_right.svg',
    '/songplayer/icons/device.svg',
    '/songplayer/icons/headphone.svg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
    '/songplayer/MusicPlayerhomepage.html',
    '/songplayer/MusicPlayernew.html',
    '/songplayer/musicscript.js',
    '/songplayer/miniplayer.html',
    '/songplayer/skibidistylenew.css',
    '/songplayer/manifest2.json',
    '/static/NEWaccountinjection.js',
    '/static/accountinjection.js',
    '/static/justsomeutils.js',
];

// Normalize old URLs (including ?v=5) to the same offline cache entries.
function canonicalURL(input) {
    const url = new URL(typeof input === 'string' ? input : input.url, self.location.origin);
    if (url.origin !== self.location.origin) return url.href;
    if (IS_SKIBY) {
        if (['/', '/index.html', '/landing.html', '/app/landing.html'].includes(url.pathname)) {
            url.pathname = '/songplayer/MusicPlayerhomepage.html';
        } else if (['/app', '/app/', '/app/index.html'].includes(url.pathname)) {
            url.pathname = '/songplayer/MusicPlayernew.html';
        } else if (url.pathname === '/app/accountinjection.js') {
            url.pathname = '/static/accountinjection.js';
        } else if (/^\/(?:app\/)?manifest\.json$/.test(url.pathname)) {
            url.pathname = '/songplayer/manifest2.json';
        } else if (/^\/(?:app\/)?(?:MusicPlayerhomepage\.html|MusicPlayernew\.html|musicscript\.js|skibidistylenew\.css|miniplayer\.html|manifest2\.json)$/.test(url.pathname)) {
            url.pathname = '/songplayer/' + url.pathname.split('/').pop();
        }
    }
    if (APP_SHELL_URLS.includes(url.pathname)) url.search = '';
    return url.href;
}

const SHELL_URLS = new Set(APP_SHELL_URLS.map(url => new URL(url, self.location.origin).href));
const DYNAMIC_PATHS = new Set(['/songplayer/songs.json', '/songplayer/playlists.json']);
const PLAYER_PATHS = new Set([
    '/songplayer/MusicPlayerhomepage.html',
    '/songplayer/MusicPlayernew.html',
    '/songplayer/musicscript.js',
    '/songplayer/miniplayer.html',
    '/songplayer/skibidistylenew.css',
]);
const playerClients = new Map();

function playerClientState(clientId) {
    if (!playerClients.has(clientId)) {
        playerClients.set(clientId, { ready: false, pending: false, notified: false, checked: new Set() });
    }
    return playerClients.get(clientId);
}

async function notifyPlayerUpdate(clientId) {
    const state = playerClientState(clientId);
    if (!state.ready || !state.pending || state.notified) return;
    const client = await self.clients.get(clientId);
    if (!client || !state.pending || state.notified) return;
    state.pending = false;
    state.notified = true;
    client.postMessage({ type: 'PLAYER_ASSETS_UPDATED' });
}

self.addEventListener('message', event => {
    if (event.data?.type !== 'PLAYER_CLIENT_READY' || !event.source?.id) return;
    const clientId = event.source.id;
    const state = playerClientState(clientId);
    state.ready = true;
    event.waitUntil(Promise.all([
        notifyPlayerUpdate(clientId),
        // Also check assets such as the miniplayer that aren't loaded by every page.
        ...[...PLAYER_PATHS].filter(path => !state.checked.has(path)).map(path => {
            const url = new URL(path, self.location.origin).href;
            return networkFirst(new Request(url), url, APP_SHELL_CACHE_NAME, clientId);
        })
    ]));
});

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(APP_SHELL_CACHE_NAME);
        await Promise.all(APP_SHELL_URLS.map(async path => {
            const url = new URL(path, self.location.origin).href;
            try {
                // Keep the previous contents for change detection on the next load.
                if (await cache.match(url)) return;
                const response = await fetch(url, { cache: 'no-store', credentials: 'same-origin' });
                if (response.ok && !response.redirected) await cache.put(url, response);
            } catch (error) {
                // An optional font or image must not prevent offline startup.
                console.warn('[Skiby] Unable to precache:', url, error);
            }
        }));
        await self.skipWaiting();
    })());
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        // Only remove Skiby's obsolete caches, never another application's data.
        const names = await caches.keys();
        await Promise.all(names.filter(name =>
            /^(skiby-app-shell-|skiby-dynamic-data-)/.test(name) &&
            name !== APP_SHELL_CACHE_NAME && name !== DYNAMIC_DATA_CACHE_NAME
        ).map(name => caches.delete(name)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') return;
    const key = canonicalURL(request);
    const url = new URL(request.url);
    if (SHELL_URLS.has(key)) {
        event.respondWith(networkFirst(request, key, APP_SHELL_CACHE_NAME, event.resultingClientId || event.clientId));
    } else if (url.origin === self.location.origin && DYNAMIC_PATHS.has(url.pathname)) {
        event.respondWith(networkFirst(request, key, DYNAMIC_DATA_CACHE_NAME));
    }
    // Authentication, uploads, streams and unrelated pages use the network normally.
});

async function networkFirst(request, key, cacheName, clientId) {
    if (clientId && PLAYER_PATHS.has(new URL(key).pathname)) {
        playerClientState(clientId).checked.add(new URL(key).pathname);
    }
    const cache = await caches.open(cacheName);
    let response;
    try {
        response = await fetch(request, { cache: 'no-store' });
    } catch (error) {
        const cached = await cache.match(key);
        if (cached) return cached;
        return Response.error();
    }
    // Keep the last good response on server failures. Never cache an auth redirect.
    if (response.status >= 500) return (await cache.match(key)) || response;
    if (response.ok && !response.redirected && response.type !== 'opaque') {
        try {
            const previous = clientId && PLAYER_PATHS.has(new URL(key).pathname)
                ? await cache.match(key) : null;
            const changed = previous && await previous.text() !== await response.clone().text();
            await cache.put(key, response.clone());
            if (changed) {
                playerClientState(clientId).pending = true;
                await notifyPlayerUpdate(clientId);
            }
        } catch (error) {
            console.warn('[Skiby] Unable to update offline cache:', error);
        }
    }
    return response;
}
