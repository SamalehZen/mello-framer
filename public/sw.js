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
 * cache in our own namespace that does not carry the current version.
 */
const VERSION = 'v1'
const CACHE_PREFIX = 'mello-'
const CACHE = `${CACHE_PREFIX}${VERSION}`
// Resolved against this script's location, so it follows the base path.
const OFFLINE_URL = 'index.html'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // A failed pre-cache rejects the install: the previous worker and its
      // cache stay in place, so an interrupted update never drops offline
      // support. The worker is retried on the next visit.
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: 'reload' })))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          // CacheStorage is shared by the whole origin, so only our own
          // namespace is touched — never another app's caches.
          keys
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
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

  // stale-while-revalidate. Both promises are registered synchronously, on the
  // event, so the worker is kept alive until the background refresh — and its
  // cache write — have finished.
  const refresh = revalidate(request)
  event.waitUntil(refresh.catch(() => {}))
  event.respondWith(fromCacheOr(request, refresh))
})

async function fromCacheOr(request, refresh) {
  const cache = await caches.open(CACHE)
  const cached = await cache.match(request)
  if (cached) return cached
  try {
    return await refresh
  } catch {
    return Response.error()
  }
}

async function revalidate(request) {
  const cache = await caches.open(CACHE)
  const response = await fetch(request)
  if (response.ok) await cachePut(cache, request, response.clone())
  return response
}

/**
 * Writes to the cache without letting a storage failure (quota, a response that
 * cannot be stored) discard the network copy the caller is about to return.
 */
async function cachePut(cache, request, response) {
  try {
    await cache.put(request, response)
  } catch {
    // Keep the fetched response; the entry simply is not cached.
  }
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE)
  try {
    const response = await fetch(request)
    if (response.ok) await cachePut(cache, request, response.clone())
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
  if (response.ok) await cachePut(cache, request, response.clone())
  return response
}
