/**
 * Registers the offline service worker (`public/sw.js`).
 *
 * Production only: under `vite dev` the worker would cache Vite's module graph
 * and serve a stale graph after the next edit. The path is taken from the
 * configured base so the same build works at `/` and at any sub-path.
 *
 * Registration is best-effort — a browser without service workers, or one that
 * refuses the registration, simply loses offline support and never a working
 * page.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
      // Offline support is optional; ignore a failed registration.
    })
  })
}
