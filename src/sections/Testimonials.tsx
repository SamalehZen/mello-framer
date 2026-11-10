import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { prefersReducedMotion } from '@/hooks/useReveal'

const dataMask = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

const LEAF_SVG =
  '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M 0 46.175 C 0.186 41.886 0.813 37.667 2.46 33.746 C 5.645 26.181 8.86 18.636 12.829 11.489 C 14.79 7.965 17.053 4.669 19.572 1.581 C 21.082 -0.275 21.817 -0.444 23.728 0.797 C 25.1 1.69 26.404 2.723 27.697 3.755 C 28.53 4.42 28.775 5.235 28.52 6.466 C 27.295 12.541 26.011 18.617 25.11 24.752 C 23.934 32.733 23.718 40.804 24.237 48.875 C 24.336 50.483 24.345 52.102 24.296 53.72 C 24.247 55.546 23.365 56.569 21.66 56.45 C 19.798 56.311 17.926 56.003 16.122 55.507 C 11.604 54.256 7.115 52.846 2.617 51.506 C 0.735 50.95 0.088 50.076 0.01 47.922 C -0.01 47.346 0.01 46.771 0.01 46.195 Z" fill="#000" transform="translate(8 0)"/><path d="M 0.01 14.36 C 0.147 11.58 0.284 8.642 0.421 5.713 C 0.421 5.594 0.421 5.485 0.441 5.366 C 0.755 2.358 1.666 1.117 4.42 0.531 C 6.292 0.134 8.203 -0.273 10.163 0.243 C 11.32 0.541 11.849 1.206 12.114 2.417 C 13.417 8.304 14.721 14.201 16.995 19.75 C 19.376 25.568 22.199 31.137 26.129 35.962 C 26.943 36.954 27.628 38.066 28.403 39.099 C 28.765 39.585 29.138 40.082 29.598 40.449 C 30.265 40.985 30.294 41.6 29.902 42.246 C 29.589 42.772 29.187 43.268 28.736 43.655 C 24.345 47.368 19.984 51.111 15.515 54.705 C 14.211 55.757 12.643 56.501 11.094 57.117 C 8.811 58.03 7.547 57.395 6.537 55.042 C 4.185 49.572 2.695 43.814 1.705 37.898 C 0.843 32.785 0.49 27.623 0.353 22.441 C 0.284 19.79 0.127 17.149 0 14.34 Z" fill="#000" transform="translate(40.843 22.483)"/></svg>'

const STAR_SVG =
  '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M 1.011 30.724 C 5.358 33.624 10.312 35.511 14.659 38.412 C 17.594 39.761 20.477 41.262 23.341 42.824 C 21.493 48.998 19.036 54.97 18 61.347 C 17.698 63.07 18.461 64.743 19.64 65.981 C 26.158 61.43 32.228 56.189 38.614 51.425 C 47.408 56.212 55.99 61.334 64.824 66 L 67.833 62.746 C 64.331 54.249 60.433 45.924 56.768 37.508 C 61.724 33.687 66.63 29.815 71.647 26.115 C 73.948 24.179 77.01 22.598 78 19.516 C 77.421 19.222 76.253 18.562 75.674 18.268 C 66.714 17.546 57.838 19.623 48.95 20.311 C 44.983 13.517 43.581 4.503 36.552 0 C 33.823 7.401 31.358 14.924 29.39 22.578 C 19.61 23.813 9.739 24.511 0 26.334 C 0.256 27.804 0.613 29.274 1.011 30.724 Z" fill="#000" transform="translate(1 7)"/></svg>'

const ARROW_LEFT_SVG =
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 8.378 0 C 8.591 0 8.803 0.042 9 0.124 C 9.197 0.206 9.377 0.325 9.528 0.477 C 9.679 0.628 9.799 0.807 9.881 1.004 C 9.963 1.201 10.005 1.413 10.005 1.627 C 10.005 1.841 9.963 2.053 9.881 2.25 C 9.799 2.447 9.679 2.626 9.528 2.777 L 5.553 6.751 L 18.126 6.751 C 18.557 6.751 18.971 6.922 19.275 7.227 C 19.58 7.531 19.751 7.945 19.751 8.376 C 19.751 8.807 19.58 9.221 19.275 9.525 C 18.971 9.83 18.557 10.001 18.126 10.001 L 5.552 10.001 L 9.528 13.977 C 9.833 14.282 10.005 14.696 10.005 15.127 C 10.005 15.558 9.833 15.972 9.528 16.277 C 9.223 16.582 8.809 16.754 8.378 16.754 C 7.946 16.754 7.533 16.582 7.228 16.277 L 0.478 9.527 C 0.326 9.376 0.206 9.197 0.124 9 C 0.042 8.803 0 8.591 0 8.377 C 0 8.163 0.042 7.951 0.124 7.754 C 0.206 7.556 0.326 7.377 0.478 7.226 L 7.228 0.477 C 7.379 0.326 7.558 0.206 7.755 0.124 C 7.952 0.042 8.164 0 8.378 0 Z" fill="#000" transform="translate(2.124 3.624)"/></svg>'

