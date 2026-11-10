import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Seamless horizontal marquee.
 *
 * The track is rendered twice and translated by exactly -50% so the loop never
 * jumps. Duration is derived from the measured track width and the requested
 * speed (px/s), which keeps the pace identical to the reference regardless of
 * frame rate — a time based CSS animation, not a requestAnimationFrame loop.
 */
export default function Marquee({
  children,
  speed,
  className,
}: {
  children: ReactNode
  speed: number
  className?: string
}) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const apply = () => {
      const half = el.scrollWidth / 2
      if (!half) return
      el.style.setProperty('--marquee-duration', `${(half / speed).toFixed(3)}s`)
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [speed])

  return (
    <div className={`marquee${className ? ' ' + className : ''}`}>
      <div className="marquee-track" ref={track}>
        {children}
        <div className="marquee-clone" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
