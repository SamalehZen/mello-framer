import { useEffect, useRef, useState } from 'react'

/** Returns true when the user asked the OS to minimise motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

type RevealOptions = {
  /** IntersectionObserver threshold. Defaults to 0. */
  threshold?: number
  /** IntersectionObserver root margin. Defaults to '0px'. */
  rootMargin?: string
}

/**
 * Reveals an element once when it scrolls into view.
 *
 * When the user prefers reduced motion the element starts revealed, so the
 * one-shot entrance animation is skipped without a state update inside an
 * effect. Consumers only need to toggle an `is-in` class on the returned flag.
 */
export function useReveal<T extends HTMLElement>({
  threshold = 0,
  rootMargin = '0px',
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null)
  const [shown, setShown] = useState(prefersReducedMotion)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown, threshold, rootMargin])

  return [ref, shown] as const
}
