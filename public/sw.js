/*
 * Mello service worker.
 *
 * The site is a static bundle, so this only has to make it load when the
 * network is slow or gone — without ever showing a stale page:
 *
 *   - navigations and the manifest: network first, the cache is only an offline
 *     fallback, so a new deploy is picked up the moment it goes live;
 *   - fingerprinted build assets (`/assets/<name>-<hash>.<ext>`): cache first,
 *     because a new build ships a new file name and the cached copy can never be
 *     out of date;
 *   - every other same-origin request: served from cache while it refreshes in
 *     the background.
 *
 * Bump VERSION when the caching rules themselves change: activate drops every
 * cache whose name does not carry the current version.
 */
const VERSION = 'v1'
const CACHE = `mello-${VERSION}`
// Resolved against this script's location, so it follows the base path.
const OFFLINE_URL = 'index.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // A failed pre-cache must not block activation: the runtime strategies
      // above still fill the cache on the first online visit.
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: 'reload' })).catch(() => {}))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate' || url.pathname.endsWith('manifest.json')) {
    event.respondWith(networkFirst(request))
    return
  }
  if (url.pathname.includes('/assets/')) {
    event.respondWith(cacheFirst(request))
    return
  }
  event.respondWith(staleWhileRevalidate(request))
})

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) await cache.put(request, response.clone())
    return response
  } catch {
    return (await cache.match(request)) || (await cache.match(OFFLINE_URL)) || Response.error()
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) await cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  const network = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)
  return cached || network
}
