import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import spotImg from '@/assets/img/atmosphere/spot.avif'
import iconCatch from '@/assets/img/atmosphere/icon-catch.svg?raw'
import iconCounter from '@/assets/img/atmosphere/icon-counter.svg?raw'
import iconHide from '@/assets/img/atmosphere/icon-hide.svg?raw'
import iconCrew from '@/assets/img/atmosphere/icon-crew.svg?raw'
import { prefersReducedMotion, useReveal } from '@/hooks/useReveal'

const dataMask = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

const ICONS = [dataMask(iconCatch), dataMask(iconCounter), dataMask(iconHide), dataMask(iconCrew)]

// Hotspot anchors are percentages of the Spot Image area, measured per
// breakpoint and per active spot (desktop / tablet / mobile).
type Pos = [number, number]

const SPOTS: {
  title: string
  text: string
  tags: [string, string]
  rot: string
  leftD: string
  leftM: string
  posD: Pos[]
  posT: Pos[]
  posM: Pos[]
}[] = [
  {
    title: 'Catch the sun',
    text: 'Grab a warm seat, order your favorite, and let the morning take its time.',
    tags: ['#beforenoon', '#sunnyspot'],
    rot: '2deg',
    leftD: '-10px',
    leftM: '-10px',
    posD: [
      [16, 85],
      [58, 72],
      [11, 61],
      [32, 46],
    ],
    posT: [
      [16, 85],
      [59, 72],
      [17, 60],
      [34, 46],
    ],
    posM: [
      [16, 83],
      [61, 76],
      [10, 51],
      [36, 39],
    ],
  },
  {
    title: 'Close to the\u00A0action',
    text: 'Take a counter seat and see every drink come together from start to finish.',
    tags: ['#Social', '#Lively'],
    rot: '-1deg',
    leftD: '-80px',
    leftM: '-40px',
    posD: [
      [10, 86],
      [49, 73],
      [4, 63],
      [23, 47],
    ],
    posT: [
      [10, 88],
      [48, 73],
      [7, 62],
      [23, 47],
    ],
    posM: [
      [9, 89],
      [53, 76],
      [8, 58],
      [26, 41],
    ],
  },
  {
    title: 'Hide out here',
    text: 'Your tucked-away spot for quiet sips, focused work, and slower moments.',
    tags: ['#1seat', '#laptopfriendly'],
    rot: '-3deg',
    leftD: '-20px',
    leftM: '-5px',
    posD: [
      [17, 88],
      [58, 72],
      [11, 66],
      [31, 48],
    ],
    posT: [
      [20, 90],
      [58, 72],
      [16, 64],
      [33, 47],
    ],
    posM: [
      [18, 87],
      [62, 75],
      [11, 60],
      [38, 42],
    ],
  },
  {
    title: 'Bring the whole\u00A0crew',
    text: 'Grab the big table and fill it with coffee, stories, and your favorite people.',
    tags: ['#Social', '#Spacious'],
    rot: '0deg',
    leftD: '-30px',
    leftM: '-25px',
    posD: [
      [16, 85],
      [56, 72],
      [9, 63],
      [30, 46],
    ],
    posT: [
      [18, 87],
      [56, 73],
      [14, 61],
      [31, 46],
    ],
    posM: [
      [14, 87],
      [55, 77],
      [8, 59],
      [31, 43],
    ],
  },
]

const TITLE_WORDS = ['Pull', 'up', 'a', 'chair.', 'You’re', 'staying']

