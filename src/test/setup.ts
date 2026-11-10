import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Unmount anything rendered by a test so queries never match stale nodes.
afterEach(cleanup)

// jsdom implements neither matchMedia nor the observer APIs the UI relies on.
// Provide inert defaults so components mount; individual tests replace the
// ones they need to drive.
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList
  }

  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver
  }

  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class {
      readonly root = null
      readonly rootMargin = '0px'
      readonly thresholds = [0]
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    } as unknown as typeof IntersectionObserver
  }
}
