/**
 * Minimal, dependency-free error reporting.
 *
 * Nothing leaves the browser unless `VITE_REPORT_ENDPOINT` is defined at build
 * time, so the site stays a fully static page with zero third-party requests by
 * default. Point it at any collector that accepts a JSON POST — a serverless
 * function, a Sentry tunnel route, an OTLP gateway — to start receiving reports.
 */
export type Report = {
  kind: 'error' | 'rejection'
  message: string
  stack?: string
  source?: string
}

const endpoint: string | undefined = import.meta.env.VITE_REPORT_ENDPOINT

export function report(payload: Report): void {
  if (!endpoint) {
    if (import.meta.env.DEV) console.warn('[report]', payload)
    return
  }

  const body = JSON.stringify({ ...payload, url: location.href, at: new Date().toISOString() })

  // `sendBeacon` survives page unloads, which is exactly when late errors land.
  if (navigator.sendBeacon(endpoint, body)) return

  void fetch(endpoint, {
    method: 'POST',
    body,
    keepalive: true,
    headers: { 'Content-Type': 'application/json' },
  }).catch(() => {
    // Reporting must never break the page.
  })
}

/** Forwards uncaught errors and unhandled promise rejections to `report`. */
export function installGlobalHandlers(): void {
  window.addEventListener('error', (event) => {
    report({
      kind: 'error',
      message: event.message,
      stack: event.error?.stack,
      source: event.filename,
    })
  })

  window.addEventListener('unhandledrejection', (event) => {
    const reason: unknown = event.reason
    const error = reason instanceof Error ? reason : undefined
    report({
      kind: 'rejection',
      message: error?.message ?? String(reason),
      stack: error?.stack,
    })
  })
}