// Spring easing for the spot content swap, sampled from the source site:
// a short hold, then a 0.96-damped spring settling in ~0.45s.
const SWAP_EASE =
  'linear(0, 0 2.5%, 0 5%, 0 7.5%, 0 10%, 0.0195 12.5%, 0.0947 15%, 0.1984 17.5%, 0.3109 20%, 0.4208 22.5%, 0.5216 25%, 0.6107 27.5%, 0.687 30%, 0.751 32.5%, 0.8038 35%, 0.8466 37.5%, 0.8811 40%, 0.9085 42.5%, 0.93 45%, 0.9468 47.5%, 0.9599 50%, 0.9699 52.5%, 0.9776 55%, 0.9834 57.5%, 0.9878 60%, 0.9911 62.5%, 0.9935 65%, 0.9953 67.5%, 0.9967 70%, 0.9976 72.5%, 0.9983 75%, 0.9988 77.5%, 0.9992 80%, 0.9995 82.5%, 0.9996 85%, 0.9998 87.5%, 0.9999 90%, 0.9999 92.5%, 1 95%, 1 97.5%, 1 100%)'
const SWAP_DURATION = 540

export default function Atmosphere() {
  const [active, setActive] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [headingRef, headingIn] = useReveal<HTMLDivElement>()
  const [paraRef, paraIn] = useReveal<HTMLDivElement>()
  const [cardRef, cardIn] = useReveal<HTMLDivElement>()

  const iconRef = useRef<HTMLSpanElement | null>(null)
  const h3Ref = useRef<HTMLHeadingElement | null>(null)
  const descRef = useRef<HTMLParagraphElement | null>(null)
  const countRef = useRef<HTMLSpanElement | null>(null)
  const tagRefs = useRef<Array<HTMLSpanElement | null>>([])
  const pendingSwap = useRef<Record<string, DOMRect> | null>(null)

  // Snapshot the positions of the animated leaves so they can be folded back
  // to the previous spot right after the content swaps, then spring into
  // place (Framer-style layout projection: positions animate, glyph sizes do
  // not change).
  const captureLayout = () => {
    if (prefersReducedMotion()) return
    const rects: Record<string, DOMRect> = {}
    const put = (key: string, el: Element | null) => {
      if (el) rects[key] = el.getBoundingClientRect()
    }
    put('count', countRef.current)
    put('icon', iconRef.current)
    put('h3', h3Ref.current)
    put('desc', descRef.current)
    tagRefs.current.forEach((el, i) => put(`tag${i}`, el))
    pendingSwap.current = rects
  }

  // Selecting another spot restarts the 5s autoplay. Re-clicking the already
  // active spot does not reset it (matches the source).
  const select = (i: number) => {
    if (i === active) return
    captureLayout()
    setActive(i)
    setCycle((c) => c + 1)
  }

  useLayoutEffect(() => {
    const prev = pendingSwap.current
    pendingSwap.current = null
    if (!prev || prefersReducedMotion()) return
    const animate = (key: string, el: Element | null) => {
      const from = prev[key]
      if (!el || !from) return
      const now = el.getBoundingClientRect()
      const dx = from.left - now.left
      const dy = from.top - now.top
      if (Math.abs(dx) < 0.25 && Math.abs(dy) < 0.25) return
      el.getAnimations().forEach((a) => {
        if (a.id === 'atmo-swap') a.cancel()
      })
      const frames = [
        { transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)` },
        { transform: 'none' },
      ]
      const options = { duration: SWAP_DURATION, fill: 'none' as const }
      let anim: Animation
      try {
        anim = el.animate(frames, { ...options, easing: SWAP_EASE })
      } catch {
        anim = el.animate(frames, { ...options, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' })
      }
      anim.id = 'atmo-swap'
    }
    animate('count', countRef.current)
    animate('icon', iconRef.current)
    animate('h3', h3Ref.current)
    animate('desc', descRef.current)
    tagRefs.current.forEach((el, i) => animate(`tag${i}`, el))
  }, [active])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const t = window.setTimeout(() => {
      captureLayout()
      setActive((a) => (a + 1) % SPOTS.length)
    }, 5000)
    return () => window.clearTimeout(t)
  }, [active, cycle])

  const spot = SPOTS[active]

  return (
    <section className="atmo" id="place">
      <div className="atmo-content">
        <div className={`atmo-heading${headingIn ? ' is-in' : ''}`} ref={headingRef}>
          <div className="atmo-labelh2">
            <div className="atmo-label">
              <span className="atmo-dot" aria-hidden="true" />
              <p className="atmo-label-text">Take a seat</p>
            </div>
            <div className="atmo-titlewrap">
              <h2 className="atmo-title">
                {TITLE_WORDS.map((w, i) => (
                  <Fragment key={w + i}>
                    {i > 0 ? ' ' : null}
                    <span className="w" style={{ '--i': i } as CSSProperties}>
                      {w}
                    </span>
                  </Fragment>
                ))}
              </h2>
            </div>
          </div>
          <div className={`atmo-textwrap${paraIn ? ' is-in' : ''}`} ref={paraRef}>
            <p className="atmo-para">Come for something good and stay as long as you like.</p>
          </div>
        </div>

        <div className={`atmo-card${cardIn ? ' is-in' : ''}`} ref={cardRef}>
          <div className="atmo-image">
            <div
              className="atmo-photo"
              style={
                {
                  '--rot': spot.rot,
                  '--left-d': spot.leftD,
                  '--left-m': spot.leftM,
                } as CSSProperties
              }
            >
              <img
                src={spotImg}
                srcSet={`${spotImg} 1024w`}
                sizes="(min-width: 1200px) calc(max(min(100vw - 128px, 1200px) / 3, 1px) * 2 + 110px), (min-width: 768px) and (max-width: 1199.98px) calc(min(100vw - 128px, 1200px) + 110px), (max-width: 767.98px) calc(min(100vw - 64px, 1200px) + 50px)"
                alt="Inside the Mello coffee shop"
                width={1024}
                height={640}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            </div>
            {SPOTS.map((s, i) => {
              const d = spot.posD[i]
              const t = spot.posT[i]
              const m = spot.posM[i]
              return (
                <button
                  type="button"
                  key={i}
                  className={`atmo-hot${active === i ? ' is-active' : ''}`}
                  style={
                    {
                      '--x-d': `${d[0]}%`,
                      '--y-d': `${d[1]}%`,
                      '--x-t': `${t[0]}%`,
                      '--y-t': `${t[1]}%`,
                      '--x-m': `${m[0]}%`,
                      '--y-m': `${m[1]}%`,
                      '--hot-delay': `${0.5 + i * 0.1}s`,
                    } as CSSProperties
                  }
                  aria-label={`Spot 0${i + 1}: ${s.title}`}
                  aria-pressed={active === i}
                  onClick={() => select(i)}
                >
                  <span className="atmo-hot-inner">
                    <span className="atmo-hot-label">0{i + 1}</span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="atmo-info">
            <div className="atmo-details">
              <span className="atmo-count" ref={countRef}>
                0{active + 1}/04
              </span>
              <div className="atmo-illus">
                <span
                  className="atmo-icon"
                  aria-hidden="true"
                  ref={iconRef}
                  style={{ '--atmo-icon': ICONS[active] } as CSSProperties}
                />
                <div className="atmo-text">
                  <div className="atmo-h3text">
                    <h3 ref={h3Ref}>{spot.title}</h3>
                    <p className="atmo-desc" ref={descRef}>
                      {spot.text}
                    </p>
                  </div>
                  <div className="atmo-tags">
                    {spot.tags.map((tag, i) => (
                      <span
                        key={tag}
                        ref={(el) => {
                          tagRefs.current[i] = el
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="atmo-tabs" role="tablist" aria-label="Choose a spot">
              {SPOTS.map((s, i) => (
                <button
                  type="button"
                  role="tab"
                  key={s.title}
                  className={`atmo-tab${active === i ? ' is-active' : ''}`}
                  aria-selected={active === i}
                  style={{ '--i': i } as CSSProperties}
                  onClick={() => select(i)}
                >
                  <span className="atmo-tab-idx">0{i + 1}</span>
                  <span className="atmo-tab-title">{s.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