const ARROW_RIGHT_SVG =
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M 11.376 0 C 11.807 0 12.221 0.171 12.526 0.477 L 19.276 7.227 C 19.428 7.378 19.548 7.557 19.63 7.755 C 19.712 7.952 19.753 8.164 19.753 8.378 C 19.753 8.592 19.71 8.804 19.628 9.002 C 19.546 9.199 19.425 9.377 19.273 9.527 L 19.274 9.528 L 12.524 16.278 C 12.219 16.583 11.806 16.755 11.374 16.755 C 10.943 16.755 10.529 16.583 10.224 16.278 C 9.918 15.973 9.747 15.559 9.747 15.128 C 9.747 14.696 9.918 14.283 10.224 13.978 L 14.199 10.004 L 1.625 10.004 C 1.194 10.004 0.78 9.833 0.476 9.528 C 0.171 9.224 0 8.81 0 8.379 C 0 7.948 0.171 7.534 0.476 7.229 C 0.78 6.925 1.194 6.754 1.625 6.754 L 14.2 6.754 L 10.226 2.777 C 9.921 2.472 9.749 2.058 9.749 1.627 C 9.749 1.195 9.921 0.782 10.226 0.477 C 10.531 0.171 10.944 0 11.376 0 Z" fill="#000" transform="translate(2.125 3.621)"/></svg>'

const MASKS = {
  leaf: dataMask(LEAF_SVG),
  star: dataMask(STAR_SVG),
  left: dataMask(ARROW_LEFT_SVG),
  right: dataMask(ARROW_RIGHT_SVG),
}

type Slide = { rating: string; name: string; words: string[] }

const SLIDES: Slide[] = [
  {
    rating: '4.9',
    name: 'Mia Carter',
    words: [
      'Come',
      'for',
      'the',
      'great',
      'coffee,',
      'stay\u00A0for',
      'the',
      'perfect',
      'playlist',
      'and',
      'those',
      'cinnamon',
      'buns',
      'you’ll\u00A0keep',
      'thinking',
      'about.',
    ],
  },
  {
    rating: '5.0',
    name: 'Jamie Brooks',
    words: [
      'Everything',
      'you',
      'want',
      'from',
      'a',
      'neighborhood',
      'coffee',
      'shop:',
      'warm,',
      'welcoming,',
      'and',
      'always',
      'worth',
      'the',
      'walk.',
    ],
  },
  {
    rating: '5.0',
    name: 'Alex Morgan',
    words: [
      'The',
      'cold',
      'brew',
      'is',
      'smooth,',
      'the\u00A0space',
      'feels',
      'effortless,',
      'and\u00A0everyone',
      'behind',
      'the',
      'counter',
      'is',
      'genuinely',
      'lovely.',
    ],
  },
]

const SIDE_W = 640
const AUTOPLAY_MS = 5100

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [width, setWidth] = useState(0)
  const [contentIn, setContentIn] = useState(prefersReducedMotion)
  const [navIn, setNavIn] = useState(prefersReducedMotion)
  const [isSlideMode, setIsSlideMode] = useState(false)

  const stageRef = useRef<HTMLDivElement | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const el = stageRef.current
    if (!el) return
    const measure = () => setWidth(el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    const nav = navRef.current
    const ioContent = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setContentIn(true)
          ioContent.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    const ioNav = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNavIn(true)
          ioNav.disconnect()
        }
      },
      { threshold: 0 },
    )
    if (stage) ioContent.observe(stage)
    if (nav) ioNav.observe(nav)
    return () => {
      ioContent.disconnect()
      ioNav.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!contentIn || prefersReducedMotion()) return
    const t = window.setTimeout(() => {
      setIsSlideMode(true)
      setActive((a) => (a + 1) % SLIDES.length)
    }, AUTOPLAY_MS)
    return () => window.clearTimeout(t)
  }, [active, contentIn])

  const step = (dir: number) => {
    setIsSlideMode(true)
    setActive((a) => (a + dir + SLIDES.length) % SLIDES.length)
  }

  return (
    <section
      className={`tst${contentIn ? ' is-content-in' : ''}${navIn ? ' is-nav-in' : ''}`}
      aria-label="Testimonials"
      style={
        {
          '--tst-leaf': MASKS.leaf,
          '--tst-star': MASKS.star,
          '--tst-arrow-left': MASKS.left,
          '--tst-arrow-right': MASKS.right,
        } as CSSProperties
      }
    >
      <div className="tst-stage" ref={stageRef}>
        {SLIDES.map((slide, i) => {
          const isActive = i === active
          const slot = (i - active + SLIDES.length) % SLIDES.length
          const offset = slot === 0 ? 0 : slot === 1 ? 1.25 * width : -1.25 * width
          return (
            <article
              key={slide.name}
              className={`tst-card${isActive ? ' is-active' : ''}${isActive && isSlideMode ? ' is-slide' : ''}`}
              aria-hidden={isActive ? undefined : true}
              style={
                {
                  '--card-w': `${isActive ? width : SIDE_W}px`,
                  '--tx': `${offset}px`,
                } as CSSProperties
              }
            >
              {isActive ? (
                <>
                  <div className="tst-deco" aria-hidden="true" />
                  <p className="tst-quote">
                    {slide.words.map((w, wi) => (
                      <Fragment key={w + wi}>
                        <span style={{ '--i': wi } as CSSProperties}>{w}</span>
                        {wi < slide.words.length - 1 ? ' ' : null}
                      </Fragment>
                    ))}
                  </p>
                  <div className="tst-rating">
                    <div className="tst-score">
                      <span className="tst-star" aria-hidden="true" />
                      <span className="tst-score-text">
                        <p>{slide.rating}</p>
                      </span>
                    </div>
                    <span className="tst-divider" aria-hidden="true" />
                    <p className="tst-name">{slide.name}</p>
                  </div>
                </>
              ) : null}
            </article>
          )
        })}
      </div>

      <div className="tst-nav" ref={navRef}>
        <button
          type="button"
          className="tst-btn tst-prev"
          aria-label="Previous testimonial"
          onClick={() => step(-1)}
        >
          <span className="tst-arrow" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="tst-btn tst-next"
          aria-label="Next testimonial"
          onClick={() => step(1)}
        >
          <span className="tst-arrow" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
