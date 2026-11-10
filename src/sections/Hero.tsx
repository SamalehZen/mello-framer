import type { CSSProperties } from 'react'
import crown from '@/assets/img/doodle-crown.svg'
import sun from '@/assets/img/doodle-sun.svg'
import matcha512 from '@/assets/img/matcha-512.png'
import matcha1280 from '@/assets/img/matcha-1280.png'
import matcha512Avif from '@/assets/img/matcha-512.avif'
import matcha1280Avif from '@/assets/img/matcha-1280.avif'
import matcha512Webp from '@/assets/img/matcha-512.webp'
import matcha1280Webp from '@/assets/img/matcha-1280.webp'
import arrow from '@/assets/img/doodle-arrow.svg'
import flower from '@/assets/img/doodle-flower.svg'

const HERO_SIZES = '(max-width: 767.98px) 326px, 1072px'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="line">
            <span className="w" style={{ '--i': 0 } as CSSProperties}>
              A
            </span>
            <span className="w" style={{ '--i': 1 } as CSSProperties}>
              brighter
            </span>
            <span className="w" style={{ '--i': 2 } as CSSProperties}>
              kind
            </span>
          </span>
          <span className="line">
            <span className="w" style={{ '--i': 3 } as CSSProperties}>
              of coffee
            </span>
            <span className="w" style={{ '--i': 4 } as CSSProperties}>
              break
            </span>
          </span>
        </h1>

        <div className="hero-actions">
          <a className="btn btn-primary" href="#menu">
            <span>Explore the menu</span>
          </a>
          <a
            className="btn btn-secondary"
            href="https://google.com/maps"
            target="_blank"
            rel="noreferrer"
          >
            <span>Get directions</span>
          </a>
        </div>

        <div className="hero-media">
          <picture>
            <source
              type="image/avif"
              srcSet={`${matcha512Avif} 512w, ${matcha1280Avif} 1280w`}
              sizes={HERO_SIZES}
            />
            <source
              type="image/webp"
              srcSet={`${matcha512Webp} 512w, ${matcha1280Webp} 1280w`}
              sizes={HERO_SIZES}
            />
            <img
              className="hero-img"
              src={matcha1280}
              srcSet={`${matcha512} 512w, ${matcha1280} 1280w`}
              sizes={HERO_SIZES}
              alt=""
              width={1280}
              height={960}
              fetchPriority="high"
              decoding="async"
              draggable="false"
            />
          </picture>
          <div className="hero-note">
            <span className="note-bar" aria-hidden="true" />
            <div>
              <p className="note-title">Cold matcha</p>
              <p className="note-sub">
                <span>Matcha</span>
                <span className="dot" />
                <span>Plenty of ice</span>
              </p>
              <p className="note-price">
                $6.00 <span className="chip">16 oz</span>
              </p>
            </div>
          </div>
          <img className="doodle doodle-arrow" src={arrow} alt="" aria-hidden="true" />
          <div className="hero-quality">
            <img className="doodle doodle-flower" src={flower} alt="" aria-hidden="true" />
            <div className="hero-hand">
              <span>100% pure</span>
              <span>green energy</span>
            </div>
          </div>
        </div>

        <img className="doodle doodle-crown" src={crown} alt="" aria-hidden="true" />
        <img className="doodle doodle-sun" src={sun} alt="" aria-hidden="true" />
      </div>
    </section>
  )
}
